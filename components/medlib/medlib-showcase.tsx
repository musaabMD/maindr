"use client";

import { Badge } from "./tokens-and-primitives";
import {
  QuestionCardShowcase,
  TestBuilderShowcase,
  PerformanceDashboardShowcase,
  QuestionNavigatorShowcase,
  SpacedRepetitionQueueShowcase,
  ScoreReportShowcase,
  StudyPlanShowcase,
  NotesPanelShowcase,
  LeaderboardShowcase,
  SearchFilterBarShowcase,
  QuestionReviewListShowcase,
  ProfileSettingsShowcase,
} from "./showcase-components";

const COMPONENTS = [
  {
    key: "question-card",
    label: "1. Question Card",
    priority: "FULL SCREEN",
    comp: QuestionCardShowcase,
  },
  {
    key: "test-builder",
    label: "2. Test Builder",
    priority: "FULL SCREEN",
    comp: TestBuilderShowcase,
  },
  {
    key: "performance",
    label: "3. Performance Dashboard",
    priority: "FULL SCREEN",
    comp: PerformanceDashboardShowcase,
  },
  {
    key: "navigator",
    label: "4. Question Navigator",
    priority: "PANEL",
    comp: QuestionNavigatorShowcase,
  },
  {
    key: "spaced-rep",
    label: "5. Spaced Repetition Queue",
    priority: "FULL SCREEN",
    comp: SpacedRepetitionQueueShowcase,
  },
  {
    key: "score-report",
    label: "6. Score Report",
    priority: "FULL SCREEN",
    comp: ScoreReportShowcase,
  },
  {
    key: "study-plan",
    label: "7. Study Plan Timeline",
    priority: "PANEL",
    comp: StudyPlanShowcase,
  },
  {
    key: "notes",
    label: "8. Notes Panel",
    priority: "PANEL / MODAL",
    comp: NotesPanelShowcase,
  },
  {
    key: "leaderboard",
    label: "9. Peer Leaderboard",
    priority: "SIDEBAR",
    comp: LeaderboardShowcase,
  },
  {
    key: "search",
    label: "10. Search & Filter Bar",
    priority: "PERSISTENT",
    comp: SearchFilterBarShowcase,
  },
  {
    key: "review-list",
    label: "11. Question Review List",
    priority: "FULL SCREEN",
    comp: QuestionReviewListShowcase,
  },
  {
    key: "profile",
    label: "12. Profile & Settings",
    priority: "MODAL / PAGE",
    comp: ProfileSettingsShowcase,
  },
];

const C = {
  primary: "#1A56DB",
  slate100: "#F1F5F9",
  slate200: "#E2E8F0",
  slate400: "#94A3B8",
  slate600: "#475569",
  slate800: "#1E293B",
  green: "#0E9F6E",
  yellow: "#D97706",
  red: "#E02424",
  slate500: "#64748B",
};

export function MedLibShowcase() {
  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: C.slate100,
        minHeight: "100vh",
        padding: "32px 0",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } button { font-family: inherit; }`}</style>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 28px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: C.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            M
          </div>
          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 26,
                fontWeight: 700,
                color: C.slate800,
                letterSpacing: -0.5,
              }}
            >
              MedLib Test Engine
            </h1>
            <p style={{ fontSize: 13, color: C.slate400 }}>
              UI Component Showcase · shadcn collaboration · white theme
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Full Screen", "Panel", "Sidebar", "Modal / Page", "Persistent"].map(
            (t) => (
              <Badge
                key={t}
                color={
                  t === "Full Screen"
                    ? "blue"
                    : t === "Panel"
                      ? "green"
                      : t === "Sidebar"
                        ? "yellow"
                        : "slate"
                }
              >
                {t}
              </Badge>
            )
          )}
        </div>
      </div>
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {COMPONENTS.map(({ key, label, priority, comp: Comp }) => (
          <div key={key}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.slate600,
                }}
              >
                {label}
              </span>
              <span
                style={{
                  background: C.slate800,
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 9px",
                  borderRadius: 99,
                  letterSpacing: 0.8,
                }}
              >
                {priority}
              </span>
            </div>
            <Comp />
          </div>
        ))}
      </div>
      <p
        style={{
          textAlign: "center",
          marginTop: 48,
          fontSize: 12,
          color: C.slate400,
        }}
      >
        MedLib · Test Prep Engine · 12 Components
      </p>
    </div>
  );
}
