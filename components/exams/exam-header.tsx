"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "./theme";
import { getTimeBasedGreeting } from "@/lib/utils";

interface ExamHeaderProps {
  dark: boolean;
  setDark: (fn: (d: boolean) => boolean) => void;
  examSlug: string;
  examName: string;
}

const TABS = [
  { label: "Home", href: "" },
  { label: "Study", href: "study" },
  { label: "Stats", href: "stats" },
  { label: "Self assessments", href: "self-assessments" },
  { label: "Review", href: "review" },
] as const;

export function ExamHeader({ dark, setDark, examSlug, examName }: ExamHeaderProps) {
  const t = useTheme(dark);
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();

  const basePath = `/exams/${examSlug}`;

  const userName = user?.firstName ?? user?.username ?? "there";

  const TabNav = () => (
    <nav className="flex items-center gap-2 flex-wrap justify-center">
      {TABS.map((tab) => {
        const href = tab.href ? `${basePath}/${tab.href}` : basePath;
        const isActive =
          (tab.href === "" && pathname === basePath) ||
          (tab.href !== "" && (pathname === href || pathname.startsWith(href + "/")));
        return (
          <Link
            key={tab.href || "home"}
            href={href}
            className="rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer hover:opacity-90"
            style={{
              background: isActive
                ? "var(--primary)"
                : dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.06)",
              color: isActive ? "var(--primary-foreground)" : (dark ? "#cbd5e1" : "#1A1A19"),
            }}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <header
        className="sticky top-0 z-20 flex items-center gap-6 px-4 sm:px-6 py-4 border-b md:border-b-0"
        style={{
          background: dark ? "#0e0e10" : "#F8F8F7",
          borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        }}
      >
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-baseline gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
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
        </Link>

        <div className="flex flex-1 justify-center px-2 sm:px-4 hidden md:block">
          <TabNav />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span
            className="hidden sm:inline text-sm font-medium"
            style={{ color: t.text }}
          >
            {getTimeBasedGreeting()}, {userName}!
          </span>
          <span
            className="hidden lg:inline text-sm font-semibold tracking-wide truncate max-w-[120px] rounded-md px-2 py-0.5 text-primary"
            style={{
              background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            }}
          >
            {examName}
          </span>
          <button
            onClick={() => setDark((d) => !d)}
            className="rounded-lg p-2 shrink-0 cursor-pointer transition-colors hover:opacity-80"
            style={{
              background: "transparent",
              color: t.subtext,
            }}
            title={dark ? "Light mode" : "Dark mode"}
          >
            {dark ? (
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
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
                    background: dark ? "rgba(255,255,255,0.06)" : "#F2F2F0",
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

      {/* Mobile bottom tab bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-20 md:hidden border-t pb-[env(safe-area-inset-bottom)]"
        style={{
          background: dark ? "#0e0e10" : "#F8F8F7",
          borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        }}
      >
        <div className="flex justify-around items-center py-3 px-2 gap-1">
          {TABS.map((tab) => {
            const href = tab.href ? `${basePath}/${tab.href}` : basePath;
            const isActive =
              (tab.href === "" && pathname === basePath) ||
              (tab.href !== "" && (pathname === href || pathname.startsWith(href + "/")));
            return (
              <Link
                key={tab.href || "home"}
                href={href}
                className="flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-full min-w-0 transition-all duration-200 cursor-pointer active:scale-[0.98]"
                style={{
                  background: isActive ? "var(--primary)" : "transparent",
                  color: isActive ? "var(--primary-foreground)" : t.subtext,
                }}
              >
                <span className="text-xs font-semibold truncate w-full text-center">
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
