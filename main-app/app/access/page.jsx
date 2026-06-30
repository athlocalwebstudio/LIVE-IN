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

  // FORCE BUTTON TO STAY DISABLED DURING MAINTENANCE
  const isButtonDisabled = true; 

  async function handleSubmit(e) {
    e.preventDefault();
    // Disabled during maintenance framework adjustments
  }

  return (
    <main className={styles.accessSection}>
      <div className={styles.backgroundGlowOne} />
      <div className={styles.backgroundGlowTwo} />
      <div className={styles.gridGlow} />

      <div className={styles.container}>
        <section className={styles.heroBlock}>
          {/* UPDATED PILL TO SHOW MAINTENANCE JUST LIKE PRICING */}
          <span className={styles.sectionLabel} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
            ⚠️ System Optimization Phase 1.4 Active
          </span>
          <h1 className={styles.title}>Unlock your Live In games</h1>
          <p className={styles.text}>
            Our internal global key infrastructure is undergoing scheduled framework adjustments. 
            Validation gates are currently isolated.
          </p>

          <div className={styles.heroChips}>
            <span className={styles.chip} style={{ color: '#ef4444' }}>Key verification offline</span>
            <span className={styles.chip}>Protected access</span>
            <span className={styles.chip}>Fast game download</span>
          </div>
        </section>

        <section className={styles.mainCard}>
          <div className={styles.formColumn}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrap} style={{ background: 'linear-gradient(135deg, #ef4444, #f43f5e)' }}>⚙️</div>
              <div>
                <h2 className={styles.cardTitle}>License Portal Under Maintenance</h2>
                <p className={styles.cardText}>
                  We are stabilizing our server nodes. Registration links will reconnect shortly.
                </p>
              </div>
            </div>

            {/* HIGH VISIBILITY MAINTENANCE BOX REUSING EXISTING ERRORBOX STYLES */}
            <div className={styles.errorBox} style={{ marginBottom: '1.5rem', marginTop: '0' }}>
              <div className={styles.resultHeader}>
                <span className={styles.resultIconError}>ℹ️</span>
                <div>
                  <h3 className={styles.resultTitle} style={{ color: '#b91c1c' }}>Are you an Itch.io Buyer?</h3>
                  <p className={styles.resultMessage} style={{ fontSize: '0.95rem', color: '#7f1d1d' }}>
                    If you purchased individual titles or bundles on <strong>itch.io</strong>, you do not need an activation key here! 
                    Simply log into your itch.io account to download your files and game bundles directly.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <label className={styles.inputLabel} htmlFor="license-key">
                License key (Temporarily Locked)
              </label>

              <div className={styles.inputRow}>
                <input
                  id="license-key"
                  className={styles.input}
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="Verification offline during system work..."
                  autoComplete="off"
                  disabled={true} // Locks input box during server work
                  style={{ backgroundColor: 'rgba(0,0,0,0.03)', cursor: 'not-allowed' }}
                />

                <button 
                  className={styles.button} 
                  disabled={isButtonDisabled}
                  style={{ background: 'linear-gradient(90deg, #4b5563, #374151)', boxShadow: 'none' }}
                >
                  Locked
                </button>
              </div>

              <p className={styles.helperText}>
                Need immediate manual deployment? Please jump into our Discord node below for support.
              </p>
            </form>
          </div>

          <aside className={styles.sideColumn}>
            <div className={styles.infoCardPrimary}>
              <span className={styles.infoTag}>How it works</span>
              <div className={styles.stepsList}>
                <div className={styles.stepItem}>
                  <span>01</span>
                  <div>
                    <strong>System Core Update</strong>
                    <p>Database synchronization is routing accounts to the custom target domain layout.</p>
                  </div>
                </div>

                <div className={styles.stepItem}>
                  <span>02</span>
                  <div>
                    <strong>Safe Handshakes</strong>
                    <p>Validation processes are being hardened against API interruptions.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.infoCardSecondary}>
              <span className={styles.supportBadge}>Direct Node Help</span>
              <h3>Join our Discord support</h3>
              <p>
                If you have an active key or receipt and need manual file generation immediately, click below to open a ticket.
              </p>
              <a href={discordUrl} target="_blank" rel="noreferrer" className={styles.secondaryButton}>
                Open Discord Support Ticket
              </a>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}