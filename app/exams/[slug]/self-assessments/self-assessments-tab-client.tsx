"use client";

import { ExamTabHeader } from "@/components/exams/exam-tab-header";

interface SelfAssessmentsTabClientProps {
  slug: string;
  meta: { name: string };
}

export function SelfAssessmentsTabClient({ slug, meta }: SelfAssessmentsTabClientProps) {
  return (
    <div className="min-h-screen bg-[#F8F8F7] pb-24">
      <ExamTabHeader
        title={`Self Assessments — ${meta.name}`}
        subtitle="Practice tests and timed self assessments. Coming soon."
      />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10" />
    </div>
  );
}
