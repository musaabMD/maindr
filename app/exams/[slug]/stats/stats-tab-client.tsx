"use client";

import { ExamTabHeader } from "@/components/exams/exam-tab-header";

interface StatsTabClientProps {
  slug: string;
  meta: { name: string };
}

export function StatsTabClient({ slug, meta }: StatsTabClientProps) {
  return (
    <div className="min-h-screen bg-[#F8F8F7] pb-24">
      <ExamTabHeader
        title={`Stats — ${meta.name}`}
        subtitle="Track your progress and performance. Coming soon."
      />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10" />
    </div>
  );
}
