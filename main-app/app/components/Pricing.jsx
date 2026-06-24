"use client";

import styles from "@/app/pricing.module.css";

const checkoutUrls = {
  // Redirecting directly to our sleek new checkout landing page for this phase
  basic: "/checkout-status?plan=Basic",
  pro: "/checkout-status?plan=Pro",
  growth: "/checkout-status?plan=Growth",
  lifetime: "/checkout-status?plan=Lifetime",
};

const plans = [
  {
    key: "basic",
    name: "Basic",
    price: "€15",
    period: "/ 30 days",
    badge: "Beta Slot Allocation",
    description:
      "Perfect if you just want access to the games and already know how to get started.",
    cta: "Secure Basic Access",
    href: checkoutUrls.basic,
    features: [
      { label: "All current games", included: true },
      { label: "30 days access", included: true },
      { label: "License key access", included: true },
      { label: "Basic setup guide", included: true },
      { label: "New games included", included: false },
      { label: "Updates included", included: false },
      { label: "24/7 personal support", included: false },
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "€20",
    period: "/ 30 days",
    badge: "Most Popular Vanguard",
    description:
      "The best monthly plan if you want updates, new games, and real help getting started.",
    cta: "Secure Pro Access",
    href: checkoutUrls.pro,
    highlightText: "Highly Recommended",
    features: [
      { label: "All current games", included: true },
      { label: "30 days access", included: true },
      { label: "License key access", included: true },
      { label: "Basic setup guide", included: true },
      { label: "New games included", included: true },
      { label: "Updates included", included: true },
      { label: "24/7 personal support", included: true },
    ],
  },
  {
    key: "growth",
    name: "Growth",
    price: "€35",
    period: "/ 3 months",
    badge: "Extended Framework",
    description:
      "Everything in Pro, but with longer access so you can keep building your TikTok LIVE.",
    cta: "Secure Growth Access",
    href: checkoutUrls.growth,
    features: [
      { label: "All current games", included: true },
      { label: "3 months access", included: true },
      { label: "License key access", included: true },
      { label: "Basic setup guide", included: true },
      { label: "New games included", included: true },
      { label: "Updates included", included: true },
      { label: "24/7 personal support", included: true },
    ],
  },
  {
    key: "lifetime",
    name: "Lifetime",
    price: "€60",
    period: "/ forever",
    badge: "Vanguard Special Offer",
    description:
      "Best long-term deal. One payment, lifetime access, updates, and support while the launch offer lasts.",
    cta: "Lock In Lifetime Node",
    href: checkoutUrls.lifetime,
    featured: true,
    highlightText: "Absolute Best Deal",
    features: [
      { label: "All current games", included: true },
      { label: "Lifetime access", included: true },
      { label: "License key access", included: true },
      { label: "Basic setup guide", included: true },
      { label: "New games included", included: true },
      { label: "Updates included", included: true },
      { label: "24/7 personal support", included: true },
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className={styles.pricingSection}>
      <div className={styles.backgroundGlowOne} />
      <div className={styles.backgroundGlowTwo} />

      <div className={styles.container}>
        <div className={styles.headerBlock}>
          {/* SPREAD PREMIUM STATUS PILL */}
          <div className={styles.systemStatusPill}>
            <span className={styles.statusPulseDot} />
            <span>Deployment Phase 1.4: Node Optimization Underway</span>
          </div>

          <h2 className={styles.sectionTitle}>Choose the plan that fits your LIVE</h2>
          <p className={styles.sectionSubtitle}>
            Our interactive deployment engines are receiving live maintenance optimizations. Lock in your entry slot below to claim permanent early-bird pricing filters.
          </p>
        </div>

        <div className={styles.promoBar}>
          <span>🔥 Launch deal:</span> Lifetime access is currently available for a one-time €60.
        </div>

        <div className={styles.pricingGrid}>
          {plans.map((plan) => (
            <article
              key={plan.key}
              className={`${styles.pricingCard} ${plan.featured ? styles.featured : ""}`}
            >
              {plan.highlightText && (
                <div className={plan.featured ? styles.featuredBadge : styles.topBadge}>
                  {plan.highlightText}
                </div>
              )}

              <div className={styles.cardTop}>
                <div>
                  <div className={styles.pricingPlan}>{plan.name}</div>
                  <span className={styles.planBadge}>{plan.badge}</span>
                </div>

                <div className={styles.priceWrap}>
                  <div className={styles.pricingPrice}>{plan.price}</div>
                  <div className={styles.pricingPeriod}>{plan.period}</div>
                </div>
              </div>

              <p className={styles.pricingDesc}>{plan.description}</p>

              <a
                href={plan.href}
                className={plan.featured ? styles.primaryButton : styles.outlineButton}
              >
                {plan.cta}
              </a>

              <ul className={styles.pricingFeatures}>
                {plan.features.map((feature) => (
                  <li key={feature.label} className={feature.included ? styles.featureOn : styles.featureOff}>
                    <span className={feature.included ? styles.check : styles.cross}>
                      {feature.included ? "✓" : "✕"}
                    </span>
                    <span>{feature.label}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className={styles.accessNote}>
          Already purchased? <a href="/access">Enter your license key here</a> to access your games.
        </p>
      </div>
    </section>
  );
}