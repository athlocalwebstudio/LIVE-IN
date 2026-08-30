
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function authenticateLauncherRequest(request) {
  const authorization =
    request.headers.get("authorization");

  if (
    typeof authorization !== "string" ||
    !authorization.startsWith("Bearer ")
  ) {
    return null;
  }

  const accessToken =
    authorization.slice("Bearer ".length).trim();

  if (!accessToken) {
    return null;
  }

  const tokenHash = hashToken(accessToken);

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
        expires_at,
        revoked_at
      `
    )
    .eq("access_token_hash", tokenHash)
    .maybeSingle();

  if (sessionError || !session) {
    return null;
  }

  if (session.revoked_at) {
    return null;
  }

  if (
    new Date(session.expires_at).getTime() <=
    Date.now()
  ) {
    return null;
  }

  return {
    session,
    userId: session.user_id,
    accessToken,
    supabase,
  };
}

