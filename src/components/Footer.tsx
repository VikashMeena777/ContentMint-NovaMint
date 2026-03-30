"use client";

import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Gradient glow background */}
      <div className={styles.glowBg}></div>

      <h2 className={styles.title}>
        Your next viral post
        <br />
        is one click away.
      </h2>

      <p className={styles.sub}>
        No credit card. No learning curve. Just results.
      </p>

      <Link href="/login" className={`btn-primary ${styles.ctaBtn}`}>
        Start Generating Free →
      </Link>

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
          <span className={styles.brand}>
            <span className={styles.brandDot}>●</span> ContentMint
          </span>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} ContentMint. Built for creators.
          </span>
          <div className={styles.links}>
            <Link href="/about" className={styles.link}>About</Link>
            <Link href="/terms-of-service" className={styles.link}>Terms</Link>
            <Link href="/privacy-policy" className={styles.link}>Privacy</Link>
            <Link href="/cookie-policy" className={styles.link}>Cookies</Link>
            <Link href="/contact" className={styles.link}>Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
