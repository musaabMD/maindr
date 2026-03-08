"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const icons = {
  timer: (color: string, size = 22) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2 2" />
      <path d="M5 3L2 6" />
      <path d="M22 6l-3-3" />
      <path d="M12 5V3" />
      <path d="M10 2h4" />
    </svg>
  ),
  book: (color: string, size = 22) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h6" />
    </svg>
  ),
  xCircle: (color: string, size = 22) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6" />
      <path d="M9 9l6 6" />
    </svg>
  ),
  pen: (color: string, size = 22) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  ),
  listChecks: (color: string, size = 22) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 6h11" />
      <path d="M10 12h11" />
      <path d="M10 18h11" />
      <path d="M3 6l1 1 2-2" />
      <path d="M3 12l1 1 2-2" />
      <path d="M3 18l1 1 2-2" />
    </svg>
  ),
  barChart: (color: string, size = 22) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20V10" />
      <path d="M18 20V4" />
      <path d="M6 20v-4" />
    </svg>
  ),
  lock: (color: string, size = 10) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  settings: (color: string, size = 15) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  zap: (color: string, size = 18) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  chevronRight: (color: string, size = 13) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
};

const modes = [
  { id: "timed", name: "Timed Quiz", desc: "Race against the clock to test your speed and accuracy", icon: "timer" as const, color: "#3B82F6", bg: "#EFF6FF", premium: false, modalId: "timed" as const },
  { id: "weakest", name: "Weakest Subject", desc: "Focus on areas where you need the most improvement", icon: "book" as const, color: "#F59E0B", bg: "#FFFBEB", premium: true, modalId: "weakest-subject" as const },
  { id: "missed", name: "Missed Questions", desc: "Revisit questions you've previously answered incorrectly", icon: "xCircle" as const, color: "#EF4444", bg: "#FEF2F2", premium: true, modalId: "missed-questions" as const },
  { id: "custom", name: "Build Your Own", desc: "Customize question count, subjects, and difficulty", icon: "pen" as const, color: "#8B5CF6", bg: "#F5F3FF", premium: true, modalId: "build-your-own" as const },
  { id: "questions", name: "All Questions", desc: "Practice with the full question bank at your own pace", icon: "listChecks" as const, color: "#10B981", bg: "#ECFDF5", premium: false, modalId: "questions" as const },
  { id: "predictor", name: "Score Predictor", desc: "Simulate exam conditions and predict your real score", icon: "barChart" as const, color: "#EC4899", bg: "#FDF2F8", premium: true, modalId: "score-predictor" as const },
];

type QuizModeId = "timed" | "weakest-subject" | "missed-questions" | "build-your-own" | "questions" | "score-predictor" | "settings";

interface QuizModesProps {
  slug: string;
  meta: { name: string; subjects: string[]; questions: number };
}

function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-border max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {children}
      </div>
    </div>
  );
}

function TimedQuizModal({
  onClose,
  onStartQuiz,
}: {
  onClose: () => void;
  onStartQuiz: (minutes: number) => void;
}) {
  const [minutes, setMinutes] = useState(5);

  return (
    <ModalOverlay onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              {icons.timer("#3B82F6", 20)}
            </div>
            <h2 className="text-lg font-semibold">Timed Quiz</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <span className="text-primary font-medium text-lg">×</span>
          </button>
        </div>
        <p className="text-muted-foreground text-sm mb-4">How many minutes?</p>
        <div className="flex items-center gap-3 mb-6">
          <Input
            type="number"
            min={1}
            max={100}
            value={minutes}
            onChange={(e) =>
              setMinutes(Math.min(100, Math.max(0, Number(e.target.value) || 0)))
            }
            className="w-20"
          />
          <input
            type="range"
            min={1}
            max={100}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="flex-1 h-2 rounded-full appearance-none bg-muted accent-primary"
          />
          <span className="text-sm text-muted-foreground w-8">{minutes}</span>
        </div>
        <div className="flex justify-between gap-3">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => onStartQuiz(minutes)}>Start Quiz</Button>
        </div>
      </div>
    </ModalOverlay>
  );
}

