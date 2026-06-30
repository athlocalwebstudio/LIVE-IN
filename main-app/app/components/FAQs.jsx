"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import styles from "@/app/Faqs.module.css";

const faqs = [
  {
    question: "How do I get the games after buying?",
    answer:
      "After checkout, you receive a license key. Go to the Access Games page, paste your key, and your downloads unlock.",
  },
  {
    question: "How do I stream these games?",
    answer:
      "You use TikTok Live Studio, add the game as a source, connect it with your TikTok username, and let viewers interact during the LIVE.",
  },
  {
    question: "Do I need TikTok Live Studio?",
    answer:
      "Yes. You need access to TikTok Live Studio, a stable connection, and a TikTok account in good standing.",
  },
  {
    question: "Can these games help me earn money?",
    answer:
      "They can help make your LIVE more interactive, which may increase engagement and gifts, but earnings depend on your audience, content, consistency, and TikTok performance.",
  },
  {
    question: "What happens if my subscription expires?",
    answer:
      "Your license access can stop working when the subscription is no longer active. Keep your license active to access downloads and updates.",
  },
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.15,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, y: 30 });
    }
  }, [controls, inView]);

  return (
    <motion.section
      id="faqs"
      ref={ref}
      className={styles.faqsSection}
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={styles.faqsContainerInner}>
        <h2 className={styles.faqsTitle}>FAQS</h2>
        
        <div className={styles.faqsContainer}>
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className={`${styles.faqItem} ${openIndex === index ? styles.active : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <h3 className={styles.faqQuestion}>
                {faq.question}
                <span className={styles.icon}>{openIndex === index ? "−" : "+"}</span>
              </h3>
              <div className={styles.faqAnswerWrapper}>
                <p className={styles.faqAnswer}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
        

        {/* HIGH-CONVERSION FULL PAGE TEASER LINK */}
        <div className={styles.moreQuestionsContainer}>
          <div className={styles.teaserBadge}>Looking for specific errors or setup tips?</div>
          <h4 className={styles.teaserText}>
            Have a question about account safety, payout verification, or multi-streaming setup?
          </h4>
          <Link href="/faq" className={styles.fullPageLink}>
            <span>Launch Interactive Help Center</span>
            <span className={styles.arrowIcon}>→</span>
          </Link>
        </div>

      </div>
    </motion.section>
  );
};

export default FAQs;