"use client";

import { useParams } from "next/navigation";
import { ExamHeader } from "@/components/exams/exam-header";
import { useTheme } from "@/components/exams/theme";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getExamMeta } from "@/lib/exam-seo";
import { ExamLayoutProvider, useExamLayout } from "@/components/exams/exam-layout-context";

function ExamLayoutInner({ children }: { children: React.ReactNode }) {
  const { dark, setDark } = useExamLayout();
  const params = useParams();
  const slug = params.slug as string;
  const exam = useQuery(api.exams.getBySlug, { slug });
  const meta = getExamMeta(slug);
  const t = useTheme(dark);
  const examName = exam?.name ?? meta?.name ?? slug;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 pb-20 md:pb-0 ${dark ? "dark" : ""}`}
      style={{
        background: t.bg,
        color: t.text,
        fontFamily: "var(--font-bricolage)",
      }}
    >
      <ExamHeader
        dark={dark}
        setDark={setDark}
        examSlug={slug}
        examName={examName}
      />
      {children}
    </div>
  );
}

export default function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ExamLayoutProvider>
      <ExamLayoutInner>{children}</ExamLayoutInner>
    </ExamLayoutProvider>
  );
}