function WeakestSubjectModal({
  onClose,
  subjects,
}: {
  onClose: () => void;
  subjects: string[];
}) {
  const [questionCount, setQuestionCount] = useState(1);
  const maxQuestions = 68; // Mock value - would come from data

  return (
    <ModalOverlay onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              {icons.book("#F59E0B", 20)}
            </div>
            <h2 className="text-lg font-semibold">Weakest Subjects Quiz</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <span className="text-primary font-medium text-lg">×</span>
          </button>
        </div>
        {subjects.length > 0 && (
          <div className="rounded-xl border border-border p-4 mb-4 bg-muted/30">
            <div className="font-medium">{subjects[0]}</div>
            <div className="text-sm text-muted-foreground mt-1">
              0 of 1 Correct
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm text-muted-foreground">--%</span>
            </div>
          </div>
        )}
        <p className="text-muted-foreground text-sm mb-4">How many questions?</p>
        <div className="flex items-center gap-3 mb-6">
          <Input
            type="number"
            min={0}
            max={maxQuestions}
            value={questionCount}
            onChange={(e) =>
              setQuestionCount(
                Math.min(maxQuestions, Math.max(0, Number(e.target.value) || 0))
              )
            }
            className="w-20"
          />
          <input
            type="range"
            min={0}
            max={maxQuestions}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="flex-1 h-2 rounded-full appearance-none bg-muted accent-primary"
          />
          <span className="text-sm text-muted-foreground w-8">
            {questionCount}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Link href="/upgrade">
            <Button>Upgrade to Premium</Button>
          </Link>
        </div>
      </div>
    </ModalOverlay>
  );
}

function MissedQuestionsModal({
  onClose,
  incorrectCount = 3,
}: {
  onClose: () => void;
  incorrectCount?: number;
}) {
  const [questionCount, setQuestionCount] = useState(
    Math.min(1, incorrectCount)
  );

  return (
    <ModalOverlay onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              {icons.xCircle("#EF4444", 20)}
            </div>
            <h2 className="text-lg font-semibold">Missed Questions Quiz</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <span className="text-primary font-medium text-lg">×</span>
          </button>
        </div>
        <div className="rounded-xl border border-pink-200 dark:border-pink-900/50 bg-pink-50 dark:bg-pink-900/20 p-4 mb-4 text-center">
          <div className="text-2xl font-bold text-pink-700 dark:text-pink-400">
            {incorrectCount}
          </div>
          <div className="text-sm text-muted-foreground">Incorrect</div>
        </div>
        <p className="text-muted-foreground text-sm mb-4">How many questions?</p>
        <div className="flex items-center gap-3 mb-6">
          <Input
            type="number"
            min={0}
            max={incorrectCount}
            value={questionCount}
            onChange={(e) =>
              setQuestionCount(
                Math.min(incorrectCount, Math.max(0, Number(e.target.value) || 0))
              )
            }
            className="w-20"
          />
          <input
            type="range"
            min={0}
            max={incorrectCount}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="flex-1 h-2 rounded-full appearance-none bg-muted accent-primary"
          />
          <span className="text-sm text-muted-foreground w-8">
            {questionCount}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Link href="/upgrade">
            <Button>Upgrade to Premium</Button>
          </Link>
        </div>
      </div>
    </ModalOverlay>
  );
}

function BuildYourOwnModal({
  onClose,
  subjects,
}: {
  onClose: () => void;
  subjects: string[];
}) {
  const [questionCount, setQuestionCount] = useState(15);
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(
    () => new Set(subjects)
  );
  const [showAnswersAsIGo, setShowAnswersAsIGo] = useState(true);
  const [automaticSubmit, setAutomaticSubmit] = useState(true);

  const toggleSubject = (s: string) => {
    setSelectedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30">
              {icons.pen("#8B5CF6", 20)}
            </div>
            <h2 className="text-lg font-semibold">Build Your Own</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <span className="text-primary font-medium text-lg">×</span>
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h3 className="text-sm font-medium mb-2">
              All Subjects ({subjects.length} of {subjects.length})
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {subjects.map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedSubjects.has(s)}
                    onChange={() => toggleSubject(s)}
                    className="rounded border-input"
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Answer display</h3>
            <label className="flex items-center justify-between py-2 cursor-pointer">
              <span className="text-sm">Show answers as I go</span>
              <input
                type="radio"
                name="answerDisplay"
                checked={showAnswersAsIGo}
                onChange={() => setShowAnswersAsIGo(true)}
                className="rounded-full"
              />
            </label>
            <label className="flex items-center justify-between py-2 cursor-pointer">
              <span className="text-sm">Show answers at the end</span>
              <input
                type="radio"
                name="answerDisplay"
                checked={!showAnswersAsIGo}
                onChange={() => setShowAnswersAsIGo(false)}
                className="rounded-full"
              />
            </label>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Submit</h3>
            <label className="flex items-center justify-between py-2 cursor-pointer">
              <span className="text-sm">
                Manual Submit (Click &quot;Check Answer&quot; Button)
              </span>
              <input
                type="radio"
                name="submitMode"
                checked={!automaticSubmit}
                onChange={() => setAutomaticSubmit(false)}
                className="rounded-full"
              />
            </label>
            <label className="flex items-center justify-between py-2 cursor-pointer">
              <span className="text-sm">Automatic Submit (Click Answer)</span>
              <input
                type="radio"
                name="submitMode"
                checked={automaticSubmit}
                onChange={() => setAutomaticSubmit(true)}
                className="rounded-full"
              />
            </label>
          </div>

          <div>
            <p className="text-muted-foreground text-sm mb-2">
              How many questions?
            </p>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={1}
                max={250}
                value={questionCount}
                onChange={(e) =>
                  setQuestionCount(
                    Math.min(250, Math.max(1, Number(e.target.value) || 1))
                  )
                }
                className="w-20"
              />
              <input
                type="range"
                min={1}
                max={250}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none bg-muted accent-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Link href="/upgrade">
            <Button>Upgrade to Premium</Button>
          </Link>
        </div>
      </div>
    </ModalOverlay>
  );
}

