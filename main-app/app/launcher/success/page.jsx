import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LauncherSuccessPage({ searchParams }) {
  const supabase = await createClient();

  const params = await searchParams;
  const code = params?.code;

  if (!code) {
    redirect("/launcher/error?reason=invalid_code");
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("EMAIL VERIFICATION ERROR:", error);

    redirect("/launcher/error?reason=invalid_code");
  }

  redirect("/launcher/sign-in?verified=true");
}