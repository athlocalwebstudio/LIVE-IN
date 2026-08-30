
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./reset-password.module.css";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session) {
        setError(
          "This password reset link is invalid or has expired. Please request a new one."
        );
        setChecking(false);
        return;
      }

      setReady(true);
      setChecking(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        if (
          event === "PASSWORD_RECOVERY" &&
          session
        ) {
          setReady(true);
          setChecking(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (password.length < 8) {
      setError(
        "Your password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        });

      if (updateError) {
        console.error(
          "PASSWORD UPDATE ERROR:",
          updateError
        );

        setError(
          "We couldn't update your password. Please request a new reset link."
        );

        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error(
        "PASSWORD UPDATE ERROR:",
        err
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <div className={styles.header}>
            <span className={styles.eyebrow}>
              PLAYLIVE
            </span>

            <h1>Checking your link...</h1>

            <p>
              Please wait while we securely verify your
              password reset session.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (success) {
    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <div className={styles.header}>
            <span className={styles.eyebrow}>
              PLAYLIVE
            </span>

            <h1>Password updated</h1>

            <p>
              Your password has been changed successfully.
              You can now sign in with your new password.
            </p>
          </div>

          <button
            type="button"
            className={styles.button}
            onClick={() =>
              router.push("/launcher/sign-in")
            }
          >
            Go to Sign In
          </button>
        </section>
      </main>
    );
  }

  if (!ready) {
    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <div className={styles.header}>
            <span className={styles.eyebrow}>
              PLAYLIVE
            </span>

            <h1>Verification failed</h1>

            <p>
              {error ||
                "This password reset link is invalid or has expired."}
            </p>
          </div>

          <button
            type="button"
            className={styles.button}
            onClick={() =>
              router.push(
                "/launcher/forgot-password"
              )
            }
          >
            Request a new link
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>
            PLAYLIVE
          </span>

          <h1>Set a new password</h1>

          <p>
            Choose a new password for your PlayLive
            account.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="password">
              New password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              disabled={loading}
              placeholder="At least 8 characters"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword">
              Confirm new password
            </label>

            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              disabled={loading}
              placeholder="Repeat your new password"
            />
          </div>

          {error && (
            <div
              className={styles.error}
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading
              ? "Updating password..."
              : "Update password"}
          </button>
        </form>
      </section>
    </main>
  );
}
