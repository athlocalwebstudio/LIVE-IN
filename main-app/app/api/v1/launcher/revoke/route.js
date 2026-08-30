import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function POST(request) {
  try {
    const supabase = await createClient();

    /*
     * ============================================================
     * 1. Verify authenticated browser user
     * ============================================================
     */

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    /*
     * ============================================================
     * 2. Read refresh token
     * ============================================================
     */

    const body = await request.json();

    const { refreshToken } = body ?? {};

    if (
      typeof refreshToken !== "string" ||
      refreshToken.length === 0
    ) {
      return NextResponse.json(
        {
          error: "invalid_request",
          error_description:
            "Missing refresh token.",
        },
        { status: 400 }
      );
    }

    /*
     * ============================================================
     * 3. Hash refresh token
     * ============================================================
     */

    const refreshTokenHash =
      hashToken(refreshToken);

    /*
     * ============================================================
     * 4. Find the session belonging to this user
     * ============================================================
     */

    const { data: session, error: sessionError } =
      await supabase
        .from("launcher_sessions")
        .select(
          `
            id,
            user_id,
            refresh_token_hash,
            revoked_at
          `
        )
        .eq(
          "refresh_token_hash",
          refreshTokenHash
        )
        .eq("user_id", user.id)
        .maybeSingle();

    if (sessionError) {
      console.error(
        "LAUNCHER REVOKE SESSION LOOKUP ERROR:",
        sessionError
      );

      return NextResponse.json(
        {
          error: "server_error",
          error_description:
            "Could not revoke launcher session.",
        },
        { status: 500 }
      );
    }

    /*
     * If the session doesn't exist, treat it as already revoked.
     */

    if (!session) {
      return new NextResponse(null, {
        status: 204,
      });
    }

    /*
     * ============================================================
     * 5. Revoke session
     * ============================================================
     */

    const { error: revokeError } =
      await supabase
        .from("launcher_sessions")
        .update({
          revoked_at:
            new Date().toISOString(),
        })
        .eq("id", session.id)
        .eq("user_id", user.id);

    if (revokeError) {
      console.error(
        "LAUNCHER REVOKE UPDATE ERROR:",
        revokeError
      );

      return NextResponse.json(
        {
          error: "server_error",
          error_description:
            "Could not revoke launcher session.",
        },
        { status: 500 }
      );
    }

    /*
     * Successful revocation.
     */

    return new NextResponse(null, {
      status: 204,
    });
  } catch (error) {
    console.error(
      "POST /api/v1/launcher/revoke ERROR:",
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