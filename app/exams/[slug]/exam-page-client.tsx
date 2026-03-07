"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useExamLayout } from "@/components/exams/exam-layout-context";
import { TiltedArt } from "@/components/exams/tilted-art";
import { StudyQuote } from "@/components/exams/study-quote";
import { Card, CardContent } from "@/components/ui/card";

type ExamMeta = {
  name: string;
  description: string;
  subjects: string[];
  tags: string[];
  passRate: number;
  duration: string;
  difficulty: string;
  questions: number;
};

interface ExamPageClientProps {
  slug: string;
  meta: ExamMeta;
}

export function ExamPageClient({ slug, meta }: ExamPageClientProps) {
  const exam = useQuery(api.exams.getBySlug, { slug });
  const color = exam?.color ?? "var(--primary)";

  return (
    <main className="mx-auto max-w-[900px] px-6 py-12">
      <article>
        <header className="mb-10">
          <div
            className="relative flex flex-col justify-end overflow-hidden rounded-2xl p-8 min-h-[200px] mb-8"
            style={{ background: color }}
          >
            <h1
              className="relative z-10 text-white font-bold tracking-tight drop-shadow-sm"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(36px, 5vw, 52px)",
                letterSpacing: "0.06em",
                lineHeight: 1.1,
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              {meta.name}
            </h1>
            <TiltedArt name={meta.name} />
          </div>

          <p className="text-lg mb-6 text-muted-foreground leading-relaxed">
            {meta.description}
          </p>

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Questions", value: meta.questions },
              { label: "Duration", value: meta.duration },
              { label: "Pass Rate", value: `${meta.passRate}%` },
              { label: "Difficulty", value: meta.difficulty },
            ].map(({ label, value }) => (
              <Card key={label} className="border-primary/20 bg-card">
                <CardContent className="pt-4">
                  <dt className="text-xs font-medium uppercase tracking-wider mb-1 text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="font-semibold text-foreground">{value}</dd>
                </CardContent>
              </Card>
            ))}
          </dl>

          <div className="flex flex-wrap gap-2 mb-8">
            {meta.subjects.map((s) => (
              <span
                key={s}
                className="rounded-full px-3 py-1 text-sm font-medium bg-primary/15 text-primary border border-primary/25"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mb-10">
            <StudyQuote />
          </div>
        </header>
      </article>
    </main>
  );
}
