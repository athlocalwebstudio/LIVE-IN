"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "@/app/LandingPage.module.css";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.12,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function LandingPage() {
  return (
    <section className={styles.hero}>
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.pinkGlow} aria-hidden="true" />
      <div className={styles.blueGlow} aria-hidden="true" />

      <div className={styles.heroInner}>
        <motion.div
          className={styles.copy}
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div className={styles.badge} variants={fadeUp}>
            <span className={styles.liveDot} />
            Turn Your TikTok LIVE Into a Game
          </motion.div>

          <motion.h1 className={styles.title} variants={fadeUp}>
            Make your TikTok LIVE <span>impossible to ignore.</span>
          </motion.h1>

          <motion.p className={styles.description} variants={fadeUp}>
            Simple interactive games where viewers control what happens on screen — turning comments, gifts, and chaos into a LIVE people actually want to stay in.
          </motion.p>

          <motion.div className={styles.actions} variants={fadeUp}>
            <motion.a
              href="#pricing"
              className={styles.primaryButton}
              whileHover={{ y: -4, scale: 1.025 }}
              whileTap={{ scale: 0.96 }}
            >
              View Pricing
              <span aria-hidden="true">→</span>
            </motion.a>

            <motion.a
              href="/access"
              className={styles.secondaryButton}
              whileHover={{ y: -4, scale: 1.025 }}
              whileTap={{ scale: 0.96 }}
            >
              Already bought? Access games
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.visualWrap}
          initial={{ opacity: 0, x: 38, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className={styles.lightningStage}
            whileHover={{ y: -10, scale: 1.035, rotate: -1.5 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 180, damping: 16 }}
          >
            <div className={styles.lightningGlow} aria-hidden="true" />
            <motion.div
              className={styles.lightningFloat}
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/Lightning.png"
                alt="Live In lightning icon"
                width={430}
                height={430}
                priority
                className={styles.lightning}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
