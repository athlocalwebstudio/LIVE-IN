import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const redirectUrl = new URL(
    "/launcher/success",
    request.url
  );

  if (!tokenHash || !type) {
    return NextResponse.redirect(
      new URL(
        "/launcher/error?reason=missing_code",
        request.url
      )
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    console.error("SUPABASE EMAIL VERIFICATION ERROR:", error);

    return NextResponse.redirect(
      new URL(
        "/launcher/error?reason=invalid_code",
        request.url
      )
    );
  }

  return NextResponse.redirect(redirectUrl);
}