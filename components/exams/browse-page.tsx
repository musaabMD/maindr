"use client";

import { useState, useMemo } from "react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "./theme";
import { ExamCard } from "./exam-card";
import { SuggestExamForm } from "./suggest-exam-form";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
interface BrowsePageProps {
  dark: boolean;
  setDark: (fn: (d: boolean) => boolean) => void;
}

export function BrowsePage({ dark, setDark }: BrowsePageProps) {
  const t = useTheme(dark);
  const [search, setSearch] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const exams = useQuery(api.exams.list);
  const isLoading = exams === undefined;
  const examList = exams ?? [];

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return examList.filter((e) => e.name.toLowerCase().includes(s));
  }, [examList, search]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${dark ? "dark" : ""}`}
      style={{
        background: t.bg,
        color: t.text,
        fontFamily: "var(--font-bricolage)",
      }}
    >
      {/* Header - mobile-first */}
      <header
        className={`z-10 flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 transition-colors duration-300 ${
          dark ? "bg-[#0e0e10] text-white" : "bg-[#F8F8F7] text-black"
        }`}
      >
        {/* Logo + actions */}
        <div className="flex items-center justify-between w-full min-w-0 gap-3 sm:shrink-0">
          <div className="flex min-w-0 shrink-0 items-baseline gap-2">
            <span
              className="font-bold tracking-tight"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(22px, 5vw, 28px)",
                color: t.text,
              }}
            >
              DrNote
            </span>
            <span
              className="text-xs sm:text-sm font-normal shrink-0"
              style={{
                fontFamily: "var(--font-bricolage)",
                color: t.subtext,
              }}
            >
              v2
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <Link href="/upgrade">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-2.5 sm:px-4 sm:h-10 gap-1.5 border-warm-400 text-warm-800 hover:bg-warm-200 hover:border-warm-500 dark:border-warm-500 dark:text-warm-200 dark:hover:bg-warm-700/50 dark:hover:border-warm-400"
              >
                <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
                <span className="hidden sm:inline">Upgrade</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSuggestOpen(true)}
              className="h-9 px-2.5 sm:px-4 sm:h-10 border-warm-400 text-warm-800 hover:bg-warm-200 hover:border-warm-500 dark:border-warm-500 dark:text-warm-200 dark:hover:bg-warm-700/50 dark:hover:border-warm-400"
            >
              <svg
                className="h-4 w-4 shrink-0 sm:mr-2"
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
              <span className="hidden sm:inline">Suggest Exam</span>
            </Button>
            <button
              onClick={() => setDark((d) => !d)}
              className="rounded-lg p-2 shrink-0 cursor-pointer transition-all h-9 w-9 flex items-center justify-center bg-warm-200 text-warm-700 hover:bg-warm-300 hover:text-warm-900 dark:bg-warm-700 dark:text-warm-300 dark:hover:bg-warm-600 dark:hover:text-warm-100 shadow-sm"
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
            <div className="flex items-center gap-1.5 sm:gap-3">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="h-9 px-2.5 sm:px-3 text-sm text-warm-700 hover:text-warm-900 hover:bg-warm-200/80 dark:text-warm-300 dark:hover:text-warm-100 dark:hover:bg-warm-700/50">
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="default" size="sm" className="h-9 px-2.5 sm:px-4 text-sm bg-warm-900 text-white hover:bg-warm-800 dark:bg-white dark:text-warm-900 dark:hover:bg-warm-100 shadow-md">
                    Sign up
                  </Button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8 sm:h-9 sm:w-9",
                    },
                  }}
                />
              </Show>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pb-24 sm:pb-20 pt-6 sm:pt-8">
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 sm:mb-8 text-center"
          style={{
            fontFamily: "var(--font-serif)",
            color: t.text,
          }}
        >
          Master Your Exams
        </h1>

        {/* Search box - prominent placement */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 pointer-events-none text-warm-500 dark:text-warm-400"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.868-3.834zm-5.242 1.406a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
            </svg>
            <Input
              id="exams-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exams..."
              className="h-12 rounded-xl border-2 pl-12 pr-4 text-base bg-white dark:bg-warm-800/50 border-warm-300 text-warm-900 placeholder:text-warm-500 focus-visible:border-primary focus-visible:ring-primary/30 dark:border-warm-600 dark:text-warm-100 dark:placeholder:text-warm-400 shadow-sm"
            />
            <span className="hidden sm:inline absolute right-3 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 font-mono text-xs bg-warm-200 text-warm-600 dark:bg-warm-700 dark:text-warm-400">
              ⌘K
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl animate-pulse"
                style={{
                  aspectRatio: "2/1",
                  minHeight: "180px",
                  background: "rgba(0,0,0,0.06)",
                }}
              />
            ))
          ) : (
            filtered.map((exam) => (
              <ExamCard key={exam._id} exam={exam} />
            ))
          )}
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
