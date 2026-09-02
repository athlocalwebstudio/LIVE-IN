
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function GET(request) {
  try {
    const authorizationHeader =
      request.headers.get("authorization");

    if (
      typeof authorizationHeader !== "string" ||
      !authorizationHeader.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const accessToken =
      authorizationHeader.slice("Bearer ".length).trim();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const accessTokenHash =
      hashToken(accessToken);

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
          expires_at,
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
        "LIBRARY SESSION LOOKUP ERROR:",
        sessionError
      );

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.revoked_at) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (
      new Date(session.expires_at).getTime() <=
      Date.now()
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      subscription: null,
      games: [],
    });
  } catch (error) {
    console.error(
      "LIBRARY API ERROR:",
      error
    );

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

