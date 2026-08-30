import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LauncherSuccessPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/launcher/error?reason=invalid_code");
  }

  redirect("/launcher/sign-in?verified=true");
}