"use client";

import { useMemo } from "react";
import {
  BarChart3,
  Target,
  BookOpen,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  X,
  Minus,
} from "lucide-react";

interface SubjectScore {
  subject: string;
  score: number;
  total: number;
  percentage: number;
}

type PerformanceTier = "strong" | "average" | "needs-work";

function getPerformanceTier(percentage: number): PerformanceTier {
  if (percentage >= 80) return "strong";
  if (percentage >= 70) return "average";
  return "needs-work";
}

const TIER_STYLES: Record<
  PerformanceTier,
  { dot: string; bar: string; label: string }
> = {
  strong: { dot: "bg-emerald-500", bar: "bg-emerald-500", label: "Strong ≥80%" },
  average: {
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    label: "Average 70–79%",
  },
  "needs-work": {
    dot: "bg-red-500",
    bar: "bg-red-500",
    label: "Needs work <70%",
  },
};

// Topic-level row for table (subject, system, category, topic, % correct others, time, status)
interface TopicRow {
  id: string;
  subject: string;
  system: string;
  category: string;
  topic: string;
  pctCorrectOthers: number;
  timeSpentSec: number;
  status: "correct" | "incorrect" | "skipped";
}

const MOCK_TOPIC_ROWS: TopicRow[] = [
  { id: "1-610", subject: "Pathophysiology", system: "Endocrine, Diabetes & Metabolism", category: "Congenital and developmental an...", topic: "Congenital adrenal hyperplasia", pctCorrectOthers: 66, timeSpentSec: 23, status: "incorrect" },
  { id: "2-8334", subject: "Immunology", system: "Hematology & Oncology", category: "Red blood cell disorders", topic: "Sideroblastic anemia", pctCorrectOthers: 54, timeSpentSec: 2, status: "incorrect" },
  { id: "3-112", subject: "Pathology", system: "Dermatology", category: "Skin tumors and tumor-like lesions", topic: "Lichen planus", pctCorrectOthers: 60, timeSpentSec: 1, status: "skipped" },
  { id: "4-445", subject: "Biochemistry", system: "Cardiovascular System", category: "Congenital and developmental an...", topic: "Anaphylaxis", pctCorrectOthers: 70, timeSpentSec: 0, status: "incorrect" },
  { id: "5-221", subject: "Pathology", system: "Male Reproductive System", category: "Disorders of the male reproductive system", topic: "Benign prostatic hyperplasia", pctCorrectOthers: 58, timeSpentSec: 15, status: "skipped" },
  { id: "6-889", subject: "Immunology", system: "Dermatology", category: "Inflammatory skin conditions", topic: "Atopic dermatitis", pctCorrectOthers: 62, timeSpentSec: 8, status: "incorrect" },
  { id: "7-334", subject: "Pathophysiology", system: "Endocrine, Diabetes & Metabolism", category: "Thyroid disorders", topic: "Hypothyroidism", pctCorrectOthers: 72, timeSpentSec: 45, status: "correct" },
];

interface StatsTabClientProps {
  slug: string;
  meta: { name: string; subjects: string[]; passRate: number };
}

// Mock scores per subject - replace with Convex/API when backend is ready
function getMockScoresBySubject(
  subjects: string[],
  _passRate: number
): SubjectScore[] {
  const demoPercentages = [82, 74, 68, 89, 71, 85, 63, 77, 66, 72];
  return subjects.map((subject, i) => {
    const percentage = demoPercentages[i % demoPercentages.length];
    const total = 80 + (i % 4) * 6;
    const score = Math.round((percentage / 100) * total);
    return {
      subject,
      score: Math.min(score, total),
      total,
      percentage,
    };
  });
}

// Mock activity for last 7 days (questions per day)
const MOCK_ACTIVITY = [12, 28, 0, 45, 33, 19, 8];

const MOCK_AVG_SCORE = 64;
const MOCK_TOTAL_QUESTIONS = 3390;
const MOCK_ANSWER_CHANGES = { correctToIncorrect: 0, incorrectToCorrect: 2, incorrectToIncorrect: 0 };
const MOCK_TEST_COUNTS = { created: 2, completed: 2, suspended: 0 };
const MOCK_PERCENTILE = 84;
const MOCK_MEDIAN_PERCENTILE = 49;
const MOCK_YOUR_AVG_TIME_SEC = 52;
const MOCK_OTHERS_AVG_TIME_SEC = 73;

