
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { authenticateLauncherRequest } from "@/lib/launcher-auth";

export async function GET(request) {
  try {
    const auth = await authenticateLauncherRequest(request);

    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(auth.userId);

    if (userError || !userData?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = userData.user;

    const displayName =
      user.user_metadata?.display_name || "";

    return NextResponse.json({
      id: user.id,
      email: user.email,
      displayName,
      emailVerified: Boolean(user.email_confirmed_at),
    });
  } catch (error) {
    console.error("GET /api/v1/me ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

