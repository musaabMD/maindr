"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "./theme";
import { ExamCard } from "./exam-card";
import { SuggestExamForm } from "./suggest-exam-form";
import { Input } from "@/components/ui/input";

interface BrowsePageProps {
  dark: boolean;
  setDark: (fn: (d: boolean) => boolean) => void;
}

export function BrowsePage({ dark, setDark }: BrowsePageProps) {
  const t = useTheme(dark);
  const [search, setSearch] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const exams = useQuery(api.exams.list) ?? [];

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return exams.filter((e) => e.name.toLowerCase().includes(s));
  }, [exams, search]);

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        background: t.bg,
        color: t.text,
        fontFamily: "var(--font-bricolage)",
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 flex items-center gap-6 px-6 py-4"
        style={{
          background: dark ? "#0e0e10" : "#ffffff",
        }}
      >
        <div className="flex min-w-0 shrink-0 items-baseline gap-2">
          <span
            className="font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "28px",
              color: t.text,
            }}
          >
            DrNote
          </span>
          <span
            className="text-sm font-normal"
            style={{
              fontFamily: "var(--font-bricolage)",
              color: t.subtext,
            }}
          >
            v2
          </span>
        </div>

        <div className="flex flex-1 justify-center px-4">
          <div className="relative w-full max-w-[400px]">
            <svg
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none"
              style={{ opacity: 0.4 }}
              viewBox="0 0 16 16"
              fill={t.text}
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.868-3.834zm-5.242 1.406a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
            </svg>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="h-10 rounded-lg border pl-9 pr-14 text-sm"
              style={{
                background: dark ? "rgba(255,255,255,0.06)" : "#f5f5f5",
                borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
                color: t.text,
              }}
            />
            <span
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 font-mono text-[11px]"
              style={{
                background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
                color: t.subtext,
              }}
            >
              ⌘K
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={() => setSuggestOpen(true)}
            className="flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium cursor-pointer transition-colors"
            style={{
              background: dark ? "rgba(255,255,255,0.08)" : "#f5f5f5",
              borderColor: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
              color: t.text,
            }}
          >
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
            Suggest Exam
          </button>
          <button
            onClick={() => setDark((d) => !d)}
            className="rounded-lg p-2 shrink-0 cursor-pointer transition-colors"
            style={{
              background: "transparent",
              color: t.subtext,
            }}
            title={dark ? "Light mode" : "Dark mode"}
          >
            {dark ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>
          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  className="text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ color: t.text }}
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  className="text-sm font-medium rounded-lg border px-3 py-1.5 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{
                    color: t.text,
                    borderColor: t.border,
                    background: dark ? "rgba(255,255,255,0.06)" : "#f5f5f5",
                  }}
                >
                  Sign up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              />
            </Show>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-8">
        {/* Hero section */}
        <div className="mb-12 text-center">
          <h1
            className="mb-3 font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(32px, 5vw, 48px)",
              color: t.text,
              lineHeight: 1.1,
            }}
          >
            Master Your Exams
          </h1>
          <p
            className="mx-auto max-w-[560px] text-lg"
            style={{
              fontFamily: "var(--font-bricolage)",
              color: t.subtext,
              lineHeight: 1.5,
            }}
          >
            Browse exam prep materials, practice questions, and study guides to ace your next test.
          </p>
          <Link
            href="/upgrade"
            className="mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer hover:opacity-90"
            style={{
              background: dark ? "rgba(255,255,255,0.12)" : "#18181b",
              color: dark ? "#fff" : "#fff",
            }}
          >
            Upgrade
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((exam) => (
            <ExamCard key={exam._id} exam={exam} />
          ))}
        </div>
      </div>

      <SuggestExamForm
        open={suggestOpen}
        onClose={() => setSuggestOpen(false)}
        dark={dark}
      />
    </div>
  );
}