export function StatsTabClient({ slug, meta }: StatsTabClientProps) {
  const subjectScores = getMockScoresBySubject(meta.subjects, meta.passRate);

  const { totalAnswered, totalCorrect, overallPct, strongCount, needsWorkCount } = useMemo(
    () => {
      const totalAnswered = subjectScores.reduce((s, x) => s + x.total, 0);
      const totalCorrect = subjectScores.reduce((s, x) => s + x.score, 0);
      const overallPct =
        totalAnswered > 0
          ? Math.round((totalCorrect / totalAnswered) * 100)
          : 0;
      let strongCount = 0;
      let needsWorkCount = 0;
      subjectScores.forEach((s) => {
        const tier = getPerformanceTier(s.percentage);
        if (tier === "strong") strongCount++;
        if (tier === "needs-work") needsWorkCount++;
      });
      return { totalAnswered, totalCorrect, overallPct, strongCount, needsWorkCount };
    },
    [subjectScores]
  );

  const totalIncorrect = Math.max(0, Math.floor(totalAnswered * 0.15));
  const totalOmitted = Math.max(0, totalAnswered - totalCorrect - totalIncorrect);
  const correctPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const qbankUsedPct = MOCK_TOTAL_QUESTIONS > 0 ? Math.round((totalAnswered / MOCK_TOTAL_QUESTIONS) * 100) : 0;
  const unusedQuestions = Math.max(0, MOCK_TOTAL_QUESTIONS - totalAnswered);

  const abovePassRate = overallPct >= meta.passRate;
  const weakestSubject = useMemo(() => {
    if (subjectScores.length === 0) return null;
    return subjectScores.reduce((a, b) =>
      a.percentage <= b.percentage ? a : b
    );
  }, [subjectScores]);
  const strongestSubject = useMemo(() => {
    if (subjectScores.length === 0) return null;
    return subjectScores.reduce((a, b) =>
      a.percentage >= b.percentage ? a : b
    );
  }, [subjectScores]);
  const maxActivity = Math.max(...MOCK_ACTIVITY, 1);

  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="mx-auto max-w-3xl px-3 py-4 sm:px-6 sm:py-10">
        {/* Your Score vs Average — progress bar with avg indicator */}
        <section className="rounded-2xl border border-warm-200 bg-card p-4 shadow-sm sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-warm-500 mb-1">
            Your Score
          </h2>
          <p className="text-2xl sm:text-3xl font-bold tabular-nums text-emerald-600 mb-2">
            {overallPct}%
          </p>
          <div className="relative pt-1 pb-8">
            <div className="h-3 sm:h-4 w-full overflow-hidden rounded-full bg-warm-100 shadow-inner">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(overallPct, 100)}%` }}
              />
            </div>
            {/* Avg indicator */}
            <div
              className="absolute top-0 bottom-0 flex flex-col items-center"
              style={{ left: `${Math.min(MOCK_AVG_SCORE, 99)}%`, transform: "translateX(-50%)" }}
            >
              <div className="w-px flex-1 min-h-[12px] bg-warm-300" />
              <div className="mt-1 px-2 py-1 rounded-md bg-warm-100 border border-warm-200 shadow-sm whitespace-nowrap">
                <span className="text-xs font-medium text-warm-600">Avg: {MOCK_AVG_SCORE}%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Overview stat cards */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="rounded-2xl border border-warm-200 bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-warm-500 mb-1">
              <BookOpen className="h-4 w-4" strokeWidth={2} />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Questions
              </span>
            </div>
            <p className="text-2xl font-bold tabular-nums text-warm-900">
              {totalAnswered}
            </p>
            <p className="text-sm text-warm-500 mt-0.5">answered total</p>
          </div>
          <div className="rounded-2xl border border-warm-200 bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-warm-500 mb-1">
              <Target className="h-4 w-4" strokeWidth={2} />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Accuracy
              </span>
            </div>
            <p className="text-2xl font-bold tabular-nums text-warm-900">
              {overallPct}%
            </p>
            <p className="text-sm text-warm-500 mt-0.5">overall</p>
          </div>
          <div className="rounded-2xl border border-warm-200 bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-warm-500 mb-1">
              <TrendingUp className="h-4 w-4" strokeWidth={2} />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Pass rate
              </span>
            </div>
            <p
              className={`text-2xl font-bold tabular-nums ${
                abovePassRate ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {meta.passRate}%
            </p>
            <p className="text-sm text-warm-500 mt-0.5">
              {abovePassRate ? "You’re above threshold" : "Keep practicing"}
            </p>
          </div>
          <div className="rounded-2xl border border-warm-200 bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-warm-500 mb-1">
              <BarChart3 className="h-4 w-4" strokeWidth={2} />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Strong areas
              </span>
            </div>
            <p className="text-2xl font-bold tabular-nums text-warm-900">
              {strongCount}/{subjectScores.length}
            </p>
            <p className="text-sm text-warm-500 mt-0.5">subjects ≥80%</p>
          </div>
        </section>

        {/* Score breakdown donut + Answer changes + QBank usage + Test count */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Your Score donut — correct (green) / incorrect+omitted (pink) */}
          <div className="rounded-2xl border border-warm-200 bg-card p-4 shadow-sm sm:p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-warm-500 mb-3">
              Score breakdown
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative shrink-0">
                <svg width="100" height="100" viewBox="0 0 100 100" className="rotate-[-90deg]">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(229 231 235)" strokeWidth="12" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="rgb(16 185 129)"
                    strokeWidth="12"
                    strokeDasharray={`${correctPct * 2.64} 264`}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="rgb(253 164 175)"
                    strokeWidth="12"
                    strokeDasharray={`${(100 - correctPct) * 2.64} 264`}
                    strokeDashoffset={-correctPct * 2.64}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-warm-900">
                  {correctPct}%
                </span>
              </div>
              <div className="text-sm space-y-1">
                <p className="font-medium text-warm-900">Total Correct: {totalCorrect}</p>
                <p className="text-warm-600">Total Incorrect: {totalIncorrect}</p>
                <p className="text-warm-600">Total Omitted: {totalOmitted}</p>
              </div>
            </div>
          </div>

          {/* Answer changes */}
          <div className="rounded-2xl border border-warm-200 bg-card p-4 shadow-sm sm:p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-warm-500 mb-3">
              Answer changes
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-warm-700">Correct → Incorrect: <span className="font-semibold tabular-nums">{MOCK_ANSWER_CHANGES.correctToIncorrect}</span></p>
              <p className="text-warm-700">Incorrect → Correct: <span className="font-semibold tabular-nums text-emerald-600">{MOCK_ANSWER_CHANGES.incorrectToCorrect}</span></p>
              <p className="text-warm-700">Incorrect → Incorrect: <span className="font-semibold tabular-nums">{MOCK_ANSWER_CHANGES.incorrectToIncorrect}</span></p>
            </div>
          </div>

          {/* QBank usage donut */}
          <div className="rounded-2xl border border-warm-200 bg-card p-4 shadow-sm sm:p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-warm-500 mb-3">
              QBank usage
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative shrink-0">
                <svg width="100" height="100" viewBox="0 0 100 100" className="rotate-[-90deg]">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(229 231 235)" strokeWidth="12" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="rgb(59 130 246)"
                    strokeWidth="12"
                    strokeDasharray={`${Math.min(qbankUsedPct, 100) * 2.64} 264`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-warm-900">
                  {qbankUsedPct}%
                </span>
              </div>
              <div className="text-sm space-y-1">
                <p className="font-medium text-warm-900">Used: {totalAnswered}</p>
                <p className="text-warm-600">Unused: {unusedQuestions}</p>
                <p className="text-warm-600">Total: {MOCK_TOTAL_QUESTIONS}</p>
              </div>
            </div>
          </div>

          {/* Test count */}
          <div className="rounded-2xl border border-warm-200 bg-card p-4 shadow-sm sm:p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-warm-500 mb-3">
              Tests
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-warm-700">Tests Created: <span className="font-semibold tabular-nums">{MOCK_TEST_COUNTS.created}</span></p>
              <p className="text-warm-700">Tests Completed: <span className="font-semibold tabular-nums text-emerald-600">{MOCK_TEST_COUNTS.completed}</span></p>
              <p className="text-warm-700">Suspended: <span className="font-semibold tabular-nums">{MOCK_TEST_COUNTS.suspended}</span></p>
            </div>
          </div>
        </section>

        {/* Performance distribution — bell curve + percentile summary */}
        <section className="rounded-2xl border border-warm-200 bg-card p-4 shadow-sm sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-base font-semibold text-warm-900 mb-4">
            Performance distribution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-32 sm:h-40">
              {/* Simplified bell curve (SVG path) */}
              <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="curveFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgb(229 231 235)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="rgb(229 231 235)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 80 Q 50 80 100 20 T 200 80 L 200 80 L 0 80 Z"
                  fill="url(#curveFill)"
                />
                <path
                  d="M 0 80 Q 50 80 100 20 T 200 80"
                  fill="none"
                  stroke="rgb(209 213 219)"
                  strokeWidth="1.5"
                />
                {/* Median line (49th) */}
                <line x1="98" y1="80" x2="98" y2="22" stroke="rgb(96 165 250)" strokeWidth="1.5" strokeDasharray="2 2" />
                <circle cx="98" cy="22" r="3" fill="rgb(96 165 250)" />
                <text x="98" y="78" textAnchor="middle" className="text-[10px] fill-warm-500" style={{ fontSize: "10px" }}>49th</text>
                {/* Your percentile (84th) */}
                <line x1="168" y1="80" x2="168" y2="45" stroke="rgb(16 185 129)" strokeWidth="1.5" />
                <circle cx="168" cy="45" r="4" fill="rgb(16 185 129)" />
                <text x="168" y="78" textAnchor="middle" className="text-[10px] fill-warm-500" style={{ fontSize: "10px" }}>84th</text>
              </svg>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-warm-700">Your Score ({MOCK_PERCENTILE}th rank): <span className="font-semibold text-emerald-600">{overallPct}%</span></span>
              </p>
              <p className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0" />
                <span className="text-warm-700">Median Score ({MOCK_MEDIAN_PERCENTILE}th rank): <span className="font-semibold">63%</span></span>
              </p>
              <p className="text-warm-600">Your average time spent: <span className="font-semibold tabular-nums">{MOCK_YOUR_AVG_TIME_SEC} sec</span></p>
              <p className="text-warm-600">Others' average time spent: <span className="font-semibold tabular-nums">{MOCK_OTHERS_AVG_TIME_SEC} sec</span></p>
            </div>
          </div>
        </section>

        {/* Topic performance table */}
        <section className="rounded-2xl border border-warm-200 bg-card shadow-sm overflow-hidden mb-6 sm:mb-8">
          <div className="px-4 py-3 sm:px-6 border-b border-warm-100">
            <h2 className="text-base font-semibold text-warm-900">
              Topic performance
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-warm-500 bg-warm-50/80">
                  <th className="w-8 py-3 pl-4 pr-2" />
                  <th className="py-3 px-2">ID</th>
                  <th className="py-3 px-2 min-w-[100px]">Subjects</th>
                  <th className="py-3 px-2 min-w-[120px] hidden sm:table-cell">Systems</th>
                  <th className="py-3 px-2 min-w-[140px] hidden md:table-cell">Categories</th>
                  <th className="py-3 px-2 min-w-[120px]">Topics</th>
                  <th className="py-3 px-2 text-right whitespace-nowrap">% correct others</th>
                  <th className="py-3 px-2 text-right whitespace-nowrap">Time spent</th>
                  <th className="w-8 py-3 pr-4 pl-2" />
                </tr>
              </thead>
              <tbody>
                {MOCK_TOPIC_ROWS.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-warm-100 hover:bg-warm-50/50 transition-colors cursor-pointer"
                  >
                    <td className="py-2.5 pl-4 pr-2">
                      {row.status === "correct" && (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </span>
                      )}
                      {row.status === "incorrect" && (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600">
                          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </span>
                      )}
                      {row.status === "skipped" && (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 font-medium text-warm-700 tabular-nums">{row.id}</td>
                    <td className="py-2.5 px-2 text-warm-900">{row.subject}</td>
                    <td className="py-2.5 px-2 text-warm-700 hidden sm:table-cell truncate max-w-[140px]">{row.system}</td>
                    <td className="py-2.5 px-2 text-warm-600 hidden md:table-cell truncate max-w-[160px]">{row.category}</td>
                    <td className="py-2.5 px-2 text-warm-900">{row.topic}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums text-warm-700">{row.pctCorrectOthers}%</td>
                    <td className="py-2.5 px-2 text-right tabular-nums text-warm-600">{row.timeSpentSec} sec</td>
                    <td className="py-2.5 pr-4 pl-2">
                      <ChevronRight className="h-4 w-4 text-warm-400" strokeWidth={2} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Performance by Subject */}
        <section className="rounded-2xl border border-warm-200 bg-card p-4 shadow-sm sm:p-6 mb-6 sm:mb-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-warm-900">
              Performance by Subject
            </h2>
            <span className="text-sm font-medium text-warm-500">Accuracy</span>
          </div>
          <ul className="space-y-4">
            {subjectScores.map(({ subject, total, percentage }) => {
              const tier = getPerformanceTier(percentage);
              const { dot, bar } = TIER_STYLES[tier];
              return (
                <li
                  key={subject}
                  className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-4"
                >
                  <div
                    className={`order-1 h-2.5 w-2.5 shrink-0 rounded-full ${dot}`}
                  />
                  <span className="order-2 min-w-0 flex-1 truncate text-sm font-medium text-warm-900 sm:min-w-[7rem] sm:flex-initial">
                    {subject}
                  </span>
                  <div className="order-4 min-w-0 flex-1 basis-full sm:order-none sm:min-w-[8rem] sm:basis-0">
                    <div className="h-2 overflow-hidden rounded-full bg-warm-100">
                      <div
                        className={`h-full rounded-full ${bar} transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="order-3 ml-auto flex shrink-0 items-center gap-2 whitespace-nowrap sm:order-none sm:ml-0">
                    <span className="text-right text-sm font-semibold tabular-nums text-warm-900">
                      {Math.round(percentage)}%
                    </span>
                    <span className="text-sm text-warm-500 tabular-nums">
                      {total} Qs
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-warm-100 pt-4 sm:gap-x-6 sm:gap-y-1">
            {Object.entries(TIER_STYLES).map(([_, { dot, label }]) => (
              <span
                key={label}
                className="flex items-center gap-2 text-sm text-warm-600"
              >
                <span className={`h-2 w-2 rounded-full ${dot}`} />
                {label}
              </span>
            ))}
          </div>
        </section>

        {/* Study activity — last 7 days */}
        <section className="rounded-2xl border border-warm-200 bg-card p-4 shadow-sm sm:p-6 mb-6 sm:mb-8">
          <div className="mb-4 flex items-center gap-2 text-warm-500">
            <Calendar className="h-4 w-4" strokeWidth={2} />
            <h2 className="text-base font-semibold text-warm-900">
              Activity (last 7 days)
            </h2>
          </div>
          <div className="flex items-end justify-between gap-1 sm:gap-2">
            {MOCK_ACTIVITY.map((count, i) => {
              const heightPct = maxActivity > 0 ? (count / maxActivity) * 100 : 0;
              const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i];
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1.5 min-w-0"
                >
                  <span className="text-xs font-medium text-warm-500 tabular-nums order-1">
                    {count}
                  </span>
                  <div className="w-full h-16 sm:h-20 flex flex-col justify-end order-2">
                    <div
                      className="w-full rounded-t bg-warm-300 transition-all"
                      style={{
                        height: `${Math.max(heightPct, 6)}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-warm-500 truncate w-full text-center order-3">
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-warm-500 mt-3 text-center">
            Questions practiced per day
          </p>
        </section>

        {/* Focus areas & summary */}
        <section className="space-y-4">
          {weakestSubject && needsWorkCount > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm sm:p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-amber-100 p-2 shrink-0">
                  <AlertCircle className="h-4 w-4 text-amber-600" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-warm-900 mb-1">
                    Focus area
                  </h3>
                  <p className="text-sm text-warm-700">
                    <span className="font-medium">{weakestSubject.subject}</span>{" "}
                    is your lowest at {Math.round(weakestSubject.percentage)}%.
                    Try more questions in this subject to improve.
                  </p>
                </div>
              </div>
            </div>
          )}
          {strongestSubject && strongCount > 0 && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm sm:p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-emerald-100 p-2 shrink-0">
                  <CheckCircle2
                    className="h-4 w-4 text-emerald-600"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-warm-900 mb-1">
                    Strongest subject
                  </h3>
                  <p className="text-sm text-warm-700">
                    <span className="font-medium">{strongestSubject.subject}</span>{" "}
                    at {Math.round(strongestSubject.percentage)}% — keep it up.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
