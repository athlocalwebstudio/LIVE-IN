"use client";
import styles from "@/app/terms-of-service.module.css";

const Terms = () => {
  return (
    <section className={styles.termsSection}>
      <div className={styles.container}>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.paragraph}>
          By accessing and using this website, you agree to comply with and be bound by
          these Terms of Service. If you do not agree with any part of these terms, you
          must discontinue use of the site and its related services immediately. We
          reserve the right to update or modify these terms at any time without prior
          notice.
        </p>
        <p className={styles.paragraph}>
          The content, games, and tools available on this website are provided for
          personal use and entertainment purposes only. Unauthorized reproduction,
          distribution, or modification of any materials found on this site is strictly
          prohibited. You are responsible for ensuring that your use of the site and its
          content complies with applicable laws and the policies of any third-party
          platforms you engage with.
        </p>
        <p className={styles.paragraph}>
          We do not guarantee that the website will be available at all times, free from
          errors, or secure. Access may be interrupted for maintenance, updates, or
          reasons beyond our control. We are not liable for any damages, losses, or
          disruptions resulting from the use of this site, including but not limited to
          direct, indirect, incidental, or consequential damages.
        </p>
        <p className={styles.paragraph}>
          These Terms of Service are governed by and construed in accordance with the
          laws of the applicable jurisdiction. By continuing to use this site, you
          acknowledge that you have read, understood, and agreed to these terms in full.
          If you have any questions or concerns, please contact us at{" "}
          <a href="mailto:athlocalwebstudio@gmail.com" className={styles.link}>
            athlocalwebstudio@gmail.com
          </a>.
        </p>
      </div>
    </section>
  );
};

export default Terms;
