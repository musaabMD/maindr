"use client";

import { ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExamNavigationFooterProps {
  currentQuestion: number;
  totalQuestions: number;
  isFlagged: boolean;
  onToggleFlag: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

export function ExamNavigationFooter({
  currentQuestion,
  totalQuestions,
  isFlagged,
  onToggleFlag,
  onPrevious,
  onNext,
  onSubmit,
  isFirstQuestion,
  isLastQuestion,
}: ExamNavigationFooterProps) {
  return (
    <footer className="bg-primary text-primary-foreground p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
      <div className="text-sm font-semibold shrink-0">
        {currentQuestion} of {totalQuestions} questions
      </div>
      <div className="flex flex-wrap gap-2 justify-end">
        <Button
          variant="secondary"
          size="sm"
          className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0 min-h-[44px] px-3 sm:min-h-0 sm:px-2"
          onClick={onToggleFlag}
          aria-label={isFlagged ? "Remove bookmark" : "Bookmark question"}
        >
          <Bookmark className={cn("h-4 w-4 shrink-0", isFlagged && "fill-current")} />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0 min-h-[44px] px-3 sm:min-h-0 sm:px-2 disabled:opacity-50"
          onClick={onPrevious}
          disabled={isFirstQuestion}
          aria-label="Previous question"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="bg-primary-foreground/30 hover:bg-primary-foreground/40 text-primary-foreground border-0 min-h-[44px] px-3 sm:min-h-0 sm:px-2 disabled:opacity-50"
          onClick={onNext}
          disabled={isLastQuestion}
          aria-label="Next question"
        >
          <ChevronRight className="h-4 w-4 shrink-0" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="min-h-[44px] px-3 sm:min-h-0 sm:px-2 bg-destructive text-white hover:bg-destructive/90 border-0"
          onClick={onSubmit}
        >
          Submit
        </Button>
      </div>
    </footer>
  );
}
