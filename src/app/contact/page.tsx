"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

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

      <main className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-text-primary mb-4">
          Contact Us
        </h1>
        <p className="text-text-secondary text-lg mb-12">
          Have a question, suggestion or partnership inquiry? We&apos;d love to
          hear from you.
        </p>

        {submitted ? (
          <div className="glass-card-featured p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[hsl(var(--success)/0.15)] flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6 text-[hsl(var(--success))]" />
            </div>
            <h2 className="font-display font-bold text-2xl text-text-primary mb-2">
              Message Sent!
            </h2>
            <p className="text-text-secondary">
              We&apos;ll get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="glass-card p-8 space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="input-field w-full"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="input-field w-full"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Subject
              </label>
              <input
                type="text"
                required
                className="input-field w-full"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Message
              </label>
              <textarea
                required
                rows={5}
                className="input-field w-full resize-none"
                placeholder="Tell us more..."
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              <Mail className="w-4 h-4" />
              Send Message
            </button>
          </form>
        )}

        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          <div className="glass-card p-6 text-center">
            <Mail className="w-6 h-6 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-text-primary mb-1">Email</h3>
            <p className="text-text-secondary text-sm">[ContentMintApp@gamil.com]</p>
          </div>
          <div className="glass-card p-6 text-center">
            <MessageSquare className="w-6 h-6 text-spark mx-auto mb-3" />
            <h3 className="font-semibold text-text-primary mb-1">Social</h3>
            <p className="text-text-secondary text-sm">@contentmint on IG</p>
          </div>
        </div>
      </main>
    </>
  );
}