function QuestionsModal({
  slug,
  onClose,
}: {
  slug: string;
  onClose: () => void;
}) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              {icons.listChecks("#10B981", 20)}
            </div>
            <h2 className="text-lg font-semibold">Questions</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <span className="text-primary font-medium text-lg">×</span>
          </button>
        </div>
        <p className="text-muted-foreground text-sm mb-6">
          Practice with all questions from this exam. Browse by subject or work through the full set.
        </p>
        <div className="flex justify-between gap-3">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Link href={`/exams/${slug}/study?mode=questions`}>
            <Button>Start Questions</Button>
          </Link>
        </div>
      </div>
    </ModalOverlay>
  );
}

function ScorePredictorModal({
  slug,
  onClose,
  onStart,
}: {
  slug: string;
  onClose: () => void;
  onStart: () => void;
}) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              {icons.barChart("#EC4899", 20)}
            </div>
            <h2 className="text-lg font-semibold">Score Predictor</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <span className="text-primary font-medium text-lg">×</span>
          </button>
        </div>
        <p className="text-muted-foreground text-sm mb-6">
          Full-length timed exam simulating the real test experience.
        </p>
        <div className="flex justify-between gap-3">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Link href={`/exams/${slug}/self-assessments`}>
            <Button onClick={onStart}>Start Score Predictor</Button>
          </Link>
        </div>
      </div>
    </ModalOverlay>
  );
}

function QuizSettingsModal({ onClose }: { onClose: () => void }) {
  const [showAnswersAsIGo, setShowAnswersAsIGo] = useState(true);
  const [automaticSubmit, setAutomaticSubmit] = useState(true);

  return (
    <ModalOverlay onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-muted">
              {icons.settings("#64748B", 20)}
            </div>
            <h2 className="text-lg font-semibold">Quiz Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-primary"
            aria-label="Close"
          >
            <span className="font-medium text-lg">×</span>
          </button>
        </div>
        <p className="text-muted-foreground text-sm mb-6">
          These controls will be default settings for all of your quiz modes.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Answer display</h3>
            <button
              type="button"
              onClick={() => setShowAnswersAsIGo(true)}
              className="w-full flex items-center justify-between py-2 cursor-pointer rounded-lg hover:bg-muted/50 px-3"
            >
              <span className="text-sm">Show answers as I go</span>
              {showAnswersAsIGo && <Check className="h-5 w-5 text-primary" />}
            </button>
            <button
              type="button"
              onClick={() => setShowAnswersAsIGo(false)}
              className="w-full flex items-center justify-between py-2 cursor-pointer rounded-lg hover:bg-muted/50 px-3"
            >
              <span className="text-sm">Show answers at the end</span>
              {!showAnswersAsIGo && <Check className="h-5 w-5 text-primary" />}
            </button>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Submit</h3>
            <button
              type="button"
              onClick={() => setAutomaticSubmit(false)}
              className="w-full flex items-center justify-between py-2 cursor-pointer rounded-lg hover:bg-muted/50 px-3"
            >
              <span className="text-sm">
                Manual Submit (Click &quot;Check Answer&quot; Button)
              </span>
              {!automaticSubmit && <Check className="h-5 w-5 text-primary" />}
            </button>
            <button
              type="button"
              onClick={() => setAutomaticSubmit(true)}
              className="w-full flex items-center justify-between py-2 cursor-pointer rounded-lg hover:bg-muted/50 px-3"
            >
              <span className="text-sm">Automatic Submit (Click Answer)</span>
              {automaticSubmit && <Check className="h-5 w-5 text-primary" />}
            </button>
          </div>

          <div>
            <h3 className="text-sm font-medium">Adjust Subjects</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Customize which subjects appear in your quizzes.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </div>
    </ModalOverlay>
  );
}

