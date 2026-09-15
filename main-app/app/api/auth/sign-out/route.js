
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("SIGN OUT ERROR:", error);

    return NextResponse.json(
      {
        error: "Unable to sign out.",
      },
      {
        status: 500,
      }
    );
  }

  const url = new URL("/launcher/sign-in", request.url);

  return NextResponse.redirect(url, 303);
}
