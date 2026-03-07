import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EXAM_SLUGS, getExamMeta } from "@/lib/exam-seo";
import { ExamPageClient } from "./exam-page-client";

type Props = {
  params: Promise<{ slug: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://drnote.co";

export async function generateStaticParams() {
  return EXAM_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = getExamMeta(slug);
  if (!meta) return { title: "Exam | DrNote" };

  const title = `${meta.name} Exam Prep — Study, Practice & Review | DrNote`;
  const description = `${meta.description} Prepare with ${meta.questions} practice questions. Pass rate: ${meta.passRate}%. Duration: ${meta.duration}. Subjects: ${meta.subjects.join(", ")}.`;
  const url = `${BASE_URL}/exams/${slug}`;

  return {
    title,
    description,
    keywords: [
      meta.name,
      ...meta.tags,
      ...meta.subjects,
      "exam prep",
      "practice questions",
      "Saudi Arabia",
      "medical exam",
      "test prep",
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: "DrNote",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ExamPage({ params }: Props) {
  const { slug } = await params;
  const meta = getExamMeta(slug);
  if (!meta) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${meta.name} Exam Prep`,
    description: meta.description,
    provider: {
      "@type": "Organization",
      name: "DrNote",
      url: BASE_URL,
    },
    educationalLevel: meta.difficulty,
    timeRequired: meta.duration,
    keywords: [...meta.tags, ...meta.subjects].join(", "),
    url: `${BASE_URL}/exams/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ExamPageClient slug={slug} meta={meta} />
    </>
  );
}
