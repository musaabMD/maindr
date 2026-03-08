import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExamMeta } from "@/lib/exam-seo";
import { SelfAssessmentsTabClient } from "./self-assessments-tab-client";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = getExamMeta(slug);
  if (!meta) return { title: "Exams | DrNote" };

  return {
    title: `${meta.name} Exams — Practice Tests | DrNote`,
    description: `Take exams for ${meta.name}. Practice tests and timed quizzes.`,
  };
}

export default async function SelfAssessmentsPage({ params }: Props) {
  const { slug } = await params;
  const meta = getExamMeta(slug);
  if (!meta) notFound();

  return <SelfAssessmentsTabClient slug={slug} meta={meta} />;
}
