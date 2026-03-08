import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExamMeta } from "@/lib/exam-seo";
import { QuestionsTabClient } from "./questions-tab-client";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = getExamMeta(slug);
  if (!meta) return { title: "New Questions | DrNote" };

  return {
    title: `${meta.name} New Questions — Recall feed | DrNote`,
    description: `Recent recall questions for ${meta.name}. Browse by date.`,
  };
}

export default async function QuestionsPage({ params }: Props) {
  const { slug } = await params;
  const meta = getExamMeta(slug);
  if (!meta) notFound();

  return <QuestionsTabClient slug={slug} meta={meta} />;
}
