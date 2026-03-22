import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  MessageSquare,
  Target,
  Type,
  Lightbulb,
  ArrowRight,
  Check,
  Star,
  Copy,
  Crown,
  ChevronRight,
} from "lucide-react";

/* ========================================
   HERO SECTION
   ======================================== */
function HeroSection() {
  return (
    <section className="aurora-bg relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[hsl(var(--accent)/0.06)] blur-[120px] animate-float pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[hsl(var(--spark)/0.04)] blur-[100px] animate-float delay-300 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-[hsl(var(--accent)/0.2)] bg-[hsl(var(--accent)/0.06)] animate-fade-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--accent))] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--accent))]" />
          </span>
          <span className="text-sm font-medium text-[hsl(var(--accent))]">
            AI-Powered Content Generation
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-[4.5rem] text-text-primary leading-[1.08] mb-6 animate-fade-up delay-100 fade-target">
          AI Content That
          <br />
          <span className="gradient-text">Converts.</span>
        </h1>

        {/* Subhead */}
        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-200 fade-target">
          Generate viral hooks, captions & CTAs in seconds — not hours.
          <br className="hidden sm:block" />
          Built for creators, marketers & founders who move fast.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300 fade-target">
          <Link href="/login" className="btn-primary-lg">
            <Sparkles className="w-5 h-5" />
            Start Free — No Card Needed
          </Link>
          <a href="#features" className="btn-secondary text-base py-3.5 px-8">
            See How It Works
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Social Proof */}
        <div className="mt-16 animate-fade-up delay-500 fade-target">
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted mb-4 font-medium">
            Trusted by 500+ creators & marketers
          </p>
          <div className="flex items-center justify-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-[hsl(var(--warning))] text-[hsl(var(--warning))]"
              />
            ))}
            <span className="text-sm text-text-secondary ml-2.5">
              4.9/5 — &quot;Saves me 3 hours daily&quot;
            </span>
          </div>
        </div>

        {/* Preview Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto animate-fade-up delay-600 fade-target">
          <PreviewCard
            icon={<Zap className="w-5 h-5 text-[hsl(var(--accent))]" />}
            label="Viral Hook"
            text="&ldquo;Stop scrolling. This ONE strategy grew my account from 0 to 100K in 90 days.&rdquo;"
            score="9.2"
            accent="accent"
          />
          <PreviewCard
            icon={<MessageSquare className="w-5 h-5 text-[hsl(var(--spark))]" />}
            label="Caption"
            text="&ldquo;Your content isn&apos;t bad. Your hooks are. Here&apos;s the fix... 🧵&rdquo;"
            score="8.8"
            accent="spark"
          />
          <PreviewCard
            icon={<Target className="w-5 h-5 text-[hsl(var(--success))]" />}
            label="CTA"
            text="&ldquo;Join 10,000+ creators getting viral hooks weekly → Free to start.&rdquo;"
            score="9.5"
            accent="success"
          />
        </div>
      </div>
    </section>
  );
}

function PreviewCard({
  icon,
  label,
  text,
  score,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
  score: string;
  accent: string;
}) {
  return (
    <div className="glass-card p-5 text-left group cursor-default hover:translate-y-[-2px] transition-transform duration-300">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          {label}
        </span>
        <span className={`ml-auto badge badge-${accent === "accent" ? "accent" : accent === "spark" ? "spark" : "success"} text-[0.65rem]`}>
          {score}/10
        </span>
      </div>
      <p
        className="text-sm text-text-primary leading-relaxed mb-4"
        dangerouslySetInnerHTML={{ __html: text }}
      />
      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button className="text-text-muted hover:text-[hsl(var(--warning))] transition-colors p-1" aria-label="Save">
          <Star className="w-3.5 h-3.5" />
        </button>
        <button className="text-text-muted hover:text-[hsl(var(--accent))] transition-colors p-1" aria-label="Copy">
          <Copy className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ========================================
   FEATURES SECTION (Bento Grid)
   ======================================== */
function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Viral Hooks",
      description:
        "Pattern-matched hooks using 12 proven viral frameworks. Scroll-stopping openers that boost watch time.",
      color: "accent",
      span: "lg:col-span-2",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Smart Captions",
      description:
        "Platform-optimized captions with built-in CTA placement. Hashtag suggestions included.",
      color: "spark",
      span: "",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "CTAs That Convert",
      description:
        "Action-driving calls-to-action tested across 100K+ campaigns.",
      color: "success",
      span: "",
    },
    {
      icon: <Type className="w-6 h-6" />,
      title: "Blog & Video Titles",
      description:
        "SEO-aware titles with click-through optimization. A/B test variations instantly.",
      color: "warning",
      span: "",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Content Ideas",
      description:
        "Never run out of ideas. AI suggests trending topics in your niche.",
      color: "error",
      span: "",
    },
  ];

  const colorMap: Record<string, string> = {
    accent: "hsl(var(--accent))",
    spark: "hsl(var(--spark))",
    success: "hsl(var(--success))",
    warning: "hsl(var(--warning))",
    error: "hsl(var(--error))",
  };

  return (
    <section id="features" className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="badge badge-accent mb-4 inline-flex">NEW</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.75rem] text-text-primary mb-4 leading-tight">
            5 Generators.{" "}
            <span className="gradient-text">One Platform.</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Every content type a creator needs, powered by AI that understands
            what goes viral.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`glass-card p-8 flex flex-col gap-4 group hover:translate-y-[-2px] transition-all duration-300 ${feature.span}`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `${colorMap[feature.color]}1a`,
                  color: colorMap[feature.color],
                }}
              >
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-xl text-text-primary">
                {feature.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-auto pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: colorMap[feature.color] }}
                >
                  Try it now <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================================
   HOW IT WORKS SECTION
   ======================================== */
