"use client";

import Link from "next/link";
import { PricingTable } from "@clerk/nextjs";
import { Sparkles, Clock, BarChart3, LayoutList, MessageSquare } from "lucide-react";

/** Real features that exist in the app (no made-up demos). */
const REAL_FEATURES = [
  {
    title: "Quiz Modes",
    subtitle: "In the app you get: Timed Quiz, Weakest Subject (Premium), Missed Questions (Premium), Build Your Own (Premium), Questions, and Score Predictor (Premium).",
    icon: Clock,
    items: ["Timed Quiz", "Weakest Subject", "Missed Questions", "Build Your Own", "Questions", "Score Predictor"],
  },
  {
    title: "Performance by Subject",
    subtitle: "See your accuracy by subject (e.g. Medicine, Clinical Sciences, Basic Sciences) with tiers: Strong ≥80%, Average 70–79%, Needs work <70%.",
    icon: BarChart3,
    items: ["Accuracy per subject", "Strong / Average / Needs work"],
  },
  {
    title: "Study by topic",
    subtitle: "Study sets with progress — e.g. Cell Biology: Mitosis & Meiosis 51/55 92%. Pick a set, see your score, and practice.",
    icon: LayoutList,
    items: ["Study sets with progress", "Score and % per set"],
  },
  {
    title: "Review",
    subtitle: "Filter by All, Flagged, Incorrect, or Correct. Review questions with full explanations.",
    icon: MessageSquare,
    items: ["All / Flagged / Incorrect / Correct", "Full explanations"],
  },
];

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0e0e10] transition-colors duration-300">
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white dark:bg-[#0e0e10] border-b border-black/8 dark:border-white/8 backdrop-blur-sm">
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

      <main className="mx-auto max-w-[1000px] px-4 sm:px-6 py-8 sm:py-12 pb-16">
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

        {/* Pricing - visible first */}
        <div className="mb-12 rounded-2xl border-2 border-warm-300 dark:border-warm-600 bg-white dark:bg-warm-900/50 shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden">
          <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-warm-200 dark:border-warm-700 bg-gradient-to-r from-warm-50 to-white dark:from-warm-900/80 dark:to-warm-900/50">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white" style={{ fontFamily: "var(--font-serif)" }}>
              Choose Your Plan
            </h2>
            <p className="mt-1 text-sm text-warm-600 dark:text-warm-400" style={{ fontFamily: "var(--font-bricolage)" }}>
              Unlock all premium features. Cancel anytime.
            </p>
          </div>
          <div className="p-4 sm:p-6 min-h-[280px]">
            <PricingTable
              newSubscriptionRedirectUrl="/"
              fallback={
                <div className="flex justify-center py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </div>
              }
            />
          </div>
        </div>

        {/* What you actually get in the app — no fake demos */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-emerald-500/20 dark:from-amber-400/25 dark:to-emerald-400/25">
              <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-black dark:text-white" style={{ fontFamily: "var(--font-serif)" }}>
              What you get in the app
            </h2>
          </div>

          {REAL_FEATURES.map(({ title, subtitle, icon: Icon, items }, i) => (
            <div
              key={i}
              className="rounded-2xl p-[1px] bg-gradient-to-br from-amber-400/25 via-emerald-400/15 to-primary/25 dark:from-amber-400/20 dark:via-emerald-400/15 dark:to-primary/30 shadow-xl shadow-black/5 dark:shadow-black/20"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-white/[0.06] backdrop-blur-sm">
                <div className="relative p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warm-100 dark:bg-warm-800/50">
                      <Icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-bold tracking-tight text-black dark:text-white mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                        {title}
                      </h3>
                      <p className="text-base text-black/70 dark:text-white/70 mb-4" style={{ fontFamily: "var(--font-bricolage)" }}>
                        {subtitle}
                      </p>
                      <ul className="flex flex-wrap gap-2">
                        {items.map((item, j) => (
                          <li
                            key={j}
                            className="rounded-lg border border-warm-200 dark:border-warm-700 bg-warm-50/50 dark:bg-warm-900/30 px-3 py-1.5 text-sm font-medium text-warm-800 dark:text-warm-200"
                            style={{ fontFamily: "var(--font-bricolage)" }}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
