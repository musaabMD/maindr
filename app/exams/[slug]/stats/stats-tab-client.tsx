"use client";

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
  { dot: string; bar: string }
> = {
  strong: { dot: "bg-emerald-500", bar: "bg-emerald-500" },
  average: { dot: "bg-amber-500", bar: "bg-amber-500" },
  "needs-work": { dot: "bg-red-500", bar: "bg-red-500" },
};

interface StatsTabClientProps {
  slug: string;
  meta: { name: string; subjects: string[]; passRate: number };
}

// Mock scores per subject - replace with Convex/API when backend is ready
// Uses varied percentages to demo all performance tiers
function getMockScoresBySubject(subjects: string[], _passRate: number): SubjectScore[] {
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

export function StatsTabClient({ slug, meta }: StatsTabClientProps) {
  const subjectScores = getMockScoresBySubject(meta.subjects, meta.passRate);

  return (
    <div className="min-h-screen bg-white pb-24">
      <main className="mx-auto max-w-3xl px-3 py-6 sm:px-6 sm:py-10">
        <section className="rounded-2xl border border-warm-200 bg-white p-4 shadow-sm sm:p-6">
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
                <li key={subject} className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-4">
                  <div className={`order-1 h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
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
            <span className="flex items-center gap-2 text-sm text-warm-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Strong ≥80%
            </span>
            <span className="flex items-center gap-2 text-sm text-warm-600">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Average 70–79%
            </span>
            <span className="flex items-center gap-2 text-sm text-warm-600">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Needs work &lt;70%
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
