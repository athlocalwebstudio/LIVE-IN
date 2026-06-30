// app/setup-guide/page.js
import Link from 'next/link';
import styles from './page.module.css';

// Elite SEO Metadata targeting high-intent search terms
export const metadata = {
  title: "How to Set Up Interactive Games in TikTok Live Studio | Live In Guide",
  description: "Learn how to add comment and gift-powered interactive mini-games to TikTok Live Studio using Window Capture. Step-by-step stream overlay tutorial.",
  keywords: ["TikTok Live Studio window capture game", "how to set up interactive games on tiktok live", "TikTok stream overlay setup", "Live In games guide"],
};

export default function SetupGuide() {
  // Structured Data (JSON-LD) to unlock Google "How-To" rich search snippets
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Add Interactive Games to TikTok Live Studio",
    "description": "A step-by-step guide to streaming interactive comment and gift-powered games on TikTok using TikTok Live Studio.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Launch your game executable",
        "text": "Download your interactive game from Itch.io, extract the ZIP file, and run the .exe application on your Windows machine.",
        "url": "https://playlivetiktok.com/setup-guide#step-1"
      },
      {
        "@type": "HowToStep",
        "name": "Open TikTok Live Studio",
        "text": "Launch the official TikTok Live Studio software on your PC and make sure you are logged into your streaming account.",
        "url": "https://playlivetiktok.com/setup-guide#step-2"
      },
      {
        "@type": "HowToStep",
        "name": "Apply a Window Capture source",
        "text": "Add a new source, select 'Window Capture', choose your game executable from the drop-down menu, and click add. Adjust the scaling to fit your canvas layout.",
        "url": "https://playlivetiktok.com/setup-guide#step-3"
      }
    ]
  };

  return (
    <div className={styles.container}>
      {/* Injecting Schema for Google Bots */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← Back to Games Store</Link>
        <h1 className={styles.title}>How to Add Interactive Games to TikTok Live Studio</h1>
        <p className={styles.subtitle}>
          Get your stream configured in less than 3 minutes. Follow this step-by-step framework to connect your interactive viewer games cleanly.
        </p>
      </header>

      <main className={styles.stepsContainer}>
        {/* STEP 1 */}
        <section id="step-1" className={styles.stepCard}>
          <div className={styles.stepBadge}>01</div>
          <div className={styles.stepContent}>
            <h2>Launch Your Game Executable</h2>
            <p>
              Once you purchase or download a tool from our official <strong>Itch.io library</strong>, download the folder directly onto your local streaming PC.
            </p>
            <ul>
              <li>Extract the downloaded <code>.zip</code> file completely to a secure folder (like your Desktop or Documents).</li>
              <li>Double-click the main <code>.exe</code> file to open the game layout window.</li>
              <li>Leave the game running in windowed mode in the background.</li>
            </ul>
          </div>
        </section>

        {/* STEP 2 */}
        <section id="step-2" className={styles.stepCard}>
          <div className={styles.stepBadge}>02</div>
          <div className={styles.stepContent}>
            <h2>Open TikTok Live Studio</h2>
            <p>
              Fire up the official <strong>TikTok Live Studio</strong> desktop application and prepare your scene environment.
            </p>
            <ul>
              <li>Ensure you are fully logged into the TikTok account hosting the broadcast.</li>
              <li>Select or create the dedicated scene profile layout where your game stream overlay will live.</li>
            </ul>
          </div>
        </section>

        {/* STEP 3 */}
        <section id="step-3" className={styles.stepCard}>
          <div className={styles.stepBadge}>03</div>
          <div className={styles.stepContent}>
            <h2>Apply a Window Capture Source</h2>
            <p>
              Route the visual engine layout of the game directly onto your active live stream canvas.
            </p>
            <ul>
              <li>In the left-hand panel under <strong>Sources</strong>, click the blue <strong>+ Add Source</strong> button.</li>
              <li>Select the <strong>Window Capture</strong> module from the options grid.</li>
              <li>In the application dropdown menu, find and select your running game window.</li>
              <li>Click <strong>Add Source</strong>. Drag the corners of the overlay box to scale it perfectly to your canvas.</li>
            </ul>
          </div>
        </section>

        {/* BONUS PRO TIPS */}
        <section className={styles.proTipsCard}>
          <h3>💡 Pro Streaming Optimization Tips</h3>
          <div className={styles.tipGrid}>
            <div className={styles.tipItem}>
              <h4>Audio Isolation</h4>
              <p>If you don't want game background sound effects conflicting with your voice, assign the game source window to a separate virtual audio channel inside Live Studio's advanced mixer settings.</p>
            </div>
            <div className={styles.tipItem}>
              <h4>Window Focus</h4>
              <p>Keep the game running natively. If you minimize the game window to your taskbar, TikTok Live Studio will temporarily pause the image capture processing link.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}