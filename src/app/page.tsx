"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

/* ── Typewriter demo data ── */
const twDemos = [
  { chip: "fitness", text: "morning workout routine for busy moms", chipColor: "#00f5d4", chipBg: "rgba(0,245,212,0.12)", chipBorder: "rgba(0,245,212,0.35)" },
  { chip: "saas", text: "AI writing tool for content creators", chipColor: "#a855f7", chipBg: "rgba(168,85,247,0.12)", chipBorder: "rgba(168,85,247,0.35)" },
  { chip: "ecomm", text: "sustainable skincare brand launch", chipColor: "#ffe600", chipBg: "rgba(255,230,0,0.12)", chipBorder: "rgba(255,230,0,0.35)" },
  { chip: "finance", text: "passive income strategies for Gen Z", chipColor: "#ff3cac", chipBg: "rgba(255,60,172,0.12)", chipBorder: "rgba(255,60,172,0.35)" },
  { chip: "creator", text: "growing a YouTube channel from 0 to 100K", chipColor: "#3b82f6", chipBg: "rgba(59,130,246,0.12)", chipBorder: "rgba(59,130,246,0.35)" },
];

const CONTENT_TYPES = ["hooks", "captions", "ctas", "titles", "ideas"] as const;
type ContentType = (typeof CONTENT_TYPES)[number];

const TAB_META: Record<ContentType, { emoji: string; label: string }> = {
  hooks: { emoji: "🎣", label: "Hooks" },
  captions: { emoji: "✍️", label: "Captions" },
  ctas: { emoji: "🚀", label: "CTAs" },
  titles: { emoji: "📰", label: "Titles" },
  ideas: { emoji: "💡", label: "Ideas" },
};

const FEATURES = [
  { icon: "🎣", title: "Viral Hooks", desc: "First-line psychology that stops the scroll dead. Pattern interrupts, curiosity gaps, and bold claims that pull readers in." },
  { icon: "✍️", title: "Captions", desc: "Platform-native copy for Instagram, TikTok, LinkedIn, and X. Tone-matched, emoji-ready, engagement-optimized." },
  { icon: "🚀", title: "CTAs", desc: "Action-triggering calls that convert. Urgency, scarcity, desire — baked into every line." },
  { icon: "📰", title: "Titles", desc: "Click-magnet headlines for blogs, videos, and reels. SEO-aware and curiosity-driven." },
  { icon: "💡", title: "Content Ideas", desc: "Never stare at a blank page again. Get 10+ trending ideas tailored to your niche in one click." },
];

const STATS = [
  { num: "50K+", label: "Creators Using It" },
  { num: "2M+", label: "Pieces Generated" },
  { num: "3 sec", label: "Avg. Gen Time" },
  { num: "10×", label: "Faster Than Manual" },
];

const TICKER_ITEMS = [
  "Viral Hooks", "Scroll-Stopping Captions", "High-Convert CTAs",
  "Magnetic Titles", "Content Ideas",
];

