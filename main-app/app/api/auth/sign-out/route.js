
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
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

  return NextResponse.redirect(
    new URL("/launcher/sign-in", process.env.NEXT_PUBLIC_SITE_URL)
  );
}
