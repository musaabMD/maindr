"use client";

import { Button } from "@/components/ui/button";
import { SubjectScoreRow } from "./subject-score-row";
import type { BlueprintItem } from "./blueprint-section";

const DEFAULT_BLUEPRINT: BlueprintItem[] = [
  { section: "Family Medicine", percentage: 19 },
  { section: "Internal Medicine", percentage: 11 },
  { section: "Pediatric", percentage: 10 },
  { section: "Obstetrics and Gynecology", percentage: 10 },
  { section: "General Surgery", percentage: 6 },
  { section: "Psychiatry", percentage: 9 },
  { section: "Emergency Medicine (Adult and Pediatric)", percentage: 10 },
  { section: "Dermatology", percentage: 5 },
  { section: "Orthopedic and Musculoskeletal", percentage: 5 },
  { section: "Ophthalmology", percentage: 5 },
  { section: "Otolaryngology", percentage: 5 },
  { section: "Radiology", percentage: 5 },
];

const DEFAULT_SUBJECT_SCORES: Record<string, { correct: number; total: number }> = {
  "Family Medicine": { correct: 3, total: 8 },
  "Internal Medicine": { correct: 2, total: 5 },
  Pediatric: { correct: 1, total: 4 },
  "Obstetrics and Gynecology": { correct: 2, total: 4 },
  "General Surgery": { correct: 1, total: 3 },
  Psychiatry: { correct: 2, total: 4 },
  "Emergency Medicine (Adult and Pediatric)": { correct: 3, total: 5 },
  Dermatology: { correct: 1, total: 2 },
  "Orthopedic and Musculoskeletal": { correct: 0, total: 2 },
  Ophthalmology: { correct: 1, total: 2 },
  Otolaryngology: { correct: 0, total: 2 },
  Radiology: { correct: 1, total: 2 },
};

interface ExamResultsProps {
  overallScore?: number;
  subjectScores?: Record<string, { correct: number; total: number }>;
  onReturnToMenu?: () => void;
  blueprint?: BlueprintItem[];
}

export function ExamResults({
  overallScore = 40,
  subjectScores,
  onReturnToMenu,
  blueprint = DEFAULT_BLUEPRINT,
}: ExamResultsProps) {
  const scores = subjectScores ?? DEFAULT_SUBJECT_SCORES;

  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="bg-primary text-primary-foreground p-4 shrink-0">
        <div className="container mx-auto flex items-center">
          <div className="bg-primary-foreground text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold text-xl mr-2 shrink-0">
            D
          </div>
          <h1 className="text-xl font-bold">DrNote</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-2xl border border-warm-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-base font-semibold text-warm-900 mb-1">Exam Results</h2>
            <div className="text-4xl sm:text-5xl font-bold text-primary mb-1">
              {overallScore}%
            </div>
            <p className="text-sm text-warm-500">Overall Score</p>
            <p className="text-xs text-warm-400 mt-2 italic">
              Note: This score is just for demo purposes.
            </p>
          </div>

          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-semibold text-warm-900">Subject Breakdown</h3>
            <span className="text-sm font-medium text-warm-500">Accuracy</span>
          </div>

          <ul className="space-y-4 mb-6">
            {blueprint.map((subject) => {
              const result = scores[subject.section];
              const correct = result?.correct ?? 0;
              const total = result?.total ?? 0;
              return (
                <SubjectScoreRow
                  key={subject.section}
                  section={subject.section}
                  correct={correct}
                  total={total}
                  blueprintPercentage={subject.percentage}
                />
              );
            })}
          </ul>

          <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-warm-100 pt-4">
            <span className="flex items-center gap-2 text-sm text-warm-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Strong ≥80%
            </span>
            <span className="flex items-center gap-2 text-sm text-warm-600">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Average 70–79%
            </span>
            <span className="flex items-center gap-2 text-sm text-warm-600">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Needs work &lt;70%
            </span>
          </div>

          <div className="flex justify-center">
            <Button onClick={onReturnToMenu}>Return to Main Menu</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
