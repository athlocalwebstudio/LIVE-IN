"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import styles from "./register.module.css";

export default function RegisterPage() {
  const supabase = createClient();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    acceptTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (!form.displayName.trim()) {
      setError("Please enter a display name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (form.password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (!form.acceptTerms) {
      setError("You must accept the Terms of Service and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}/launcher/success`,
          data: {
            display_name: form.displayName.trim(),
            terms_version: "1.0",
            privacy_version: "1.0",
            accepted_terms_at: new Date().toISOString(),
          },
        },
      });

      if (signUpError) {
  console.error("SUPABASE SIGNUP ERROR:", signUpError);

  setError(signUpError.message);
  return;
}

      setSuccess(true);
    } catch (err) {
      console.error("REGISTRATION ERROR:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <div className={styles.icon}>✓</div>

          <h1>Check your email</h1>

          <p>
            We've sent a verification link to your email address.
            Please verify your email before signing in.
          </p>

          <Link href="/launcher/sign-in" className={styles.button}>
            Go to Sign In
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

          <h1>Create your account</h1>

          <p>
            Create your PlayLive account to access your games and launcher.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="displayName">Display name</label>

            <input
              id="displayName"
              name="displayName"
              type="text"
              autoComplete="name"
              value={form.displayName}
              onChange={handleChange}
              disabled={loading}
              placeholder="Your display name"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              placeholder="you@example.com"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="At least 8 characters"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword">Confirm password</label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              placeholder="Repeat your password"
            />
          </div>

          <label className={styles.checkbox}>
            <input
              name="acceptTerms"
              type="checkbox"
              checked={form.acceptTerms}
              onChange={handleChange}
              disabled={loading}
            />

            <span>
              I agree to the{" "}
              <Link href="/Terms-of-service" target="_blank">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/Privacy-Policy" target="_blank">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link href="/launcher/sign-in">Sign in</Link>
        </p>
      </section>
    </main>
  );
}