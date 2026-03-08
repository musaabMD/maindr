"use client";

type PerformanceTier = "strong" | "average" | "needs-work";

function getPerformanceTier(percentage: number): PerformanceTier {
  if (percentage >= 80) return "strong";
  if (percentage >= 70) return "average";
  return "needs-work";
}

const TIER_STYLES: Record<PerformanceTier, { dot: string; bar: string }> = {
  strong: { dot: "bg-emerald-500", bar: "bg-emerald-500" },
  average: { dot: "bg-amber-500", bar: "bg-amber-500" },
  "needs-work": { dot: "bg-red-500", bar: "bg-red-500" },
};

interface SubjectScoreRowProps {
  section: string;
  correct: number;
  total: number;
  blueprintPercentage?: number;
}

export function SubjectScoreRow({
  section,
  correct,
  total,
}: SubjectScoreRowProps) {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const tier = getPerformanceTier(percentage);
  const { dot, bar } = TIER_STYLES[tier];

  return (
    <li className="flex items-center gap-4">
      <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
      <span className="min-w-[7rem] text-sm font-medium text-warm-900">
        {section}
      </span>
      <div className="min-w-0 flex-1">
        <div className="h-2 overflow-hidden rounded-full bg-warm-100">
          <div
            className={`h-full rounded-full ${bar} transition-all`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="min-w-[2.5rem] text-right text-sm font-semibold tabular-nums text-warm-900">
          {percentage}%
        </span>
        <span className="text-sm text-warm-500 tabular-nums">
          {correct}/{total}
        </span>
      </div>
    </li>
  );
}
