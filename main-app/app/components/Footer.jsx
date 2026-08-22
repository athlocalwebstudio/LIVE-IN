"use client";

import Image from "next/image";
import {
  FaApple,
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
  FaDiscord,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import styles from "@/app/footer.module.css";

const discordUrl = process.env.NEXT_PUBLIC_DISCORD_URL || "#";
const supportEmail = "liveinhelp.iliaskot@gmail.com";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div className={styles.brandColumn}>
            <a href="/" className={styles.brand}>
              <Image
                src="/logo.png"
                alt="Live In logo"
                width={46}
                height={46}
                className={styles.brandLogo}
              />
              <span>Live In</span>
            </a>

            <p className={styles.brandDescription}>
              Turn TikTok LIVE viewers into players with simple interactive games that make every stream feel alive.
            </p>

            <div className={styles.socialLinks}>
              <a href="https://www.instagram.com/liveintiktoklivegames/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href={discordUrl} target="_blank" rel="noopener noreferrer" aria-label="Discord">
                <FaDiscord />
              </a>
              <a href="https://youtube.com/@iliaskot" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube />
              </a>
              <a href="https://www.tiktok.com/@live_in_official" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <FaTiktok />
              </a>
            </div>

            <a href={`mailto:${supportEmail}`} className={styles.emailCard}>
              <span className={styles.emailIcon}><MdEmail /></span>
              <span>
                <strong>Email us</strong>
                <small>{supportEmail}</small>
              </span>
            </a>
          </div>

          <div className={styles.footerColumn}>
            <h5>Platform</h5>
            <ul>
              <li><a href="/#games">Games</a></li>
              <li><a href="/#pricing">Pricing</a></li>
              <li><a href="/access">Access Games</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/setup-guide">Setup Guide</a></li> 
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h5>Support</h5>
            <ul>
              <li><a href={discordUrl} target="_blank" rel="noopener noreferrer">Discord Support</a></li>
              <li><a href="https://youtube.com/@iliaskot" target="_blank" rel="noopener noreferrer">Tutorials</a></li>
              <li><a href={`mailto:${supportEmail}`}>Contact</a></li>
              <li><a href="/access">License Help</a></li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h5>Legal</h5>
            <ul>
              <li><a href="/Terms-of-service">Terms of Service</a></li>
              <li><a href="/Disclaimer">Disclaimer</a></li>
              <li><a href={`mailto:${supportEmail}`}>Refund Questions</a></li>
              <li><a href="/Privacy-Policy">Privacy-Policy</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.footerCreditBlock}>
            <p>© {new Date().getFullYear()} Live In. All rights reserved.</p>
            <p className={styles.madeBy}>
              Website by{" "}
              <a href="https://athlocalwebstudio.com" target="_blank" rel="noopener noreferrer">
                AthLocalWebStudio
              </a>
            </p>
          </div>

          <div className={styles.paymentBadges} aria-label="Payment methods">
            <span aria-label="Visa"><FaCcVisa /></span>
            <span aria-label="Mastercard"><FaCcMastercard /></span>
            <span aria-label="PayPal"><FaCcPaypal /></span>
            <span aria-label="Apple Pay" className={styles.applePay}><FaApple /><small>Pay</small></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
