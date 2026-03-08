"use client";

import { Button } from "@/components/ui/button";

interface ExamProgressBarProps {
  examTitle: string;
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: string;
  onEndExam: () => void;
}

export function ExamProgressBar({
  examTitle,
  currentQuestion,
  totalQuestions,
  timeRemaining,
  onEndExam,
}: ExamProgressBarProps) {
  return (
    <header className="bg-primary text-primary-foreground shrink-0">
      {/* Mobile: stacked layout; Desktop: single row */}
      <div className="flex flex-col gap-2 p-2 sm:p-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Row 1: Logo + Title (mobile) | Logo | Title | Actions (desktop) */}
        <div className="flex items-center justify-between gap-2 min-h-10 sm:min-h-0">
          <div className="flex items-center min-w-0 flex-1 sm:flex-initial">
            <div className="bg-primary-foreground text-primary w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
              D
            </div>
            <span className="font-semibold text-sm sm:text-base ml-2 truncate hidden sm:inline">
              DrNote
            </span>
          </div>

          <div className="flex-1 min-w-0 mx-2 sm:mx-4 sm:flex-initial sm:max-w-md">
            <h1 className="text-sm sm:text-base font-semibold truncate text-center sm:text-left">
              {examTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-primary-foreground/20 px-2.5 py-1.5 sm:px-3 rounded-full min-w-[4.5rem] sm:min-w-0 justify-center">
              <span className="text-xs sm:text-sm font-mono tabular-nums">{timeRemaining}</span>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="min-h-[44px] sm:min-h-0 sm:h-8 px-3 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0 font-medium text-xs sm:text-sm"
              onClick={onEndExam}
            >
              End Exam
            </Button>
          </div>
        </div>

        {/* Mobile: progress indicator */}
        <div className="flex items-center gap-2 sm:hidden text-xs text-primary-foreground/90">
          <span>
            Q{currentQuestion} of {totalQuestions}
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-primary-foreground/20 overflow-hidden">
            <div
              className="h-full bg-primary-foreground/80 rounded-full transition-all duration-300"
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
