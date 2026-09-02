
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

    const supabase = createAdminClient();

    const { data: session, error: sessionError } =
      await supabase
        .from("launcher_sessions")
        .select(
          `
            id,
            user_id,
            access_token_hash,
            expires_at,
            revoked_at
          `
        )
        .eq(
          "access_token_hash",
          await hashAccessToken(accessToken)
        )
        .maybeSingle();

    if (sessionError) {
      console.error(
        "ME SESSION LOOKUP ERROR:",
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

    const {
      data: userData,
      error: userError,
    } = await supabase.auth.admin.getUserById(
      session.user_id
    );

    if (userError || !userData?.user) {
      console.error(
        "ME USER FETCH ERROR:",
        userError
      );

      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = userData.user;

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("id, display_name")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error(
        "ME PROFILE FETCH ERROR:",
        profileError
      );

      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      displayName: profile.display_name,
      emailVerified: Boolean(
        user.email_confirmed_at
      ),
    });
  } catch (error) {
    console.error("ME API ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function hashAccessToken(token) {
  const crypto = await import("crypto");

  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

