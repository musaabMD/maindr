import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExamMeta } from "@/lib/exam-seo";
import { ReviewTabClient } from "./review-tab-client";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = getExamMeta(slug);
  if (!meta) return { title: "Review | DrNote" };

  return {
    title: `${meta.name} Review — Incorrect Answers & Weak Areas | DrNote`,
    description: `Review your ${meta.name} exam mistakes. Focus on weak areas and improve your score.`,
  };
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params;
  const meta = getExamMeta(slug);
  if (!meta) notFound();

  return <ReviewTabClient slug={slug} meta={meta} />;
}