export function QuizModes({ slug, meta }: QuizModesProps) {
  const [openModal, setOpenModal] = useState<QuizModeId | "settings" | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const handleTimedQuizStart = (minutes: number) => {
    setOpenModal(null);
    window.location.href = `/exams/${slug}/study?mode=timed&minutes=${minutes}`;
  };

  return (
    <section className="mt-10">
      <div className="w-full max-w-[780px] mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              {icons.zap("#B45309")}
              <span className="font-mono text-[11px] font-bold tracking-widest uppercase text-amber-700 dark:text-amber-400">
                Study Modes
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight m-0 text-foreground">
              Quiz Modes
            </h2>
          </div>
            <button
              type="button"
              onClick={() => setOpenModal("settings")}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-[13px] font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {icons.settings("currentColor")}
              Settings
            </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modes.map((mode) => {
            const isHovered = hovered === mode.id;
            const isSelected = selected === mode.id;
            const active = isSelected || isHovered;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  setSelected(mode.id);
                  setOpenModal(mode.modalId);
                }}
                onMouseEnter={() => setHovered(mode.id)}
                onMouseLeave={() => setHovered(null)}
                className="relative rounded-2xl border-2 p-6 pt-7 pb-5 text-left overflow-hidden transition-all duration-[250ms] ease-out hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                style={{
                  borderColor: active ? `${mode.color}` : `${mode.color}40`,
                  background: isSelected
                    ? `linear-gradient(135deg, ${mode.color}18, ${mode.color}0c)`
                    : isHovered
                      ? `linear-gradient(135deg, ${mode.color}12, ${mode.color}08)`
                      : `${mode.color}08`,
                  boxShadow: isHovered ? `0 8px 24px ${mode.color}25, 0 0 0 1px ${mode.color}20` : undefined,
                }}
              >
                {mode.premium && (
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1 rounded-md bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5">
                    {icons.lock("#B45309")}
                    <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                      Pro
                    </span>
                  </div>
                )}

                <div
                  className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-4 transition-all duration-300"
                  style={{
                    background: active ? mode.color : mode.bg,
                    boxShadow: active ? `0 4px 12px ${mode.color}50` : undefined,
                  }}
                >
                  {icons[mode.icon](active ? "#fff" : mode.color)}
                </div>

                <h3 className="text-[15px] font-bold mb-1.5 tracking-tight text-foreground">
                  {mode.name}
                </h3>
                <p className="text-[12.5px] leading-relaxed m-0 text-muted-foreground">
                  {mode.desc}
                </p>

                <div
                  className="flex items-center gap-1 mt-4 transition-all duration-250"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? "translateX(0)" : "translateX(-8px)",
                  }}
                >
                  <span className="text-[11px] font-bold tracking-wide" style={{ color: mode.color }}>
                    Start
                  </span>
                  {icons.chevronRight(mode.color)}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs font-medium mt-8 text-muted-foreground">
          Upgrade to <span className="font-bold text-amber-700 dark:text-amber-400">Pro</span> to unlock all quiz modes
        </p>
      </div>

      {openModal === "timed" && (
        <TimedQuizModal
          onClose={() => setOpenModal(null)}
          onStartQuiz={handleTimedQuizStart}
        />
      )}
      {openModal === "weakest-subject" && (
        <WeakestSubjectModal
          onClose={() => setOpenModal(null)}
          subjects={meta.subjects}
        />
      )}
      {openModal === "missed-questions" && (
        <MissedQuestionsModal
          onClose={() => setOpenModal(null)}
          incorrectCount={3}
        />
      )}
      {openModal === "build-your-own" && (
        <BuildYourOwnModal
          onClose={() => setOpenModal(null)}
          subjects={meta.subjects}
        />
      )}
      {openModal === "questions" && (
        <QuestionsModal
          slug={slug}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === "score-predictor" && (
        <ScorePredictorModal
          slug={slug}
          onClose={() => setOpenModal(null)}
          onStart={() => setOpenModal(null)}
        />
      )}
      {openModal === "settings" && (
        <QuizSettingsModal onClose={() => setOpenModal(null)} />
      )}
    </section>
  );
}
