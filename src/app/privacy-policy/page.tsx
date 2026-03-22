import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Privacy Policy — ContentMint",
  description: "ContentMint Privacy Policy — how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
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
          <Link href="/login" className="btn-primary text-sm">
            Get Started Free
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display font-bold text-4xl text-text-primary mb-2">
          Privacy Policy
        </h1>
        <p className="text-text-muted text-sm mb-10">
          Last updated: March 22, 2026
        </p>

        <div className="prose-dark space-y-8">
          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">
              1. Information We Collect
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              We collect information you provide directly, such as your name,
              email address, and payment details when you create an account or
              subscribe to a paid plan. We also automatically collect usage data
              including IP addresses, browser type, device information, and pages
              visited.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">
              2. How We Use Your Information
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Your information is used to provide and improve our services,
              process transactions, send service communications, personalise your
              experience, and ensure the security of our platform. We do not sell
              your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">
              3. Data Storage &amp; Security
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Your data is stored securely using industry-standard encryption.
              We use Supabase for database management with row-level security
              policies. All data is transmitted over HTTPS/TLS encrypted
              connections.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">
              4. Your Rights
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              You have the right to access, correct, or delete your personal
              data at any time. You may also request a copy of your data or
              restrict processing. Contact us at{" "}
              <a href="mailto:privacy@contentmint.ai" className="text-accent hover:underline">
                privacy@contentmint.ai
              </a>{" "}
              for any privacy-related requests.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">
              5. Cookies
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              We use essential cookies for authentication and session management.
              Analytics cookies are used only with your consent. See our{" "}
              <Link href="/cookie-policy" className="text-accent hover:underline">
                Cookie Policy
              </Link>{" "}
              for full details.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">
              6. Contact
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              For privacy inquiries, email{" "}
              <a href="mailto:privacy@contentmint.ai" className="text-accent hover:underline">
                privacy@contentmint.ai
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
