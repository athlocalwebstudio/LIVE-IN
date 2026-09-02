
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

const LAUNCHER_CLIENT_ID = "playlive-launcher";
const LAUNCHER_RESPONSE_TYPE = "code";

/*
 * ============================================================
 * LOOPBACK REDIRECT VALIDATION
 * ============================================================
 *
 * Unity creates a random local callback such as:
 *
 *   http://127.0.0.1:54321/callback
 *
 * The exact URI is stored with the authorization code and must
 * match exactly during token exchange.
 */

function isValidLoopbackRedirect(redirectUri) {
  try {
    const url = new URL(redirectUri);

    if (url.protocol !== "http:") {
      return false;
    }

    if (
      url.hostname !== "127.0.0.1" &&
      url.hostname !== "localhost"
    ) {
      return false;
    }

    if (url.pathname !== "/callback") {
      return false;
    }

    if (url.search || url.hash) {
      return false;
    }

    const port = Number(url.port);

    if (!Number.isInteger(port)) {
      return false;
    }

    if (port < 1024 || port > 65535) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/*
 * ============================================================
 * BASE64URL VALIDATION
 * ============================================================
 */

function isValidBase64Url(value) {
  return (
    typeof value === "string" &&
    value.length >= 43 &&
    value.length <= 128 &&
    /^[A-Za-z0-9_-]+$/.test(value)
  );
}

/*
 * ============================================================
 * POST /api/v1/launcher/authorize
 * ============================================================
 *
 * This endpoint is called by the authorization page after the
 * signed-in user clicks "Continue to Launcher".
 *
 * IMPORTANT:
 *
 * We do NOT trust client_id or response_type from Unity.
 *
 * They are defined server-side:
 *
 *   client_id    = playlive-launcher
 *   responseType = code
 *
 * This matches the actual Unity V7 client contract.
 */

export async function POST(request) {
  try {
    /*
     * ==========================================================
     * 1. VERIFY BROWSER AUTHENTICATION
     * ==========================================================
     */

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          error_description:
            "You must be signed in to authorize the launcher.",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * ==========================================================
     * 2. READ FORM DATA
     * ==========================================================
     */

    const formData = await request.formData();

    /*
     * The browser form contains these values because the
     * authorization page generated them from the Unity request.
     */

    const redirectUri = formData.get("redirect_uri");
    const codeChallenge = formData.get("code_challenge");
    const codeChallengeMethod =
      formData.get("code_challenge_method");
    const state = formData.get("state");

    /*
     * ==========================================================
     * 3. SERVER-DEFINED LAUNCHER IDENTITY
     * ==========================================================
     *
     * DO NOT read client_id or response_type from the request.
     */

    const clientId = LAUNCHER_CLIENT_ID;
    const responseType = LAUNCHER_RESPONSE_TYPE;

    /*
     * ==========================================================
     * 4. VALIDATE RESPONSE TYPE
     * ==========================================================
     */

    if (responseType !== "code") {
      return NextResponse.json(
        {
          error: "invalid_request",
          error_description:
            "Unsupported response type.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================================
     * 5. VALIDATE REDIRECT URI
     * ==========================================================
     */

    if (
      typeof redirectUri !== "string" ||
      !isValidLoopbackRedirect(redirectUri)
    ) {
      return NextResponse.json(
        {
          error: "invalid_request",
          error_description:
            "Invalid redirect_uri.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================================
     * 6. VALIDATE PKCE
     * ==========================================================
     */

    if (
      typeof codeChallenge !== "string" ||
      !isValidBase64Url(codeChallenge)
    ) {
      return NextResponse.json(
        {
          error: "invalid_request",
          error_description:
            "Invalid code_challenge.",
        },
        {
          status: 400,
        }
      );
    }

    if (codeChallengeMethod !== "S256") {
      return NextResponse.json(
        {
          error: "invalid_request",
          error_description:
            "Unsupported code_challenge_method.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================================
     * 7. VALIDATE STATE
     * ==========================================================
     *
     * Unity generates state and requires the same state to come
     * back in the local callback.
     */

    if (
      typeof state !== "string" ||
      !isValidBase64Url(state)
    ) {
      return NextResponse.json(
        {
          error: "invalid_request",
          error_description:
            "Invalid state.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================================
     * 8. CREATE AUTHORIZATION CODE
     * ==========================================================
     */

    const authorizationCode =
      crypto.randomBytes(32).toString("base64url");

    /*
     * ==========================================================
     * 9. STORE AUTHORIZATION CODE
     * ==========================================================
     *
     * The authorization code is permanently bound to:
     *
     *   - authenticated Supabase user
     *   - PlayLive launcher client
     *   - exact loopback redirect URI
     *   - PKCE challenge
     *   - S256 method
     *
     * It expires after 3 minutes.
     */

    const expiresAt = new Date(
      Date.now() + 3 * 60 * 1000
    ).toISOString();

    const {
      error: insertError,
    } = await supabase
      .from("launcher_authorization_codes")
      .insert({
        code: authorizationCode,
        user_id: user.id,
        client_id: clientId,
        redirect_uri: redirectUri,
        code_challenge: codeChallenge,
        code_challenge_method: codeChallengeMethod,
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error(
        "AUTHORIZATION CODE INSERT ERROR:",
        insertError
      );

      return NextResponse.json(
        {
          error: "server_error",
          error_description:
            "Could not create authorization code.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ==========================================================
     * 10. REDIRECT BACK TO UNITY
     * ==========================================================
     *
     * Unity's local TCP listener receives:
     *
     *   /callback?code=...&state=...
     *
     * Unity then verifies state and exchanges the authorization
     * code using its original PKCE verifier.
     */

    const callbackUrl = new URL(redirectUri);

    callbackUrl.searchParams.set(
      "code",
      authorizationCode
    );

    callbackUrl.searchParams.set(
      "state",
      state
    );

    return NextResponse.redirect(callbackUrl);
  } catch (error) {
    console.error(
      "POST /api/v1/launcher/authorize ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "server_error",
        error_description:
          "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}

