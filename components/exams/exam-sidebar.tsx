"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition } from "react";
import { Show, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useExamLayout } from "@/components/exams/exam-layout-context";

const SIDEBAR_WIDTH = 260;

const navItems = [
  { icon: "home", label: "Home", href: "" },
  { icon: "questions", label: "New Questions", href: "questions" },
  { icon: "study", label: "Study", href: "study" },
  { icon: "stats", label: "Stats", href: "stats" },
  { icon: "exams", label: "Exams", href: "self-assessments" },
  { icon: "review", label: "Review", href: "review" },
];

function IconHome({ stroke }: { stroke: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function IconStudy({ stroke }: { stroke: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
function IconStats({ stroke }: { stroke: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function IconExams({ stroke }: { stroke: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
function IconReview({ stroke }: { stroke: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function IconQuestions({ stroke }: { stroke: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-2 3-2 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function IconMenu({ stroke }: { stroke: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function IconClose({ stroke }: { stroke: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconCap({ stroke }: { stroke: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
function IconSun({ stroke }: { stroke: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}
function IconMoon({ stroke }: { stroke: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function IconChevron({ stroke }: { stroke: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

const Icons: Record<string, React.FC<{ stroke: string }>> = {
  home: IconHome,
  questions: IconQuestions,
  study: IconStudy,
  stats: IconStats,
  exams: IconExams,
  review: IconReview,
  menu: IconMenu,
  close: IconClose,
  cap: IconCap,
  sun: IconSun,
  moon: IconMoon,
  chevron: IconChevron,
};

interface ExamSidebarProps {
  slug: string;
  examName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExamSidebar({ slug, examName, open, onOpenChange }: ExamSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { dark, setDark } = useExamLayout();
  const basePath = `/exams/${slug}`;

  const handleNavClick = (href: string) => {
    onOpenChange(false);
    startTransition(() => router.push(href));
  };

  const t = {
    bg: dark ? "#0e0e10" : "#ffffff",
    sidebar: dark ? "#0f0f12" : "#E8E8E6",
    border: dark ? "#27272a" : "#d4d4d4",
    text: dark ? "#fafafa" : "#18181b",
    sub: dark ? "#71717a" : "#52525b",
    activeBg: dark ? "#18181b" : "#27272a",
    hoverBg: dark ? "#27272a" : "#d4d4d8",
    cardBg: dark ? "#18181b" : "#e4e4e7",
    activeText: "#ffffff",
    accent: dark ? "#3f3f46" : "#27272a",
  };

  return (
    <>
      <style>{`
        .exam-nav-btn { transition: background 0.15s, color 0.15s, transform 0.12s; }
        .exam-nav-btn:hover { background: ${t.hoverBg} !important; }
        .exam-nav-btn:active { transform: scale(0.97); }
        .exam-nav-btn.is-active { background: ${t.activeBg} !important; color: ${t.activeText} !important; }
        .exam-upgrade-btn { transition: transform 0.15s, box-shadow 0.15s; }
        .exam-upgrade-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.2) !important; }
        .exam-toggle-track { transition: background 0.2s; }
        .exam-toggle-thumb { transition: left 0.2s cubic-bezier(.4,0,.2,1); }
        .exam-sidebar-wrap { transition: transform 0.12s ease-out; }
        .exam-overlay-bg { transition: opacity 0.12s ease-out; }
        @media (min-width: 768px) {
          .exam-overlay-bg { display: none !important; }
        }
      `}</style>

      {/* Overlay - z below header so header toggle stays clickable */}
      <div
        className="exam-overlay-bg md:!hidden touch-manipulation"
        onClick={() => onOpenChange(false)}
        role="button"
        tabIndex={-1}
        aria-label="Close menu"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 150,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(3px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden
      />

      {/* Sidebar */}
      <div
        className="exam-sidebar-wrap"
        style={{
          width: SIDEBAR_WIDTH,
          minHeight: "100vh",
          background: t.sidebar,
          borderRight: `1.5px solid ${t.border}`,
          display: "flex",
          flexDirection: "column",
          padding: "20px 12px",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 200,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          boxShadow: "4px 0 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNavClick(basePath)}
          style={{ display: "flex", alignItems: "center", gap: 11, padding: "6px 10px 22px", textDecoration: "none", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", font: "inherit", color: "inherit" }}
          className="touch-manipulation"
        >
          <div
            style={{
              width: 42,
              height: 42,
              background: dark ? "linear-gradient(135deg, #27272a 0%, #18181b 100%)" : "linear-gradient(135deg, #3f3f46 0%, #27272a 100%)",
              borderRadius: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
              flexShrink: 0,
            }}
          >
            <Icons.cap stroke="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: t.text, letterSpacing: "-0.4px" }}>
              {examName}
            </div>
            <div
              style={{
                fontSize: 11,
                color: t.sub,
                fontWeight: 500,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              DrNote
            </div>
          </div>
        </button>

        {/* Label */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: t.sub,
            letterSpacing: "1.4px",
            textTransform: "uppercase",
            padding: "0 10px 8px",
          }}
        >
          Navigate
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {navItems.map((item) => {
            const href = item.href ? `${basePath}/${item.href}` : basePath;
            const isActive =
              (item.href === "" && pathname === basePath) ||
              (item.href !== "" && (pathname === href || pathname.startsWith(href + "/")));
            const Icon = Icons[item.icon];
            const iconColor = isActive ? "#fff" : t.sub;
            return (
              <button
                key={item.href || "home"}
                type="button"
                onClick={() => handleNavClick(href)}
                className={`exam-nav-btn touch-manipulation${isActive ? " is-active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "none",
                  background: isActive ? t.activeBg : "transparent",
                  color: isActive ? "#fff" : t.text,
                  fontFamily: "inherit",
                  fontSize: 14.5,
                  fontWeight: isActive ? 600 : 500,
                  textAlign: "left",
                  width: "100%",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                <span style={{ flexShrink: 0, display: "flex" }}>
                  {Icon ? <Icon stroke={iconColor} /> : null}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {isActive && (
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.6)",
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Upgrade Card */}
        <div
          style={{
            background: dark ? "linear-gradient(135deg, #27272a 0%, #18181b 100%)" : "linear-gradient(135deg, #3f3f46 0%, #27272a 100%)",
            borderRadius: 14,
            padding: "16px 14px",
            marginBottom: 14,
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.7)",
              fontWeight: 600,
              letterSpacing: "0.5px",
              marginBottom: 3,
            }}
          >
            ✨ GO PREMIUM
          </div>
          <div
            style={{
              color: "white",
              fontSize: 13.5,
              fontWeight: 700,
              lineHeight: 1.4,
              marginBottom: 12,
            }}
          >
            Unlock all exams &amp; detailed analytics
          </div>
          <Link
            href="/upgrade"
            className="exam-upgrade-btn"
            style={{
              background: "white",
              color: "#18181b",
              border: "none",
              borderRadius: 8,
              padding: "8px 0",
              width: "100%",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              display: "block",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Upgrade Now →
          </Link>
        </div>

        {/* Bottom - anchored below upgrade card, neutral colors only */}
        <div
          style={{
            borderTop: `1.5px solid ${t.border}`,
            paddingTop: 12,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className="exam-nav-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 10,
              border: "none",
              background: "transparent",
              color: t.text,
              fontFamily: "inherit",
              fontSize: 13.5,
              fontWeight: 500,
              cursor: "pointer",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {dark ? <Icons.sun stroke={t.sub} /> : <Icons.moon stroke={t.sub} />}
              {dark ? "Light mode" : "Dark mode"}
            </span>
            <div
              className="exam-toggle-track"
              style={{
                width: 38,
                height: 21,
                background: dark ? t.accent : t.border,
                borderRadius: 999,
                position: "relative",
                flexShrink: 0,
              }}
            >
              <div
                className="exam-toggle-thumb"
                style={{
                  position: "absolute",
                  top: 3,
                  left: dark ? 19 : 3,
                  width: 15,
                  height: 15,
                  borderRadius: "50%",
                  background: dark ? "var(--primary)" : "#fafafa",
                  boxShadow: dark
                    ? "0 1px 4px rgba(0,0,0,0.35)"
                    : "0 1px 3px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
                }}
              />
            </div>
          </button>
          <Show when="signed-in">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 11,
                background: t.cardBg,
              }}
            >
              <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user?.fullName ?? user?.username ?? "User"}
                </div>
                <div style={{ fontSize: 11, color: t.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user?.primaryEmailAddress?.emailAddress ?? ""}
                </div>
              </div>
              <Icons.chevron stroke={t.sub} />
            </div>
          </Show>
          <Show when="signed-out">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="exam-nav-btn"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 10,
                    border: "none",
                    background: dark ? "#27272a" : "#d4d4d8",
                    color: t.text,
                    fontSize: 13.5,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="exam-nav-btn"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 10,
                    border: `1.5px solid ${t.border}`,
                    background: "transparent",
                    color: t.text,
                    fontSize: 13.5,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Sign up
                </button>
              </SignUpButton>
            </div>
          </Show>
        </div>
      </div>
    </>
  );
}

export const EXAM_SIDEBAR_WIDTH = SIDEBAR_WIDTH;
