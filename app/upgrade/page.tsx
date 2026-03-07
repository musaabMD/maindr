"use client";

import Link from "next/link";
import { PricingTable } from "@clerk/nextjs";

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-[#F8F8F7] dark:bg-[#0e0e10] transition-colors duration-300">
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#F8F8F7] dark:bg-[#0e0e10] border-b border-black/8 dark:border-white/8">
        <Link
          href="/"
          className="flex items-baseline gap-2 text-black dark:text-white hover:opacity-80 transition-opacity"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          <span className="font-bold text-2xl tracking-tight">DrNote</span>
          <span className="text-sm font-normal opacity-70" style={{ fontFamily: "var(--font-bricolage)" }}>
            v2
          </span>
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors"
          style={{ fontFamily: "var(--font-bricolage)" }}
        >
          ← Back to exams
        </Link>
      </header>

      <main className="mx-auto max-w-[900px] px-6 py-12">
        <div className="mb-10 text-center">
          <h1
            className="mb-3 font-bold tracking-tight text-black dark:text-white"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 4vw, 40px)",
            }}
          >
            Upgrade Your Plan
          </h1>
          <p
            className="mx-auto max-w-[480px] text-base text-black/70 dark:text-white/70"
            style={{ fontFamily: "var(--font-bricolage)" }}
          >
            Unlock more exams, practice questions, and premium study features.
          </p>
        </div>

        <PricingTable
          newSubscriptionRedirectUrl="/"
          fallback={
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </div>
          }
        />
      </main>
    </div>
  );
}
