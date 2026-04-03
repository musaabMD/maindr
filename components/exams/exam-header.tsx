"use client";

import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { PanelLeft } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface ExamHeaderProps {
  dark: boolean;
  setDark: (fn: (d: boolean) => boolean) => void;
  examSlug: string;
  examName: string;
  /** Current page title (e.g. "Practice Questions", "Study") - shown in header */
  pageTitle?: string;
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  /** When true, render shadcn SidebarTrigger instead of custom toggle */
  useShadcnSidebar?: boolean;
}

export function ExamHeader({
  dark,
  pageTitle,
  sidebarOpen,
  onSidebarOpenChange,
  useShadcnSidebar,
}: ExamHeaderProps) {
  return (
    <header
        className={cn(
          "sticky top-0 z-[160] flex min-h-[var(--header-height)] items-center border-b px-4 py-3 sm:px-5 md:px-6",
          /* Same surface as main column in light mode; subtle separator like Chatbase top bar */
          "border-zinc-200/60 bg-white dark:border-white/[0.08] dark:bg-[#0e0e10]"
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          {useShadcnSidebar ? (
            <SidebarTrigger className="-ml-0.5 shrink-0 rounded-lg p-2 text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10" />
          ) : onSidebarOpenChange ? (
            <button
              type="button"
              onClick={() => onSidebarOpenChange(!sidebarOpen)}
              className="-ml-0.5 shrink-0 touch-manipulation rounded-lg p-2 text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <PanelLeft className="size-5" />
            </button>
          ) : null}

          <Link
            href="/"
            className="group flex shrink-0 cursor-pointer items-baseline gap-1.5"
          >
            <span
              className="font-bold tracking-tight text-zinc-900 transition-opacity group-hover:opacity-80 dark:text-white"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.15rem, 4vw, 1.4rem)",
              }}
            >
              DrNote
            </span>
            <span
              className="shrink-0 text-[0.7rem] font-medium tracking-tight text-zinc-500 sm:text-xs dark:text-zinc-400"
              style={{ fontFamily: "var(--font-bricolage)" }}
            >
              v2
            </span>
          </Link>

          {pageTitle ? (
            <span
              className="hidden max-w-[160px] truncate border-l border-zinc-200 pl-3 text-sm font-medium text-zinc-500 sm:block md:max-w-[200px] md:pl-4 dark:border-white/[0.12] dark:text-zinc-400"
            >
              {pageTitle}
            </span>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="min-h-10 rounded-full border border-zinc-200/90 bg-zinc-50/80 px-3.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100/90 dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/10 sm:min-h-9"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="min-h-10 rounded-full bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 dark:hover:bg-primary/85 sm:min-h-9"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  Sign up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "h-8 w-8 sm:h-9 sm:w-9 ring-1 ring-zinc-200 dark:ring-white/15",
                  },
                }}
              />
            </Show>
        </div>
      </header>
  );
}
