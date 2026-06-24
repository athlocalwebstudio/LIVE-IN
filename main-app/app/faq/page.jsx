"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import styles from "./faq.module.css";

const faqCategories = [
  { id: "all", label: "All Questions" },
  { id: "general", label: "General & Getting Started" },
  { id: "setup", label: "Setup & Streaming" },
  { id: "license", label: "License & Payments" },
  { id: "troubleshoot", label: "Troubleshooting & Safety" },
];

const faqData = [
  {
    category: "general",
    question: "What exactly are Live In TikTok LIVE games?",
    answer: "Live In games are specialized, interactive background software applications designed for TikTok streamers. They connect directly to your LIVE stream's real-time data feed, allowing your audience to influence the gameplay instantly. Viewers send specific comments, likes, or virtual gifts to drive cars, trigger actions, join teams, or fight in arena battles live on screen.",
  },
  {
    category: "general",
    question: "How do interactive games help me earn more gifts and revenue?",
    answer: "Traditional streaming relies on passive watching. Live In transforms viewers into active players. By creating competitive dynamics (like Red vs Blue in 'Shooting Battle' or racing in 'Spacecrafts Race'), viewers are highly incentivized to send gifts to push their team to victory, rescue characters, or unlock interactive perks. Higher interaction signals TikTok's algorithm to push your stream to the For You Page (FYP), drastically increasing your overall reach and monetization potential.",
  },
  {
    category: "general",
    question: "Is there a monthly subscription or can I buy them permanently?",
    answer: "We provide flexible access plans tailored to your streaming frequency. We offer a standard 30-day Basic plan, a highly popular 30-day Pro plan (including updates and personal support), a 3-month Growth package, and a Lifetime Access pass. The Lifetime plan requires only a single, one-time payment with zero recurring fees, locking in permanent access to all current games, future additions, and customer support channels.",
  },
  {
    category: "setup",
    question: "What are the exact hardware and software requirements?",
    answer: "To run our interactive games successfully, you need: 1) A Windows PC or laptop running Windows 10 or 11, 2) Official access to the TikTok Live Studio desktop application, 3) A stable internet connection capable of streaming video, and 4) A TikTok account in good standing authorized to stream via desktop software.",
  },
  {
    category: "setup",
    question: "Do I need TikTok Live Studio to stream these games?",
    answer: "Yes, TikTok Live Studio is strictly required. The games run as standalone windows on your desktop. You then add them as an 'Application Window' capture source directly into TikTok Live Studio. This allows you to place your camera, overlays, and game graphics precisely where you want them before going live.",
  },
  {
    category: "setup",
    question: "How many followers do I need to use TikTok Live Studio?",
    answer: "TikTok's baseline eligibility criteria for access to Live Studio varies by region, but typically requires a minimum of 1,000 followers, a creator or business account status, and no active streaming violations within the last 30 days. You can check your direct access availability natively within the official TikTok download dashboard.",
  },
  {
    category: "setup",
    question: "Can I stream these games from an Apple Mac or a mobile phone?",
    answer: "Currently, our high-performance interactive game modules are compiled specifically for Windows operating systems. Mac users can run them via Windows virtualization environments (such as Parallels or Boot Camp). They cannot be initiated directly on standalone mobile smartphones, as they require a streaming host software (Live Studio) to capture the interface layer.",
  },
  {
    category: "license",
    question: "How do I activate and access my games after completing checkout?",
    answer: "The moment your checkout clears, a unique secure license key is automatically generated and delivered straight to your email inbox via our secure billing handler, Lemon Squeezy. Simply head to the 'Access Games' sub-page on our website, paste your alphanumeric license key into the validation field, and your immediate download binaries will reveal instantly.",
  },
  {
    category: "license",
    question: "Can I link a single license key to multiple TikTok accounts?",
    answer: "Standard Basic, Pro, and Growth licenses are configured for single-stream usage to maintain direct security configurations and optimized server pings. If you manage an agency or operate multiple personal streaming setups simultaneously, we recommend acquiring individual tiers or reaching out directly through our Discord support server to discuss enterprise licenses.",
  },
  {
    category: "license",
    question: "What happens if my subscription plan expires?",
    answer: "If your monthly or quarterly subscription lapses, your secure license key will automatically go inactive, restricting access to downloads and software updates. To keep your streaming interactions uninterrupted, ensure your payment profile is up to date, or switch to the Lifetime option to disable subscription checks permanently.",
  },
  {
    category: "troubleshoot",
    question: "Are these interactive games safe for my account? Will I get banned?",
    answer: "Yes, our tools are fully compliant and safe. Our interactive engines listen exclusively to public stream hooks (chat feeds, gift logs, and public milestone alerts) via official streaming readouts without injecting unauthorized code into the main TikTok application or utilizing automated macro-bots. Your credentials are never compromised, keeping your account entirely secure.",
  },
  {
    category: "troubleshoot",
    question: "The game isn't reading my stream chat comments or gifts. How do I fix it?",
    answer: "This is easily resolved! 99% of reader connection issues stem from entering an incorrect username or forgetting to click 'Connect' after launching the game window. Make sure you enter your exact TikTok username (excluding the '@' symbol) and launch the module *after* you have officially started your stream inside TikTok Live Studio so the public connection pipeline is active.",
  },
  {
    category: "troubleshoot",
    question: "Can I customize the game assets, audio levels, or default text strings?",
    answer: "Yes! Each interactive game configuration directory contains adjustable setup panels or simple text/asset data folders. You can fine-tune interaction parameters, modify points-per-gift settings, mute or balance background sounds, and alter display text to correspond perfectly to your native language and community inside your stream.",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const jsonLdSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map((item) => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer,
        },
      })),
    };
  }, []);

  return (
    <main className={styles.faqPageWrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* Synchronized Landing Page Animated Ambient Layout */}
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.pinkGlow} aria-hidden="true" />
      <div className={styles.blueGlow} aria-hidden="true" />

      <div className={styles.pageContainer}>
        {/* Navigation badge link that redirects smoothly back home */}
        <Link href="/" className={styles.backHomeLink}>
          <div className={styles.liveDot} />
          <span>Back to Live In Games</span>
        </Link>

        <header className={styles.heroHeader}>
          <h1 className={styles.mainTitle}>
            Frequently Asked <span>Questions</span>
          </h1>
          <p className={styles.subtitle}>
            Everything you need to know about setting up, launching, and multiplying your interactive ecosystem earnings.
          </p>

          <div className={styles.searchContainer}>
            <div className={styles.searchInner}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search queries (e.g., Live Studio, activation, ban...)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setOpenIndex(null);
                }}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearch}
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search text"
                >
                  ✕
                </button>
              )}
            </div>
            {searchQuery && (
              <p className={styles.searchResultsCount}>
                Found {filteredFAQs.length} matching answers
              </p>
            )}
          </div>
        </header>

        <nav className={styles.categoriesNav} aria-label="FAQ Categories">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`${styles.categoryTab} ${activeCategory === category.id ? styles.activeTab : ""}`}
              onClick={() => {
                setActiveCategory(category.id);
                setOpenIndex(null);
              }}
            >
              {category.label}
            </button>
          ))}
        </nav>

        <section className={styles.accordionContainer}>
          <AnimatePresence mode="popLayout">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <motion.article
                    key={faq.question}
                    layout="position"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className={`${styles.accordionItem} ${isOpen ? styles.itemExpanded : ""}`}
                  >
                    <button
                      type="button"
                      className={styles.accordionHeader}
                      onClick={() => toggleFAQ(index)}
                      aria-expanded={isOpen}
                    >
                      <span className={styles.questionText}>{faq.question}</span>
                      <span className={styles.toggleIcon}>{isOpen ? "−" : "+"}</span>
                    </button>

                    <div
                      className={`${styles.accordionBodyWrapper} ${isOpen ? styles.bodyOpen : styles.bodyClosed}`}
                    >
                      <div className={styles.accordionContentInner}>
                        <p className={styles.answerText}>{faq.answer}</p>
                      </div>
                    </div>
                  </motion.article>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.emptyStateBox}
              >
                <div className={styles.emptyIcon}>🔍</div>
                <h3>No results found</h3>
                <p>We couldn&apos;t find any FAQs matching your exact keyword. Try browsing another category filter tab.</p>
                <button
                  type="button"
                  className={styles.resetButton}
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                >
                  Reset Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <footer className={styles.ctaBannerGrid}>
          <div className={styles.ctaTextSide}>
            <h3>Still have unanswered questions?</h3>
            <p>Our dev support team is online inside our official Discord portal to guide your interactive pipeline step-by-step.</p>
          </div>
          <div className={styles.ctaButtonSide}>
            <Link href="/#pricing" className={styles.primaryButton}>
              <span>Unlock Games Now</span>
            </Link>
            <a
              href={process.env.NEXT_PUBLIC_DISCORD_URL || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryButton}
            >
              Join Discord
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}