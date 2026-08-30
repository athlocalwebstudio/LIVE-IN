
"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import styles from "./forgot-password.module.css";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          normalizedEmail,
          {
            redirectTo: `${window.location.origin}/launcher/reset-password`,
          }
        );

      if (resetError) {
        console.error("PASSWORD RESET ERROR:", resetError);

        setError(
          "We couldn't send the reset email. Please try again later."
        );

        return;
      }

      setSent(true);
    } catch (err) {
      console.error("PASSWORD RESET ERROR:", err);

      setError(
        "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <div className={styles.header}>
            <span className={styles.eyebrow}>PLAYLIVE</span>

            <h1>Check your email</h1>

            <p>
              If an account exists for that email address, we've
              sent instructions to reset your password.
            </p>
          </div>

          <div className={styles.success}>
            Check your inbox and follow the password reset link.
            The link may expire for security reasons.
          </div>

          <Link
            href="/launcher/sign-in"
            className={styles.button}
          >
            Back to Sign In
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>PLAYLIVE</span>

          <h1>Forgot your password?</h1>

          <p>
            Enter your email address and we'll send you a secure
            link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              placeholder="you@example.com"
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
              ? "Sending..."
              : "Send reset link"}
          </button>
        </form>

        <p className={styles.footer}>
          Remember your password?{" "}
          <Link href="/launcher/sign-in">
            Back to Sign In
          </Link>
        </p>
      </section>
    </main>
  );
}

