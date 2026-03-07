import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExamMeta } from "@/lib/exam-seo";
import { StatsTabClient } from "./stats-tab-client";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = getExamMeta(slug);
  if (!meta) return { title: "Stats | DrNote" };

  return {
    title: `${meta.name} Stats — Track Your Progress | DrNote`,
    description: `Track your ${meta.name} exam progress. View performance stats and identify weak areas.`,
  };
}

export default async function StatsPage({ params }: Props) {
  const { slug } = await params;
  const meta = getExamMeta(slug);
  if (!meta) notFound();

  return <StatsTabClient slug={slug} meta={meta} />;
}
