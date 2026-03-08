"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ExamProgressBar,
  QuestionCard,
  ExamNavigationFooter,
  ExamFullscreen,
} from "@/components/exams/mock-exam";
import {
  getSelfAssessmentQuestions,
  parseDurationToMinutes,
  type SelfAssessmentQuestion,
} from "@/lib/self-assessment-questions";
import { ClipboardCheck, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamMeta {
  name: string;
  description: string;
  subjects: string[];
  questions: number;
  duration: string;
}

interface SelfAssessmentsTabClientProps {
  slug: string;
  meta: ExamMeta;
}

type Step = "intro" | "expect" | "exam" | "results";

export function SelfAssessmentsTabClient({ slug, meta }: SelfAssessmentsTabClientProps) {
  const [step, setStep] = useState<Step>("intro");
  const [extraTime, setExtraTime] = useState(false);
  const [questions, setQuestions] = useState<SelfAssessmentQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [strikeThroughOptions, setStrikeThroughOptions] = useState<Record<string, string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examStarted, setExamStarted] = useState(false);

  const totalMinutes = parseDurationToMinutes(meta.duration);
  const effectiveMinutes = extraTime ? Math.round(totalMinutes * 1.25) : totalMinutes;

  const startExam = useCallback(() => {
    const qs = getSelfAssessmentQuestions(slug, meta.questions, meta.subjects);
    setQuestions(qs);
    setAnswers({});
    setFlagged(new Set());
    setCurrentIndex(0);
    setTimeRemaining(effectiveMinutes * 60);
    setExamStarted(true);
    setStep("exam");
  }, [slug, meta.questions, meta.subjects, effectiveMinutes]);

  useEffect(() => {
    if (step !== "exam" || !examStarted || timeRemaining <= 0) return;
    const t = setInterval(() => setTimeRemaining((r) => r - 1), 1000);
    return () => clearInterval(t);
  }, [step, examStarted, timeRemaining]);

  useEffect(() => {
    if (step === "exam" && timeRemaining <= 0 && questions.length > 0) {
      setStep("results");
    }
  }, [step, timeRemaining, questions.length]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
    0
  );
  const score = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;

  const handleEndExam = () => {
    setStep("results");
  };

  if (step === "results") {
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto w-full max-w-3xl px-3 py-5 sm:px-6 sm:py-10">
          <div className="rounded-2xl border border-warm-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-warm-900 mb-2">Mock Exam Complete</h2>
            <p className="text-warm-500 text-sm mb-6">
              You answered {answeredCount} of {questions.length} questions.
            </p>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 rounded-xl bg-warm-100 p-4 text-center">
                <div className="text-2xl font-bold tracking-tight text-warm-900">{score}%</div>
                <div className="text-xs text-warm-500">Score</div>
              </div>
              <div className="flex-1 rounded-xl bg-warm-100 p-4 text-center">
                <div className="text-2xl font-bold tracking-tight text-warm-900">
                  {correctCount}/{questions.length}
                </div>
                <div className="text-xs text-warm-500">Correct</div>
              </div>
            </div>
            <button
              onClick={() => {
                setStep("intro");
                setQuestions([]);
                setAnswers({});
              }}
              className="w-full py-3.5 rounded-xl font-medium bg-neutral-800 text-white hover:bg-neutral-700 transition-colors min-h-[48px] active:opacity-80"
            >
              Take Another Mock Exam
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (step === "exam" && questions.length > 0) {
    const q = questions[currentIndex];
    const labels = ["A", "B", "C", "D"];
    const options = q.options.map((text, i) => ({ id: labels[i], text }));
    const selectedAnswer =
      answers[currentIndex] !== undefined
        ? labels[answers[currentIndex]]
        : undefined;

    const toggleFlag = () => {
      const f = new Set(flagged);
      if (f.has(currentIndex)) f.delete(currentIndex);
      else f.add(currentIndex);
      setFlagged(f);
    };

    const toggleStrikeThrough = (optId: string) => {
      setStrikeThroughOptions((prev) => {
        const strikes = prev[q.id] || [];
        if (strikes.includes(optId)) {
          return { ...prev, [q.id]: strikes.filter((id) => id !== optId) };
        }
        return { ...prev, [q.id]: [...strikes, optId] };
      });
    };

    return (
      <ExamFullscreen isActive>
        <div className="h-[100dvh] flex flex-col bg-white overflow-hidden">
          <ExamProgressBar
            examTitle="DrNote Mock Exam"
            currentQuestion={currentIndex + 1}
            totalQuestions={questions.length}
            timeRemaining={formatTime(timeRemaining)}
            onEndExam={handleEndExam}
          />

          {/* Mobile: horizontal question strip */}
          <div className="sm:hidden flex overflow-x-auto border-b border-blue-200 bg-white shrink-0">
            <div className="flex gap-1 p-2 min-w-min">
              {questions.map((_, index) => {
                const isCurrent = currentIndex === index;
                const isAnswered = answers[index] !== undefined;
                const isBookmarked = flagged.has(index);
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      isCurrent ? "bg-blue-500 text-white" : isAnswered ? "bg-gray-200 text-gray-700" : "bg-blue-100 text-blue-600"
                    } ${isBookmarked ? "ring-2 ring-yellow-500 ring-offset-1" : ""}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Sidebar */}
            <aside className="bg-white border-r-2 border-blue-200 w-32 flex-shrink-0 hidden sm:block">
              <div className="p-2 border-b-2 border-blue-200">
                {flagged.size > 0 && (
                  <div className="mb-2">
                    <h3 className="text-xs font-semibold text-blue-700 mb-1">BOOKMARKED</h3>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(flagged).map((idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0 border-blue-500 min-w-6"
                          onClick={() => setCurrentIndex(idx)}
                        >
                          {idx + 1}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="overflow-y-auto h-full">
                <div className="flex flex-col">
                  {questions.map((_, index) => {
                    const isCurrent = currentIndex === index;
                    const isAnswered = answers[index] !== undefined;
                    const isBookmarked = flagged.has(index);
                    return (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className={`rounded-none h-12 flex items-center justify-center ${
                          isCurrent ? "bg-blue-100" : isAnswered ? "bg-gray-100" : ""
                        } ${isBookmarked ? "border-r-4 border-blue-500" : ""}`}
                        onClick={() => setCurrentIndex(index)}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCurrent ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </aside>

            <main className="flex-1 min-h-0 overflow-auto bg-white">
              <div className="w-full px-4 sm:px-6 lg:px-8 bg-white min-h-full shadow-sm">
                <QuestionCard
                  questionNumber={currentIndex + 1}
                  totalQuestions={questions.length}
                  subject={q.subject}
                  questionText={q.question}
                  options={options}
                  selectedAnswer={selectedAnswer}
                  strikeThroughOptions={strikeThroughOptions[q.id] || []}
                  onSelectAnswer={(optId) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [currentIndex]: labels.indexOf(optId),
                    }))
                  }
                  onToggleStrikeThrough={toggleStrikeThrough}
                />
              </div>
            </main>
          </div>

          <ExamNavigationFooter
            currentQuestion={currentIndex + 1}
            totalQuestions={questions.length}
            isFlagged={flagged.has(currentIndex)}
            onToggleFlag={toggleFlag}
            onPrevious={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            onNext={() => {
              if (currentIndex === questions.length - 1) handleEndExam();
              else setCurrentIndex((i) => Math.min(questions.length - 1, i + 1));
            }}
            onSubmit={handleEndExam}
            isFirstQuestion={currentIndex === 0}
            isLastQuestion={currentIndex === questions.length - 1}
          />
        </div>
      </ExamFullscreen>
    );
  }

  if (step === "expect") {
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto w-full max-w-3xl px-3 py-5 sm:px-6 sm:py-10">
          <div className="rounded-2xl border border-warm-200 bg-white p-4 shadow-sm sm:p-6 space-y-5 sm:space-y-6">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-warm-600" />
              <h2 className="text-lg font-semibold text-warm-900">What to Expect</h2>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-warm-800 mb-2">DrNote Interface</h3>
              <p className="text-warm-600 text-sm">
                This mock exam uses the DrNote interface. It is not representative of how the
                official exam interface will appear.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-warm-800 mb-2">Timer</h3>
              <p className="text-warm-600 text-sm">
                The timer cannot be paused. Once you start, the clock runs until you submit or
                time runs out.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => setStep("intro")}
                className="flex-1 py-3.5 sm:py-3 rounded-xl font-medium border border-warm-300 text-warm-700 hover:bg-warm-50 min-h-[48px] active:opacity-80"
              >
                Back
              </button>
              <button
                onClick={startExam}
                className="flex-1 py-3.5 sm:py-3 rounded-xl font-medium bg-neutral-800 text-white hover:bg-neutral-700 min-h-[48px] active:opacity-80"
              >
                Start Exam →
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto w-full max-w-3xl px-3 py-5 sm:px-6 sm:py-10">
        <div className="rounded-2xl border border-warm-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <ClipboardCheck className="w-5 h-5 shrink-0 text-warm-600" />
            <h2 className="text-base sm:text-lg font-semibold text-warm-900">DrNote Mock Exam</h2>
          </div>
          <p className="text-warm-500 text-sm mb-4 sm:mb-6">{meta.name}</p>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="rounded-xl bg-warm-50 border border-warm-200 p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-warm-900">{meta.questions}</div>
              <div className="text-xs text-warm-500 mt-0.5">Questions</div>
            </div>
            <div className="rounded-xl bg-warm-50 border border-warm-200 p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-warm-900">{meta.duration}</div>
              <div className="text-xs text-warm-500 mt-0.5">Duration</div>
            </div>
          </div>

          <div className="rounded-xl bg-warm-50 border border-warm-200 p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-sm text-warm-600 leading-relaxed">
              This exam has a 10 minute break halfway through the questions. You may resume your
              exam anytime during this period.
            </p>
          </div>

          <label className="flex items-start gap-2.5 mb-4 sm:mb-6 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={extraTime}
              onChange={(e) => setExtraTime(e.target.checked)}
              className="rounded border-warm-300 mt-1 shrink-0 w-4 h-4"
            />
            <span className="text-sm text-warm-700 leading-snug">
              I will get extra time during my test for accessibility reasons
            </span>
            <Info className="w-4 h-4 text-warm-400 shrink-0 mt-0.5" />
          </label>

          <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
            <p className="text-sm text-warm-600 leading-relaxed">
              Our mock exam imitates both the time limit and question count of the {meta.name}{" "}
              exam. DrNote&apos;s content is prepared to help you practice for the types of
              questions you will see on the official examination.
            </p>
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 leading-relaxed">
                Warning: You will NOT see these exam questions on exam day.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => window.history.back()}
              className="flex-1 py-3.5 sm:py-3 rounded-xl font-medium border border-warm-300 text-warm-700 hover:bg-warm-50 min-h-[48px] active:opacity-80"
            >
              Cancel
            </button>
            <button
              onClick={() => setStep("expect")}
              className="flex-1 py-3.5 sm:py-3 rounded-xl font-medium bg-neutral-800 text-white hover:bg-neutral-700 min-h-[48px] active:opacity-80"
            >
              What to Expect →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
