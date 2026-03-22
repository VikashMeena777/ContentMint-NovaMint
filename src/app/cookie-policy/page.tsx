import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Cookie Policy — ContentMint",
  description: "ContentMint Cookie Policy — how we use cookies and similar technologies.",
};

export default function CookiePolicyPage() {
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
          Cookie Policy
        </h1>
        <p className="text-text-muted text-sm mb-10">
          Last updated: March 22, 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">
              What Are Cookies?
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Cookies are small text files stored on your device when you visit a
              website. They help us remember your preferences, keep you signed
              in, and understand how you use our platform.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">
              Cookies We Use
            </h2>
            <div className="overflow-hidden rounded-xl border border-[hsl(var(--border))]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[hsl(var(--bg-elevated))]">
                    <th className="text-left p-3 text-text-muted font-medium">Cookie</th>
                    <th className="text-left p-3 text-text-muted font-medium">Purpose</th>
                    <th className="text-left p-3 text-text-muted font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(var(--border))]">
                  <tr>
                    <td className="p-3 text-text-primary font-mono text-xs">sb-*-auth-token</td>
                    <td className="p-3 text-text-secondary">Authentication session</td>
                    <td className="p-3 text-text-muted">Session</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-text-primary font-mono text-xs">sb-*-auth-token-code-verifier</td>
                    <td className="p-3 text-text-secondary">PKCE auth flow security</td>
                    <td className="p-3 text-text-muted">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">
              Managing Cookies
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              You can control and delete cookies through your browser settings.
              Disabling essential cookies may prevent you from using certain
              features like staying signed in. For more information, visit{" "}
              <a
                href="https://www.allaboutcookies.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                allaboutcookies.org
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">
              Contact
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Questions about our cookie practices? Email{" "}
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
