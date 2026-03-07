import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExamMeta } from "@/lib/exam-seo";
import { StudyTabClient } from "./study-tab-client";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = getExamMeta(slug);
  if (!meta) return { title: "Study | DrNote" };

  return {
    title: `${meta.name} Study — Practice Questions | DrNote`,
    description: `Study for ${meta.name} with practice questions. ${meta.questions} questions across ${meta.subjects.join(", ")}.`,
  };
}

export default async function StudyPage({ params }: Props) {
  const { slug } = await params;
  const meta = getExamMeta(slug);
  if (!meta) notFound();

  return <StudyTabClient slug={slug} meta={meta} />;
}
