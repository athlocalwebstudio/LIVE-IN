
  import { createAdminClient } from "@/lib/supabase/admin";
  import { NextResponse } from "next/server";
  import crypto from "crypto";

  function hashToken(token) {
    return crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
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
      /*
      * ============================================================
      * 1. READ ACCESS TOKEN
      * ============================================================
      */

      const authorizationHeader =
        request.headers.get("authorization");

      if (
        typeof authorizationHeader !== "string" ||
        !authorizationHeader.startsWith("Bearer ")
      ) {
        return NextResponse.json(
          {
            error: "Unauthorized",
          },
          { status: 401 }
        );
      }

      const accessToken =
        authorizationHeader.slice("Bearer ".length).trim();

      if (!accessToken) {
        return NextResponse.json(
          {
            error: "Unauthorized",
          },
          { status: 401 }
        );
      }

      /*
      * ============================================================
      * 2. READ REFRESH TOKEN
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
      * 3. HASH TOKENS
      * ============================================================
      */

      const accessTokenHash =
        hashToken(accessToken);

      const refreshTokenHash =
        hashToken(refreshToken);

      /*
      * ============================================================
      * 4. FIND LAUNCHER SESSION
      * ============================================================
      */

      const supabase = createAdminClient();

      const {
        data: session,
        error: sessionError,
      } = await supabase
        .from("launcher_sessions")
        .select(
          `
            id,
            user_id,
            access_token_hash,
            refresh_token_hash,
            revoked_at
          `
        )
        .eq(
          "access_token_hash",
          accessTokenHash
        )
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
              "Could not verify launcher session.",
          },
          { status: 500 }
        );
      }

      /*
      * ============================================================
      * 5. VERIFY SESSION
      * ============================================================
      */

      if (!session) {
        return NextResponse.json(
          {
            error: "Unauthorized",
          },
          { status: 401 }
        );
      }

      /*
      * The access token must still belong to this session.
      */

      if (
        !safeEqualStrings(
          session.access_token_hash,
          accessTokenHash
        )
      ) {
        return NextResponse.json(
          {
            error: "Unauthorized",
          },
          { status: 401 }
        );
      }

      /*
      * ============================================================
      * 6. VERIFY REFRESH TOKEN
      * ============================================================
      */

      if (
        !safeEqualStrings(
          session.refresh_token_hash,
          refreshTokenHash
        )
      ) {
        return NextResponse.json(
          {
            error: "invalid_grant",
            error_description:
              "Refresh token does not belong to this session.",
          },
          { status: 400 }
        );
      }

      /*
      * ============================================================
      * 7. REVOKE SESSION
      * ============================================================
      *
      * Even if the session was already revoked, the operation
      * remains idempotent.
      */

      if (!session.revoked_at) {
        const {
          error: revokeError,
        } = await supabase
          .from("launcher_sessions")
          .update({
            revoked_at:
              new Date().toISOString(), 
          })
          .eq("id", session.id)
          .eq(
            "access_token_hash",
            accessTokenHash
          )
          .eq(
            "refresh_token_hash",
            refreshTokenHash
          );

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
      }

      /*
      * ============================================================
      * 8. SUCCESS
      * ============================================================
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

