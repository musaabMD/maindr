"use client";

import { useUser } from "@clerk/nextjs";
import { StudyQuote } from "@/components/exams/study-quote";
import { QuizModes } from "@/components/exams/quiz-modes";
import { Card, CardContent } from "@/components/ui/card";
import { getShortGreeting } from "@/lib/utils";

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
  const { user } = useUser();
  const userName = user?.firstName ?? user?.username ?? "there";

  return (
    <main className="mx-auto max-w-[900px] px-6 py-12">
      <article>
        <header className="mb-10">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {getShortGreeting()}, {userName}!
          </h1>

          <StudyQuote inline />

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

          <QuizModes slug={slug} meta={meta} />
        </header>
      </article>
    </main>
  );
}
