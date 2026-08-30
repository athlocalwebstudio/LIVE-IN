
import { NextResponse } from "next/server";
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

    return NextResponse.json({
      subscription: null,
      games: [],
    });
  } catch (error) {
    console.error(
      "GET /api/v1/me/library ERROR:",
      error
    );

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