export default function Home() {
  /* ── State ── */
  const [topic, setTopic] = useState("");
  const [currentType, setCurrentType] = useState<ContentType>("hooks");
  const [results, setResults] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ── Typewriter state ── */
  const [twText, setTwText] = useState("");
  const [twDemoIdx, setTwDemoIdx] = useState(0);
  const [twVisible, setTwVisible] = useState(true);
  const twTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const twStateRef = useRef({ charIdx: 0, phase: "typing" as "typing" | "pause" | "deleting", demoIdx: 0 });

  /* ── Custom cursor ── */
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
    };
    document.addEventListener("mousemove", onMove);

    let animId: number;
    let mx = 0, my = 0;
    const onMoveRing = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener("mousemove", onMoveRing);

    const animRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = rx + "px";
        ringRef.current.style.top = ry + "px";
      }
      animId = requestAnimationFrame(animRing);
    };
    animRing();

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousemove", onMoveRing);
      cancelAnimationFrame(animId);
    };
  }, []);

  /* ── Typewriter effect ── */
  const twStep = useCallback(() => {
    const st = twStateRef.current;
    const demo = twDemos[st.demoIdx];

    if (st.phase === "typing") {
      st.charIdx++;
      setTwText(demo.text.slice(0, st.charIdx));
      if (st.charIdx >= demo.text.length) {
        st.phase = "pause";
        twTimerRef.current = setTimeout(twStep, 1600);
      } else {
        twTimerRef.current = setTimeout(twStep, 55);
      }
    } else if (st.phase === "pause") {
      st.phase = "deleting";
      twTimerRef.current = setTimeout(twStep, 28);
    } else if (st.phase === "deleting") {
      st.charIdx--;
      setTwText(demo.text.slice(0, st.charIdx));
      if (st.charIdx <= 0) {
        st.demoIdx = (st.demoIdx + 1) % twDemos.length;
        st.phase = "typing";
        setTwDemoIdx(st.demoIdx);
        twTimerRef.current = setTimeout(twStep, 300);
      } else {
        twTimerRef.current = setTimeout(twStep, 28);
      }
    }
  }, []);

  useEffect(() => {
    twTimerRef.current = setTimeout(twStep, 500);
    return () => { if (twTimerRef.current) clearTimeout(twTimerRef.current); };
  }, [twStep]);

  const handleInputChange = (val: string) => {
    setTopic(val);
    if (val.length > 0) {
      setTwVisible(false);
      if (twTimerRef.current) clearTimeout(twTimerRef.current);
    } else {
      setTwVisible(true);
      twStateRef.current = { charIdx: 0, phase: "typing", demoIdx: 0 };
      setTwDemoIdx(0);
      setTwText("");
      twTimerRef.current = setTimeout(twStep, 500);
    }
  };

  /* ── Generate content (landing page demo — mock data) ── */
  const generateContent = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");

    // Simulate API delay for realistic feel
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const t = topic.trim();
    setResults({
      hooks: [
        `I spent 30 days studying ${t} — here's what nobody tells you.`,
        `Stop doing ${t} wrong. This one shift changes everything.`,
        `The #1 ${t} mistake killing your results (and the fix).`,
      ],
      captions: [
        `If you're sleeping on ${t}, wake up. 🔥 Here's why the smartest creators are already all-in → [link in bio]`,
        `POV: You finally figured out ${t} and your engagement 3x'd overnight 📈`,
        `"${t}? That's not for me." — You, 6 months before it changed your business. Let me explain ⬇️`,
      ],
      ctas: [
        `Grab the free ${t} playbook before we gate it →`,
        `DM "${t.split(" ")[0].toUpperCase()}" and I'll send you the full breakdown.`,
        `Only 48 hours left to join the ${t} masterclass — spots are almost gone 🔒`,
      ],
      titles: [
        `How ${t} Took Me From 0 to 100K Followers in 90 Days`,
        `The Ultimate ${t} Guide (2025 Edition)`,
        `Why ${t} Is the Most Underrated Strategy Right Now`,
      ],
      ideas: [
        `Create a "Day in the Life" reel showing your ${t} workflow from start to finish`,
        `Interview 5 experts on their #1 ${t} hot take — compile into a carousel`,
        `Build a free ${t} calculator/checklist tool and use it as a lead magnet`,
      ],
    });

    setLoading(false);
  };

  const copyItem = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).catch(() => {});
    const el = document.getElementById(`copy-btn-${idx}`);
    if (el) {
      el.textContent = "Copied!";
      el.style.color = "var(--accent2)";
      el.style.borderColor = "var(--accent2)";
      setTimeout(() => {
        el.textContent = "Copy";
        el.style.color = "";
        el.style.borderColor = "";
      }, 1500);
    }
  };

  const currentItems = results[currentType] || [];
  const hasAnyResults = Object.keys(results).length > 0;
  const currentDemo = twDemos[twDemoIdx];

  return (
    <div className="homepage" style={{ background: 'var(--hp-bg)', minHeight: '100vh' }}>
      {/* Custom cursor */}
      <div ref={cursorRef} className={styles.cursor}></div>
      <div ref={ringRef} className={styles.cursorRing}></div>

      {/* Navbar */}
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className={styles.hero}>
        <div className={`orb ${styles.orb1}`}></div>
        <div className={`orb ${styles.orb2}`}></div>
        <div className={`orb ${styles.orb3}`}></div>

        <div className="badge">ContentMint — AI Content Engine</div>

        <h1 className={styles.heroTitle}>
          <span className={styles.line1}>Stop Staring.</span>
          <span className={`${styles.line2} gradient-text`}>Start Going Viral.</span>
        </h1>

        <p className={styles.heroSub}>
          Generate irresistible hooks, captions, CTAs, titles, and ideas in seconds.
          Built for creators who can&apos;t afford to be forgettable.
        </p>

        <div className={styles.heroCta}>
          <Link href="/login" className="btn-primary">
            Generate Free ⚡
          </Link>
          <button className="btn-ghost" onClick={() => document.getElementById("demoSection")?.scrollIntoView({ behavior: "smooth" })}>
            See It In Action →
          </button>
        </div>
      </section>

      {/* ═══ TICKER ═══ */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="ticker-item">{item}</span>
          ))}
        </div>
      </div>

      {/* ═══ FEATURES ═══ */}
      <div className="section" id="features" style={{ scrollMarginTop: 80 }}>
        <p className="section-label">What We Generate</p>
        <h2 className="section-title">Five weapons.<br />One prompt.</h2>
        <div className="cards-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="card">
              <span className="card-icon">{f.icon}</span>
              <div className="card-title">{f.title}</div>
              <p className="card-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ DEMO ═══ */}
      <div className="section" style={{ paddingTop: 0 }} id="demoSection">
        <p className="section-label">Live Demo</p>
        <h2 className="section-title" style={{ marginBottom: 40 }}>Try it right now.</h2>

        <div className={styles.demoWrap}>
          {/* Faux title bar */}
          <div className={styles.demoBar}>
            <div className={styles.demoDot} style={{ background: "#ff5f57" }}></div>
            <div className={styles.demoDot} style={{ background: "#ffbd2e" }}></div>
            <div className={styles.demoDot} style={{ background: "#28c840" }}></div>
            <div className={styles.demoTitleBar}>ContentMint — generator</div>
          </div>

          <div className={styles.demoBody}>
            {/* Input row */}
            <div className={styles.inputRow}>
              <div className={styles.inputInner}>
                <input
                  id="topicInput"
                  className={styles.input}
                  type="text"
                  value={topic}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generateContent()}
                  placeholder=""
                />
                {/* Typewriter placeholder */}
                <span className={`${styles.twPlaceholder} ${!twVisible ? styles.twHidden : ""}`}>
                  <span
                    className={styles.twChip}
                    style={{
                      color: currentDemo.chipColor,
                      background: currentDemo.chipBg,
                      borderColor: currentDemo.chipBorder,
                    }}
                  >
                    {currentDemo.chip}
                  </span>
                  <span className={styles.twTextSpan}>{twText}</span>
                </span>
              </div>
              <button
                className={`${styles.genBtn} ${loading ? styles.genBtnLoading : ""}`}
                onClick={generateContent}
                disabled={loading}
              >
                {loading ? "Generating…" : "Generate ⚡"}
              </button>
            </div>

            {/* Type tabs */}
            <div className={styles.tabs}>
              {CONTENT_TYPES.map((type, i) => (
                <button
                  key={type}
                  className={`${styles.tab} ${currentType === type ? styles.tabActive : ""}`}
                  data-tab-index={i}
                  onClick={() => setCurrentType(type)}
                >
                  {TAB_META[type].emoji} {TAB_META[type].label}
                </button>
              ))}
            </div>

            {/* Output area */}
            <div className={styles.outputArea}>
              {loading ? (
                <div style={{ padding: "8px 0" }}>
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="skeleton-line"
                      style={{
                        width: i % 3 === 1 ? "80%" : i % 3 === 2 ? "90%" : "100%",
                        marginTop: i > 0 && i % 3 === 0 ? 20 : 0,
                      }}
                    ></div>
                  ))}
                </div>
              ) : error ? (
                <div className={styles.placeholderState}>
                  <div className={styles.placeholderIcon}>⚠️</div>
                  <div className={styles.placeholderText}>{error}</div>
                </div>
              ) : currentItems.length > 0 ? (
                currentItems.map((item, i) => (
                  <div
                    key={i}
                    className={styles.outputItem}
                    style={{ animationDelay: `${i * 0.1}s` }}
                    onClick={() => copyItem(item, i)}
                  >
                    <span className={styles.itemNum}>0{i + 1}</span>
                    <span className={styles.itemText}>{item}</span>
                    <button id={`copy-btn-${i}`} className={styles.itemCopy}>Copy</button>
                  </div>
                ))
              ) : hasAnyResults ? (
                <div className={styles.placeholderState}>
                  <div className={styles.placeholderIcon}>🔄</div>
                  <div className={styles.placeholderText}>Generate to see {currentType}</div>
                </div>
              ) : (
                <div className={styles.placeholderState}>
                  <div className={styles.placeholderIcon}>✨</div>
                  <div className={styles.placeholderText}>Enter a topic and hit Generate</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ STATS ═══ */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <div className="stats-strip">
          {STATS.map((s, i) => (
            <div key={i} className="stat-item">
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <Footer />
    </div>
  );
}
