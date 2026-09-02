
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

import styles from "./authorize.module.css";

const LAUNCHER_CLIENT_ID = "playlive-launcher";
const LAUNCHER_RESPONSE_TYPE = "code";

function isValidLoopbackRedirect(redirectUri) {
  try {
    const url = new URL(redirectUri);

    if (url.protocol !== "http:") {
      return false;
    }

    if (
      url.hostname !== "127.0.0.1" &&
      url.hostname !== "localhost"
    ) {
      return false;
    }

    if (url.pathname !== "/callback") {
      return false;
    }

    if (url.search || url.hash) {
      return false;
    }

    const port = Number(url.port);

    if (!Number.isInteger(port)) {
      return false;
    }

    if (port < 1024 || port > 65535) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function isValidBase64Url(value) {
  return (
    typeof value === "string" &&
    value.length >= 43 &&
    value.length <= 128 &&
    /^[A-Za-z0-9_-]+$/.test(value)
  );
}

export default async function AuthorizePage({ searchParams }) {
  const params = await searchParams;

  /*
   * ============================================================
   * UNITY LAUNCHER REQUEST
   * ============================================================
   *
   * Unity sends:
   *
   *   code_challenge
   *   code_challenge_method
   *   state
   *   redirect_uri
   *
   * Unity does NOT send:
   *
   *   client_id
   *   response_type
   *
   * Those are defined server-side because this endpoint belongs
   * specifically to the PlayLive launcher.
   */

  const redirectUri = params?.redirect_uri;
  const codeChallenge = params?.code_challenge;
  const codeChallengeMethod = params?.code_challenge_method;
  const state = params?.state;

  /*
   * ============================================================
   * VALIDATE AUTHORIZATION REQUEST
   * ============================================================
   */

  if (
    !isValidLoopbackRedirect(redirectUri) ||
    !isValidBase64Url(codeChallenge) ||
    codeChallengeMethod !== "S256" ||
    !isValidBase64Url(state)
  ) {
    redirect("/launcher/error?reason=invalid_authorize_request");
  }

  /*
   * ============================================================
   * SERVER-DEFINED CLIENT CONTRACT
   * ============================================================
   */

  const clientId = LAUNCHER_CLIENT_ID;
  const responseType = LAUNCHER_RESPONSE_TYPE;

  /*
   * ============================================================
   * VERIFY BROWSER AUTHENTICATION
   * ============================================================
   */

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*
   * ============================================================
   * USER NOT SIGNED IN
   * ============================================================
   *
   * Preserve the complete authorization request so that after
   * sign-in the user returns to this exact authorization request.
   */

  if (!user) {
    const query = new URLSearchParams({
      redirect_uri: redirectUri,
      response_type: responseType,
      client_id: clientId,
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod,
      state,
    });

    redirect(
      `/launcher/sign-in?returnTo=${encodeURIComponent(
        `/launcher/authorize?${query.toString()}`
      )}`
    );
  }

  /*
   * ============================================================
   * DISPLAY ACCOUNT
   * ============================================================
   */

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
            {/*
             * These values are server-defined.
             * The user/browser cannot change the launcher client
             * or response type.
             */}

            <input
              type="hidden"
              name="client_id"
              value={clientId}
            />

            <input
              type="hidden"
              name="response_type"
              value={responseType}
            />

            <input
              type="hidden"
              name="redirect_uri"
              value={redirectUri}
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

            <input
              type="hidden"
              name="state"
              value={state}
            />

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

