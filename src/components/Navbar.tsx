"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check auth state
  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
      } catch {
        setIsLoggedIn(false);
      }
      setChecking(false);
    }
    checkAuth();

    // Listen for auth changes (login/logout from other tabs)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <Image
            src="/ContentMint Logo.jpg"
            alt="ContentMint"
            width={32}
            height={32}
            className={styles.logoImg}
          />
          ContentMint
        </Link>

        {/* Center nav links */}
        <div className={styles.centerLinks}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#demoSection" className={styles.navLink}>Demo</a>
          <Link href="/contact" className={styles.navLink}>Contact</Link>
        </div>

        {/* Right: auth buttons + mobile toggle */}
        <div className={styles.right}>
          {!checking && (
            <div className={styles.authDesktop}>
              {isLoggedIn ? (
                <Link href="/dashboard" className={`btn-primary ${styles.dashBtn}`}>
                  ⚡ Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className={styles.loginLink}>
                    Log in
                  </Link>
                  <Link href="/login" className={`btn-primary ${styles.getStartedBtn}`}>
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className={styles.mobileToggle}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <a href="#features" className={styles.mobileLink} onClick={closeMobile}>Features</a>
          <a href="#demoSection" className={styles.mobileLink} onClick={closeMobile}>Demo</a>
          <Link href="/contact" className={styles.mobileLink} onClick={closeMobile}>Contact</Link>

          {!checking && (
            <div className={styles.mobileDivider}>
              {isLoggedIn ? (
                <Link href="/dashboard" className="btn-primary" onClick={closeMobile} style={{ textAlign: "center" }}>
                  ⚡ Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn-ghost" onClick={closeMobile} style={{ textAlign: "center" }}>
                    Log in
                  </Link>
                  <Link href="/login" className="btn-primary" onClick={closeMobile} style={{ textAlign: "center" }}>
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
