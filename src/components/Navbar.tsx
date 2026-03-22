"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, LayoutDashboard } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-2.5 bg-[hsl(var(--bg-base)/0.8)] backdrop-blur-xl border-b border-[hsl(var(--glass-border)/0.15)] shadow-[0_4px_30px_hsl(var(--bg-base)/0.5)]"
          : "py-4 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between relative">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--spark)/0.7)] flex items-center justify-center group-hover:shadow-[0_0_20px_hsl(var(--accent-glow)/0.5)] transition-all duration-300">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-text-primary font-display tracking-tight">
            ContentMint
          </span>
        </Link>

        {/* Center: Nav Links (absolutely centered) */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <a
            href="#features"
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-[hsl(var(--bg-hover))] transition-all duration-200"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-[hsl(var(--bg-hover))] transition-all duration-200"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-[hsl(var(--bg-hover))] transition-all duration-200"
          >
            Pricing
          </a>
        </div>

        {/* Right side: Auth Buttons (desktop) + Mobile Toggle */}
        <div className="flex items-center gap-3">
          {!checking && (
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <Link href="/dashboard" className="btn-primary text-sm py-2.5 px-5">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors px-3 py-2"
                  >
                    Log in
                  </Link>
                  <Link href="/login" className="btn-primary text-sm py-2.5 px-5">
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[hsl(var(--bg-hover))] text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 mx-4 p-4 rounded-2xl bg-[hsl(var(--bg-surface)/0.95)] backdrop-blur-2xl border border-[hsl(var(--glass-border)/0.2)] flex flex-col gap-1 animate-scale-in shadow-xl">
          <a
            href="#features"
            className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-[hsl(var(--bg-hover))] rounded-xl transition-colors"
            onClick={closeMobile}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-[hsl(var(--bg-hover))] rounded-xl transition-colors"
            onClick={closeMobile}
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-[hsl(var(--bg-hover))] rounded-xl transition-colors"
            onClick={closeMobile}
          >
            Pricing
          </a>

          {!checking && (
            <div className="mt-2 pt-3 border-t border-[hsl(var(--border))] flex flex-col gap-2">
              {isLoggedIn ? (
                <Link href="/dashboard" className="btn-primary text-center" onClick={closeMobile}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary text-center" onClick={closeMobile}>
                    Log in
                  </Link>
                  <Link href="/login" className="btn-primary text-center" onClick={closeMobile}>
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
