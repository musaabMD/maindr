"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { PricingTable } from "@clerk/nextjs";
import {
  Sparkles,
  Clock,
  BarChart3,
  LayoutList,
  MessageSquare,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

function subscribePrefersDark(callback: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function usePrefersDark() {
  return useSyncExternalStore(subscribePrefersDark, getPrefersDark, () => false);
}

/** Real features that exist in the app (no made-up demos). */
const REAL_FEATURES = [
  {
    title: "Quiz modes",
    subtitle:
      "Timed Quiz, Weakest Subject, Missed Questions, Build Your Own, Questions, Score Predictor — premium modes where noted.",
    icon: Clock,
    items: [
      "Timed Quiz",
      "Weakest Subject",
      "Missed Questions",
      "Build Your Own",
      "Questions",
      "Score Predictor",
    ],
  },
  {
    title: "Performance by subject",
    subtitle:
      "Accuracy by subject (e.g. Medicine, Clinical Sciences) with Strong, Average, and Needs work tiers.",
    icon: BarChart3,
    items: ["Accuracy per subject", "Strong / Average / Needs work"],
  },
  {
    title: "Study by topic",
    subtitle: "Study sets with progress, scores, and percentages per set.",
    icon: LayoutList,
    items: ["Study sets with progress", "Score and % per set"],
  },
  {
    title: "Review",
    subtitle: "Filter and review with full explanations.",
    icon: MessageSquare,
    items: ["All / Flagged / Incorrect / Correct", "Full explanations"],
  },
] as const;

function pricingTableAppearance(prefersDark: boolean) {
  if (prefersDark) {
    return {
      variables: {
        fontFamily: "var(--font-bricolage), ui-sans-serif, system-ui, sans-serif",
        fontFamilyButtons: "var(--font-bricolage), ui-sans-serif, system-ui, sans-serif",
        borderRadius: "0.875rem",
        spacing: "1rem",
        colorBackground: "#0e0e10",
        colorForeground: "#fafafa",
        colorPrimary: "#fafafa",
        colorPrimaryForeground: "#0a0a0a",
        colorMutedForeground: "#a1a1aa",
        colorMuted: "#27272a",
        colorBorder: "rgba(255,255,255,0.12)",
        colorInput: "#18181b",
        colorInputForeground: "#fafafa",
        colorRing: "#fafafa",
        colorShadow: "rgba(0,0,0,0.4)",
      },
    };
  }
  return {
    variables: {
      fontFamily: "var(--font-bricolage), ui-sans-serif, system-ui, sans-serif",
      fontFamilyButtons: "var(--font-bricolage), ui-sans-serif, system-ui, sans-serif",
      borderRadius: "0.875rem",
      spacing: "1rem",
      colorBackground: "#ffffff",
      colorForeground: "#09090b",
      colorPrimary: "#18181b",
      colorPrimaryForeground: "#ffffff",
      colorMutedForeground: "#71717a",
      colorMuted: "#f4f4f5",
      colorBorder: "#e4e4e7",
      colorInput: "#fafafa",
      colorInputForeground: "#09090b",
      colorRing: "#18181b",
      colorShadow: "rgba(0,0,0,0.06)",
    },
  };
}

type PlanScope = "personal" | "business";

export default function UpgradePage() {
  const prefersDark = usePrefersDark();
  const [planScope, setPlanScope] = useState<PlanScope>("personal");

  return (
    <div className="min-h-screen bg-white text-zinc-950 transition-colors duration-300 dark:bg-[#0e0e10] dark:text-zinc-50">
      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#0e0e10]/90">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-baseline gap-2 text-zinc-900 transition-opacity hover:opacity-80 dark:text-white"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            <span className="text-xl font-bold tracking-tight sm:text-2xl">
              DrNote
            </span>
            <span
              className="text-xs font-normal text-zinc-500 sm:text-sm dark:text-zinc-400"
              style={{ fontFamily: "var(--font-bricolage)" }}
            >
              v2
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            style={{ fontFamily: "var(--font-bricolage)" }}
          >
            ← Back to exams
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
        <div className="mb-12 text-center sm:mb-14">
          <h1
            className="mb-4 font-semibold tracking-tight text-zinc-900 dark:text-white"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 5vw, 2.75rem)",
            }}
          >
            Upgrade your plan
          </h1>
          <p
            className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400"
            style={{ fontFamily: "var(--font-bricolage)" }}
          >
            Unlock more exams, practice questions, and premium study features.
            Cancel anytime.
          </p>

          <div
            className="mx-auto inline-flex rounded-full border border-zinc-200/90 bg-zinc-100/90 p-1 shadow-sm dark:border-white/[0.1] dark:bg-white/[0.06]"
            role="tablist"
            aria-label="Plan type"
          >
            <button
              type="button"
              role="tab"
              aria-selected={planScope === "personal"}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
                planScope === "personal"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              )}
              style={{ fontFamily: "var(--font-bricolage)" }}
              onClick={() => setPlanScope("personal")}
            >
              Personal
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={planScope === "business"}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
                planScope === "business"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              )}
              style={{ fontFamily: "var(--font-bricolage)" }}
              onClick={() => setPlanScope("business")}
            >
              Business
            </button>
          </div>
        </div>

        <div className="mb-20 min-h-[280px] w-full">
          <PricingTable
            key={planScope}
            for={planScope === "business" ? "organization" : "user"}
            appearance={pricingTableAppearance(prefersDark)}
            ctaPosition="top"
            collapseFeatures={false}
            newSubscriptionRedirectUrl="/"
            fallback={
              <div className="flex justify-center py-20">
                <div
                  className="size-9 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700 dark:border-zinc-600 dark:border-t-zinc-200"
                  aria-hidden
                />
              </div>
            }
          />
        </div>

        <section className="border-t border-zinc-200 pt-14 dark:border-white/[0.08]">
          <div className="mb-8 flex items-center gap-3 sm:mb-10">
            <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/[0.06]">
              <Sparkles className="size-5 text-zinc-700 dark:text-zinc-300" />
            </div>
            <div className="text-left">
              <h2
                className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl dark:text-white"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                What you get in the app
              </h2>
              <p
                className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400"
                style={{ fontFamily: "var(--font-bricolage)" }}
              >
                Real features available today — not mockups.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {REAL_FEATURES.map(({ title, subtitle, icon: Icon, items }, i) => (
              <div
                key={i}
                className="flex flex-col rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03]"
              >
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-white/[0.06]">
                    <Icon className="size-5 text-zinc-700 dark:text-zinc-300" />
                  </div>
                  <div className="min-w-0">
                    <h3
                      className="font-semibold tracking-tight text-zinc-900 dark:text-white"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {title}
                    </h3>
                    <p
                      className="mt-1 text-sm leading-snug text-zinc-600 dark:text-zinc-400"
                      style={{ fontFamily: "var(--font-bricolage)" }}
                    >
                      {subtitle}
                    </p>
                  </div>
                </div>
                <ul className="mt-auto space-y-2 border-t border-zinc-100 pt-4 dark:border-white/[0.06]">
                  {items.map((item, j) => (
                    <li
                      key={j}
                      className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                      style={{ fontFamily: "var(--font-bricolage)" }}
                    >
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-zinc-400 dark:text-zinc-500"
                        strokeWidth={2}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
