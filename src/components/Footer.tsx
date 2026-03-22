"use client";

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

      <button className={`btn-primary ${styles.ctaBtn}`}>
        Start Generating Free →
      </button>

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
            <a href="#" className={styles.link}>Terms</a>
            <a href="#" className={styles.link}>Privacy</a>
            <a href="#" className={styles.link}>Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
