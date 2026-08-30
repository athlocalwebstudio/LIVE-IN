import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

import styles from "./authorize.module.css";

export default async function AuthorizePage({ searchParams }) {
  const params = await searchParams;

  const clientId = params?.client_id;
  const redirectUri = params?.redirect_uri;
  const responseType = params?.response_type;
  const codeChallenge = params?.code_challenge;
  const codeChallengeMethod = params?.code_challenge_method;
  const state = params?.state;

  /*
   * Phase 1:
   * We validate the basic OAuth/PKCE parameters here.
   *
   * We are NOT issuing an authorization code yet.
   */

  if (
    !clientId ||
    !redirectUri ||
    responseType !== "code" ||
    !codeChallenge ||
    codeChallengeMethod !== "S256"
  ) {
    redirect("/launcher/error?reason=invalid_authorize_request");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*
   * User is not authenticated.
   *
   * Send them to the existing sign-in page while preserving
   * the complete authorization request.
   */

  if (!user) {
    const query = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: responseType,
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod,
    });

    if (state) {
      query.set("state", state);
    }

    redirect(`/launcher/sign-in?returnTo=${encodeURIComponent(
      `/launcher/authorize?${query.toString()}`
    )}`);
  }

  const displayName =
    user.user_metadata?.display_name ||
    user.email?.split("@")[0] ||
    "PlayLive User";

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>PLAYLIVE</span>

          <h1>Authorize PlayLive Launcher</h1>

          <p>
            The PlayLive Launcher is requesting access to your
            PlayLive account.
          </p>
        </div>

        <div className={styles.account}>
          <div className={styles.avatar}>
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{displayName}</strong>
            <span>{user.email}</span>
          </div>
        </div>

        <div className={styles.permissions}>
          <span className={styles.permissionsLabel}>
            This launcher will be able to
          </span>

          <div className={styles.permission}>
            <strong>Access your PlayLive account</strong>
            <span>
              Confirm that you are signed in to your PlayLive
              account.
            </span>
          </div>

          <div className={styles.permission}>
            <strong>Access your game library</strong>
            <span>
              Allow the launcher to retrieve games associated
              with your account.
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <form
            action="/api/v1/launcher/authorize"
            method="POST"
          >
            <input
              type="hidden"
              name="client_id"
              value={clientId}
            />

            <input
              type="hidden"
              name="redirect_uri"
              value={redirectUri}
            />

            <input
              type="hidden"
              name="response_type"
              value={responseType}
            />

            <input
              type="hidden"
              name="code_challenge"
              value={codeChallenge}
            />

            <input
              type="hidden"
              name="code_challenge_method"
              value={codeChallengeMethod}
            />

            {state && (
              <input
                type="hidden"
                name="state"
                value={state}
              />
            )}

            <button
              type="submit"
              className={styles.allow}
            >
              Continue to Launcher
            </button>
          </form>

          <Link
            href="/launcher/account"
            className={styles.cancel}
          >
            Cancel
          </Link>
        </div>

        <p className={styles.security}>
          You can revoke launcher access from your PlayLive
          account at any time.
        </p>
      </section>
    </main>
  );
}