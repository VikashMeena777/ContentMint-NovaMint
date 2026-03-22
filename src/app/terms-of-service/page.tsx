import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Terms of Service — ContentMint",
  description: "ContentMint Terms of Service — the rules governing your use of our platform.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <nav className="sticky top-0 z-50 glass-card-static border-b border-[hsl(var(--border))]">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/ContentMint Logo.jpg"
              alt="ContentMint"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="text-lg font-bold text-text-primary font-display tracking-tight">
              ContentMint
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/about" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">About</Link>
            <Link href="/contact" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Contact</Link>
            <Link href="/terms-of-service" className="text-sm font-medium text-accent">Terms</Link>
            <Link href="/privacy-policy" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Privacy</Link>
            <Link href="/cookie-policy" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Cookies</Link>
          </div>
          <Link href="/login" className="btn-primary text-sm">
            Get Started Free
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display font-bold text-4xl text-text-primary mb-2">
          Terms of Service
        </h1>
        <p className="text-text-muted text-sm mb-10">
          Last updated: March 22, 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              By accessing or using ContentMint, you agree to be bound by these
              Terms of Service and our Privacy Policy. If you do not agree, you
              may not use the service.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">
              2. Account Registration
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              You must provide accurate and complete information when creating an
              account. You are responsible for maintaining the confidentiality of
              your credentials and for all activities that occur under your
              account.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">
              3. Acceptable Use
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              You agree not to use ContentMint to generate content that is
              illegal, harmful, defamatory, or violates the rights of others.
              We reserve the right to suspend accounts that violate this policy.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">
              4. Intellectual Property
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Content you generate using ContentMint belongs to you. You grant us
              a limited licence to use anonymised, aggregated data to improve our
              AI models. The ContentMint platform, branding, and technology remain
              our intellectual property.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">
              5. Subscriptions &amp; Billing
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Paid plans are billed monthly or annually. You may cancel at any
              time; your access continues until the end of your billing period.
              Refunds are handled on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">
              6. Limitation of Liability
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              ContentMint is provided &quot;as is&quot; without warranties of any kind.
              We are not liable for any indirect, incidental, or consequential
              damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">
              7. Contact
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Questions about these terms? Email{" "}
              <a href="mailto:legal@contentmint.ai" className="text-accent hover:underline">
                legal@contentmint.ai
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
