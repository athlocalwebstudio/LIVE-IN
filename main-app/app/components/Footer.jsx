"use client";
import { FaYoutube, FaTiktok, FaDiscord } from "react-icons/fa";
import styles from "@/app/footer.module.css";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                {/* Social Icons */}
                <div className={styles.socialIcons}>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                        <FaYoutube />
                    </a>
                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                        <FaTiktok />
                    </a>
                    <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                        <FaDiscord />
                    </a>
                </div>


                {/* Links */}
                <div className={styles.footerLinks}>
                    <a href="#faqs">FAQ</a>
                    <a href="/Terms-of-service">Terms of Service</a>
                    <a href="/Disclaimer">Disclaimer</a>
                </div>
                <div className={styles.footerText}>
                    &copy; {new Date().getFullYear()} LIVE IN.<br></br> Site by
                        <a href="https://www.athlocalwebstudio.com/" className={styles.footerLink} target="_blank" rel="noopener noreferrer">
                            LocalWebStudio
                        </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
