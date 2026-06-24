"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import styles from "./checkout-status.module.css";

function StatusContent() {
  const searchParams = useSearchParams();
  const planName = searchParams.get("plan") || "Vanguard Bundle";

  return (
    <div className={styles.cardContainer}>
      <div className={styles.statusIconHeader}>
        <div className={styles.outerPulseCircle}>
          <div className={styles.innerPulseCircle}>🚀</div>
        </div>
      </div>

      <div className={styles.badgeLine}>Secure Pipeline Allocated</div>
      <h1 className={styles.mainHeading}>Thank You for Your Support!</h1>
      <p className={styles.subtextParagraph}>
        You chosen slot configuration (<strong>{planName} Tier</strong>) has been registered successfully.
      </p>

      <div className={styles.constructionNoticeCard}>
        <h3>⚠️ Network Node Optimization In Progress</h3>
        <p>
          We are currently running critical optimization updates on our licensing server distribution pipelines. To ensure absolute stream stability, license allocations are being dispatched manually over the next few hours.
        </p>
      </div>

      <div className={styles.nextStepsWrapper}>
        <h4>Your Action Checklist:</h4>
        <div className={styles.stepRow}>
          <div className={styles.stepNum}>1</div>
          <p>Check your email associated with the order for tracking credentials.</p>
        </div>
        <div className={styles.stepRow}>
          <div className={styles.stepNum}>2</div>
          <p>Join our secure Dev Discord channel to request instant manual bypass keys.</p>
        </div>
      </div>

      <div className={styles.buttonActionGrid}>
        <a 
          href={process.env.NEXT_PUBLIC_DISCORD_URL || "#"} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.discordButton}
        >
          Open Support Discord
        </a>
        <Link href="/" className={styles.homeButton}>
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutStatusPage() {
  return (
    <main className={styles.pageWrapper}>
      <div className={styles.bgGrid} />
      <div className={styles.pinkOrb} />
      <div className={styles.blueOrb} />

      <Suspense fallback={<div className={styles.loadingState}>Connecting Secure Node...</div>}>
        <StatusContent />
      </Suspense>
    </main>
  );
}