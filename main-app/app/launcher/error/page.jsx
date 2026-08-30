
import Link from "next/link";
import styles from "./error.module.css";

export default async function LauncherErrorPage({ searchParams }) {
  const params = await searchParams;
  const reason = params?.reason;

  const message =
    reason === "missing_code"
      ? "The verification link is missing the information required to complete verification."
      : "This verification link is invalid or has expired. Please request a new verification email.";

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.icon}>!</div>

        <span className={styles.eyebrow}>PLAYLIVE</span>

        <h1>Verification failed</h1>

        <p>{message}</p>

        <div className={styles.actions}>
          <Link href="/launcher/register" className={styles.button}>
            Create account
          </Link>

          <Link href="/launcher/sign-in" className={styles.secondaryButton}>
            Back to Sign In
          </Link>
        </div>
      </section>
    </main>
  );
}

