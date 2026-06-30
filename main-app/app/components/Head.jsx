"use client";

import React, { useState } from "react";
import Link from "next/link";
import Styles from "@/app/head.module.css";
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

const discordUrl = process.env.NEXT_PUBLIC_DISCORD_URL || "#";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={Styles.header}>
      <nav className={Styles.nav}>
        <div className={Styles.logoContainer}>
          <Link href="/" onClick={closeMenu}>
            <Image
              src="/logo.png"
              alt="Live In logo"
              width={70}
              height={70}
              className={Styles.logoImg}
              priority
            />
          </Link>
        </div>

        <div className={Styles.logoDropdown}>
          <span className={Styles.logo}>
            Live In <ChevronDownIcon className={Styles.chevron} />
          </span>
          <ul className={Styles.dropdownContent}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/#games">Games</Link></li>
            <li><Link href="/#pricing">Pricing</Link></li>
            <li><Link href="/access">Access Games</Link></li>
            <li><Link href="/faq">FAQS</Link></li>
            <li><Link href="/setup-guide">Setup Guide</Link></li>
            <li><Link href="https://youtube.com/@iliaskot" target="_blank">YouTube</Link></li>
            <li><Link href={discordUrl} target="_blank">Discord</Link></li>
            <li><Link href="https://www.tiktok.com/@live_in_official" target="_blank">TikTok</Link></li>
          </ul>
        </div>

        <button
          className={Styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? (
            <XMarkIcon className={Styles.hamburgerIcon} />
          ) : (
            <Bars3Icon className={Styles.hamburgerIcon} />
          )}
        </button>

        {menuOpen && (
          <div className={Styles.mobileMenu}>
            <ul>
              <li><Link href="/" onClick={closeMenu}>Home</Link></li>
              <li><Link href="/#games" onClick={closeMenu}>Games</Link></li>
              <li><Link href="/#pricing" onClick={closeMenu}>Pricing</Link></li>
              <li><Link href="/access" onClick={closeMenu}>Access Games</Link></li>
              <li><Link href="/#faqs" onClick={closeMenu}>FAQS</Link></li>
              <li><Link href="https://youtube.com/@iliaskot" target="_blank" onClick={closeMenu}>YouTube</Link></li>
              <li><Link href={discordUrl} target="_blank" onClick={closeMenu}>Discord</Link></li>
              <li><Link href="https://www.tiktok.com/@live_in_official" target="_blank" onClick={closeMenu}>TikTok</Link></li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