function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Enter Your Topic",
      description:
        "Type your topic, niche, or a rough idea. That's all the AI needs.",
      icon: <Type className="w-5 h-5" />,
    },
    {
      num: "02",
      title: "Choose Your Style",
      description:
        "Select platform, tone, and content type. The AI adapts to each context.",
      icon: <Target className="w-5 h-5" />,
    },
    {
      num: "03",
      title: "Generate & Copy",
      description:
        "Get 3-5 AI-generated options. Copy your favorite with one click.",
      icon: <Copy className="w-5 h-5" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 relative">
      {/* Gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--border))] to-transparent" />

      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            How It Works
          </h2>
          <p className="text-text-secondary text-lg">
            Three steps. Zero learning curve.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={step.num} className="relative text-center sm:text-left group">
              {/* Connection line (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute top-8 left-[calc(50%+2rem)] right-[-2rem] h-px bg-gradient-to-r from-[hsl(var(--accent)/0.3)] to-transparent" />
              )}

              <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--accent)/0.1)] flex items-center justify-center text-[hsl(var(--accent))] group-hover:bg-[hsl(var(--accent)/0.15)] transition-colors">
                  {step.icon}
                </div>
                <span className="font-display font-bold text-xs text-text-muted uppercase tracking-widest">
                  Step {step.num}
                </span>
              </div>
              <h3 className="font-display font-semibold text-lg text-text-primary mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================================
   PRICING SECTION
   ======================================== */
function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Try it out — no card required",
      features: [
        "10 generations / day",
        "All 5 generators",
        "Basic tones",
        "Copy to clipboard",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "₹199",
      period: "/month",
      description: "For serious creators",
      features: [
        "100 generations / day",
        "All 5 generators",
        "All tones & niches",
        "Favorites & history",
        "Priority generation speed",
      ],
      cta: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Business",
      price: "₹399",
      period: "/month",
      description: "For agencies & teams",
      features: [
        "Unlimited generations",
        "All 5 generators",
        "Custom brand voice",
        "Export & analytics",
        "Priority support",
        "API access (soon)",
      ],
      cta: "Go Business",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6 relative">
      {/* Gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--border))] to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-text-secondary text-lg">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 flex flex-col rounded-2xl transition-all duration-300 ${
                plan.popular
                  ? "glass-card-featured scale-[1.02] lg:scale-105"
                  : "glass-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(265,70%,50%)] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg shadow-[hsl(var(--accent-glow)/0.25)]">
                    <Crown className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display font-semibold text-lg text-text-primary">
                  {plan.name}
                </h3>
                <p className="text-text-muted text-sm mt-1">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="font-display font-bold text-4xl text-text-primary">
                  {plan.price}
                </span>
                <span className="text-text-muted text-sm ml-1">
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-text-secondary"
                  >
                    <Check className="w-4 h-4 text-[hsl(var(--success))] mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className={`text-center ${
                  plan.popular ? "btn-primary" : "btn-secondary"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================================
   CTA SECTION
   ======================================== */
function CtaSection() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-4xl text-center relative overflow-hidden glass-card-featured p-12 sm:p-16">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent)/0.08)] to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[hsl(var(--spark)/0.05)] blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            Ready to Create Content That{" "}
            <span className="gradient-text">Actually Works?</span>
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
            Join 500+ creators who save 3+ hours daily with AI-generated hooks,
            captions & CTAs.
          </p>
          <Link href="/login" className="btn-primary-lg inline-flex">
            <Sparkles className="w-5 h-5" />
            Start Generating — It&apos;s Free
          </Link>
          <p className="mt-4 text-xs text-text-muted">
            No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}

/* ========================================
   MAIN PAGE
   ======================================== */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
