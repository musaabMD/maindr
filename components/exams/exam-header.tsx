"use client";

import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Sparkles, PanelLeft } from "lucide-react";
import { useTheme } from "./theme";
import { SidebarTrigger } from "@/components/ui/sidebar";

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

export function ExamHeader({ dark, setDark, examSlug, examName, pageTitle, sidebarOpen, onSidebarOpenChange, useShadcnSidebar }: ExamHeaderProps) {
  const t = useTheme(dark);
  const { user, isSignedIn } = useUser();

  return (
    <>
      <header
        className="sticky top-0 z-[160] flex items-center gap-1.5 sm:gap-4 md:gap-6 px-3 sm:px-6 py-2.5 sm:py-4 border-b md:border-b-0 min-h-[var(--header-height)]"
        style={{
          background: dark ? "#0e0e10" : "#ffffff",
          borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        }}
      >
        {useShadcnSidebar ? (
          <SidebarTrigger className="-ml-1 shrink-0" />
        ) : onSidebarOpenChange ? (
          <button
            type="button"
            onClick={() => onSidebarOpenChange(!sidebarOpen)}
            className="shrink-0 rounded-md p-2 -ml-1 text-current hover:opacity-80 transition-opacity touch-manipulation"
            style={{ color: t.subtext }}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <PanelLeft className="size-5" />
          </button>
        ) : null}
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-baseline gap-1 sm:gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span
            className="font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(20px, 5vw, 28px)",
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
        </Link>

        {pageTitle ? (
          <span
            className="hidden sm:block truncate max-w-[180px] md:max-w-[240px] text-sm font-medium ml-2 md:ml-4 pl-2 md:pl-4 border-l border-current border-opacity-20"
            style={{ color: t.subtext }}
          >
            {pageTitle}
          </span>
        ) : null}

        <div className="flex flex-1" aria-hidden />

        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <Link
            href="/upgrade"
            className="flex items-center gap-1.5 rounded-lg px-2 sm:px-2.5 py-1.5 shrink-0 cursor-pointer transition-colors hover:opacity-80 font-medium text-sm min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 justify-center sm:justify-start"
            style={{
              background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              color: t.text,
            }}
            title="Upgrade"
          >
            <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">Upgrade</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  className="text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity px-3 py-2.5 sm:px-2 sm:py-1 min-h-[44px] sm:min-h-0 flex items-center justify-center rounded-lg"
                  style={{ color: t.text }}
                  aria-label="Sign in"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  className="text-sm font-medium rounded-lg border px-3 py-2.5 sm:px-3 sm:py-1.5 cursor-pointer hover:opacity-90 transition-opacity min-h-[44px] sm:min-h-0 flex items-center justify-center"
                  style={{
                    color: t.text,
                    borderColor: t.border,
                    background: dark ? "rgba(255,255,255,0.06)" : "#F2F2F0",
                  }}
                  aria-label="Sign up"
                >
                  Sign up
                </button>
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
      </header>
    </>
  );
}
