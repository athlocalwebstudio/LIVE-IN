"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./access.module.css";

export default function AccessPage() {
  const searchParams = useSearchParams();
  const keyFromUrl = searchParams.get("key") || "";

  const [licenseKey, setLicenseKey] = useState(keyFromUrl);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const discordUrl = process.env.NEXT_PUBLIC_DISCORD_URL || "#";

  useEffect(() => {
    if (keyFromUrl) {
      setLicenseKey(keyFromUrl);
    }
  }, [keyFromUrl]);

  const isButtonDisabled = useMemo(() => {
    return loading || !licenseKey.trim();
  }, [loading, licenseKey]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/validate-license", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ licenseKey }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        valid: false,
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.accessSection}>
      <div className={styles.backgroundGlowOne} />
      <div className={styles.backgroundGlowTwo} />
      <div className={styles.gridGlow} />

      <div className={styles.container}>
        <section className={styles.heroBlock}>
          <span className={styles.sectionLabel}>🔐 Secure License Access</span>
          <h1 className={styles.title}>Unlock your Live In games in seconds</h1>
          <p className={styles.text}>
            Enter the license key you received after checkout to access your downloads,
            updates, and setup resources.
          </p>

          <div className={styles.heroChips}>
            <span className={styles.chip}>Instant verification</span>
            <span className={styles.chip}>Protected access</span>
            <span className={styles.chip}>Fast game download</span>
          </div>
        </section>

        <section className={styles.mainCard}>
          <div className={styles.formColumn}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrap}>⚡</div>
              <div>
                <h2 className={styles.cardTitle}>Verify your license key</h2>
                <p className={styles.cardText}>
                  Paste your key below. If it&apos;s valid, your download will unlock instantly.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <label className={styles.inputLabel} htmlFor="license-key">
                License key
              </label>

              <div className={styles.inputRow}>
                <input
                  id="license-key"
                  className={styles.input}
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="Enter your license key"
                  autoComplete="off"
                  required
                />

                <button className={styles.button} disabled={isButtonDisabled}>
                  {loading ? "Checking..." : "Unlock Games"}
                </button>
              </div>

              <p className={styles.helperText}>
                Tip: you can copy the key directly from your purchase email and paste it here.
              </p>
            </form>

            {result && (
              <div className={result.valid ? styles.successBox : styles.errorBox}>
                <div className={styles.resultHeader}>
                  <span className={result.valid ? styles.resultIconSuccess : styles.resultIconError}>
                    {result.valid ? "✓" : "!"}
                  </span>
                  <div>
                    <h3 className={styles.resultTitle}>
                      {result.valid ? "License verified" : "License not accepted"}
                    </h3>
                    <p className={styles.resultMessage}>{result.message}</p>
                  </div>
                </div>

                {result.valid && (
                  <div className={styles.downloads}>
                    <div className={styles.downloadCard}>
                      <div>
                        <p className={styles.downloadEyebrow}>Main download</p>
                        <h4>Live In Games Pack</h4>
                        <p className={styles.smallText}>
                          Your access is active. Use the button below to download your files.
                        </p>
                      </div>

                      <a className={styles.downloadButton} href="/api/download/live-in-pack">
                        Download Pack
                      </a>
                    </div>

                    <p className={styles.warningText}>
                      Keep your key private. For production, connect this to protected storage and
                      never place your game ZIP in the public folder.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className={styles.sideColumn}>
            <div className={styles.infoCardPrimary}>
              <span className={styles.infoTag}>How it works</span>
              <div className={styles.stepsList}>
                <div className={styles.stepItem}>
                  <span>01</span>
                  <div>
                    <strong>Copy your key</strong>
                    <p>Get it from your Lemon Squeezy receipt email after purchase.</p>
                  </div>
                </div>

                <div className={styles.stepItem}>
                  <span>02</span>
                  <div>
                    <strong>Paste and verify</strong>
                    <p>We securely check whether your license is active and valid.</p>
                  </div>
                </div>

                <div className={styles.stepItem}>
                  <span>03</span>
                  <div>
                    <strong>Download and start</strong>
                    <p>Unlock your games and begin setting up your LIVE instantly.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.infoCardSecondary}>
              <span className={styles.supportBadge}>Need help?</span>
              <h3>Join our Discord support</h3>
              <p>
                If your key is not working or you need help setting things up, contact us and we&apos;ll
                help you out.
              </p>
              <a href={discordUrl} target="_blank" rel="noreferrer" className={styles.secondaryButton}>
                Open Discord
              </a>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
