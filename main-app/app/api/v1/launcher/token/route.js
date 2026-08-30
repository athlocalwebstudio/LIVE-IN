import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import crypto from "crypto";

const ACCESS_TOKEN_TTL_SECONDS = 900;
const REFRESH_TOKEN_TTL_DAYS = 30;
const LAUNCHER_CLIENT_ID = "playlive-launcher";

function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function createToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function isValidLoopbackRedirect(redirectUri) {
  try {
    const url = new URL(redirectUri);

    if (url.protocol !== "http:") {
      return false;
    }

    if (url.hostname !== "127.0.0.1") {
      return false;
    }

    if (url.pathname !== "/callback") {
      return false;
    }

    if (url.search || url.hash) {
      return false;
    }

    const port = Number(url.port);

    return (
      Number.isInteger(port) &&
      port >= 1024 &&
      port <= 65535
    );
  } catch {
    return false;
  }
}

function safeEqualStrings(a, b) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      grantType,
      code,
      codeVerifier,
      redirectUri,
      refreshToken,
    } = body ?? {};

    /*
     * ============================================================
     * AUTHORIZATION CODE GRANT
     * ============================================================
     */

    if (grantType === "authorization_code") {
      if (!code || !codeVerifier || !redirectUri) {
        return NextResponse.json(
          {
            error: "invalid_request",
            error_description:
              "Missing authorization code parameters.",
          },
          { status: 400 }
        );
      }

      if (!isValidLoopbackRedirect(redirectUri)) {
        return NextResponse.json(
          {
            error: "invalid_grant",
            error_description:
              "Invalid loopback redirect URI.",
          },
          { status: 400 }
        );
      }

      /*
       * IMPORTANT:
       *
       * Token exchange happens outside the browser's
       * authenticated Supabase session.
       *
       * Therefore database operations here MUST use
       * the Supabase admin client.
       */

      const supabase = createAdminClient();

      /*
       * ========================================================
       * FIND AUTHORIZATION CODE
       * ========================================================
       */

      const {
        data: authorizationCode,
        error: lookupError,
      } = await supabase
        .from("launcher_authorization_codes")
        .select(
          `
            id,
            code,
            user_id,
            client_id,
            redirect_uri,
            code_challenge,
            code_challenge_method,
            expires_at,
            used_at
          `
        )
        .eq("code", code)
        .maybeSingle();

      if (lookupError) {
        console.error(
          "TOKEN AUTHORIZATION CODE LOOKUP ERROR:",
          lookupError
        );

        return NextResponse.json(
          {
            error: "server_error",
            error_description:
              "Could not verify authorization code.",
          },
          { status: 500 }
        );
      }

      if (!authorizationCode) {
        return NextResponse.json(
          {
            error: "invalid_grant",
            error_description:
              "Authorization code is invalid.",
          },
          { status: 400 }
        );
      }

      /*
       * ========================================================
       * VERIFY CLIENT
       * ========================================================
       */

      if (
        authorizationCode.client_id !==
        LAUNCHER_CLIENT_ID
      ) {
        return NextResponse.json(
          {
            error: "invalid_grant",
            error_description:
              "Invalid launcher client.",
          },
          { status: 400 }
        );
      }

      /*
       * ========================================================
       * VERIFY EXACT REDIRECT URI
       * ========================================================
       */

      if (
        authorizationCode.redirect_uri !==
        redirectUri
      ) {
        console.error(
          "REDIRECT URI MISMATCH:",
          {
            stored: authorizationCode.redirect_uri,
            received: redirectUri,
          }
        );

        return NextResponse.json(
          {
            error: "invalid_grant",
            error_description:
              "Redirect URI mismatch.",
          },
          { status: 400 }
        );
      }

      /*
       * ========================================================
       * SINGLE USE
       * ========================================================
       */

      if (authorizationCode.used_at) {
        return NextResponse.json(
          {
            error: "invalid_grant",
            error_description:
              "Authorization code has already been used.",
          },
          { status: 400 }
        );
      }

      /*
       * ========================================================
       * EXPIRY
       * ========================================================
       */

      if (
        new Date(
          authorizationCode.expires_at
        ).getTime() <= Date.now()
      ) {
        return NextResponse.json(
          {
            error: "invalid_grant",
            error_description:
              "Authorization code has expired.",
          },
          { status: 400 }
        );
      }

      /*
       * ========================================================
       * PKCE
       * ========================================================
       */

      if (
        authorizationCode.code_challenge_method !==
        "S256"
      ) {
        return NextResponse.json(
          {
            error: "invalid_grant",
            error_description:
              "Unsupported code challenge method.",
          },
          { status: 400 }
        );
      }

      const calculatedChallenge = crypto
        .createHash("sha256")
        .update(codeVerifier)
        .digest("base64url");

      if (
        !safeEqualStrings(
          calculatedChallenge,
          authorizationCode.code_challenge
        )
      ) {
        return NextResponse.json(
          {
            error: "invalid_grant",
            error_description:
              "PKCE verification failed.",
          },
          { status: 400 }
        );
      }

      /*
       * ========================================================
       * CONSUME AUTHORIZATION CODE
       * ========================================================
       */

      const {
        data: consumedCode,
        error: consumeError,
      } = await supabase
        .from("launcher_authorization_codes")
        .update({
          used_at: new Date().toISOString(),
        })
        .eq("id", authorizationCode.id)
        .is("used_at", null)
        .select("id")
        .maybeSingle();

      if (consumeError) {
        console.error(
          "TOKEN AUTHORIZATION CODE CONSUME ERROR:",
          consumeError
        );

        return NextResponse.json(
          {
            error: "server_error",
            error_description:
              "Could not consume authorization code.",
          },
          { status: 500 }
        );
      }

      if (!consumedCode) {
        return NextResponse.json(
          {
            error: "invalid_grant",
            error_description:
              "Authorization code has already been used.",
          },
          { status: 400 }
        );
      }

      /*
       * ========================================================
       * CREATE TOKENS
       * ========================================================
       */

      const accessToken = createToken();
      const newRefreshToken = createToken();

      const accessTokenHash =
        hashToken(accessToken);

      const refreshTokenHash =
        hashToken(newRefreshToken);

      const refreshExpiresAt = new Date(
        Date.now() +
          REFRESH_TOKEN_TTL_DAYS *
            24 *
            60 *
            60 *
            1000
      ).toISOString();

      /*
       * ========================================================
       * CREATE LAUNCHER SESSION
       * ========================================================
       */

      const {
        data: session,
        error: sessionError,
      } = await supabase
        .from("launcher_sessions")
        .insert({
          user_id: authorizationCode.user_id,
          access_token_hash: accessTokenHash,
          refresh_token_hash: refreshTokenHash,
          expires_at: refreshExpiresAt,
        })
        .select("id")
        .single();

      if (sessionError) {
        console.error(
          "TOKEN SESSION INSERT ERROR:",
          sessionError
        );

        return NextResponse.json(
          {
            error: "server_error",
            error_description:
              "Could not create launcher session.",
          },
          { status: 500 }
        );
      }

      console.log(
        "LAUNCHER SESSION CREATED:",
        session.id
      );

      /*
       * ========================================================
       * RETURN TOKENS
       * ========================================================
       */

      return NextResponse.json({
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: ACCESS_TOKEN_TTL_SECONDS,
        tokenType: "Bearer",
      });
    }

    /*
     * ============================================================
     * REFRESH TOKEN GRANT
     * ============================================================
     */

    if (grantType === "refresh_token") {
      if (!refreshToken) {
        return NextResponse.json(
          {
            error: "invalid_request",
            error_description:
              "Missing refresh token.",
          },
          { status: 400 }
        );
      }

      const supabase = createAdminClient();

      const refreshTokenHash =
        hashToken(refreshToken);

      const {
        data: session,
        error: sessionError,
      } = await supabase
        .from("launcher_sessions")
        .select(
          `
            id,
            user_id,
            refresh_token_hash,
            expires_at,
            revoked_at
          `
        )
        .eq(
          "refresh_token_hash",
          refreshTokenHash
        )
        .maybeSingle();

      if (sessionError) {
        console.error(
          "TOKEN REFRESH SESSION LOOKUP ERROR:",
          sessionError
        );

        return NextResponse.json(
          {
            error: "server_error",
            error_description:
              "Could not verify refresh token.",
          },
          { status: 500 }
        );
      }

      if (!session) {
        return NextResponse.json(
          {
            error: "invalid_grant",
            error_description:
              "Refresh token is invalid.",
          },
          { status: 400 }
        );
      }

      if (session.revoked_at) {
        return NextResponse.json(
          {
            error: "invalid_grant",
            error_description:
              "Refresh token has been revoked.",
          },
          { status: 400 }
        );
      }

      if (
        new Date(session.expires_at).getTime() <=
        Date.now()
      ) {
        return NextResponse.json(
          {
            error: "invalid_grant",
            error_description:
              "Refresh token has expired.",
          },
          { status: 400 }
        );
      }

      /*
       * ========================================================
       * ROTATE REFRESH TOKEN
       * ========================================================
       */

      const rotatedRefreshToken =
        createToken();

      const rotatedRefreshTokenHash =
        hashToken(rotatedRefreshToken);

      const newRefreshExpiresAt =
        new Date(
          Date.now() +
            REFRESH_TOKEN_TTL_DAYS *
              24 *
              60 *
              60 *
              1000
        ).toISOString();

      const {
        error: rotateError,
      } = await supabase
        .from("launcher_sessions")
        .update({
          refresh_token_hash:
            rotatedRefreshTokenHash,
          expires_at:
            newRefreshExpiresAt,
          last_used_at:
            new Date().toISOString(),
        })
        .eq("id", session.id)
        .eq(
          "refresh_token_hash",
          refreshTokenHash
        );

      if (rotateError) {
        console.error(
          "TOKEN REFRESH ROTATION ERROR:",
          rotateError
        );

        return NextResponse.json(
          {
            error: "server_error",
            error_description:
              "Could not rotate refresh token.",
          },
          { status: 500 }
        );
      }

      /*
       * ========================================================
       * ROTATE ACCESS TOKEN
       * ========================================================
       */

      const accessToken = createToken();

      const accessTokenHash =
        hashToken(accessToken);

      const {
        error: accessTokenUpdateError,
      } = await supabase
        .from("launcher_sessions")
        .update({
          access_token_hash:
            accessTokenHash,
        })
        .eq("id", session.id);

      if (accessTokenUpdateError) {
        console.error(
          "TOKEN ACCESS TOKEN UPDATE ERROR:",
          accessTokenUpdateError
        );

        return NextResponse.json(
          {
            error: "server_error",
            error_description:
              "Could not update access token.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        accessToken,
        refreshToken:
          rotatedRefreshToken,
        expiresIn:
          ACCESS_TOKEN_TTL_SECONDS,
        tokenType: "Bearer",
      });
    }

    /*
     * ============================================================
     * UNSUPPORTED GRANT
     * ============================================================
     */

    return NextResponse.json(
      {
        error: "unsupported_grant_type",
        error_description:
          "Unsupported grant type.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error(
      "POST /api/v1/launcher/token ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "server_error",
        error_description:
          "Internal server error.",
      },
      { status: 500 }
    );
  }
}