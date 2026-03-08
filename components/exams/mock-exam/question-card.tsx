"use client";

import { Eye, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface QuestionOption {
  id: string;
  text: string;
}

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  subject: string;
  questionText: string;
  options: QuestionOption[];
  selectedAnswer?: string;
  strikeThroughOptions?: string[];
  onSelectAnswer: (optionId: string) => void;
  onToggleStrikeThrough?: (optionId: string) => void;
}

export function QuestionCard({
  questionNumber,
  totalQuestions,
  subject,
  questionText,
  options,
  selectedAnswer,
  strikeThroughOptions = [],
  onSelectAnswer,
  onToggleStrikeThrough,
}: QuestionCardProps) {
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
        <span className="text-muted-foreground text-sm">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
        {subject}
      </div>
      <div className="mb-6">
        <p className="text-foreground leading-relaxed text-base sm:text-[15px]">
          {questionText}
        </p>
      </div>

      <div className="mb-3 text-muted-foreground text-sm">
        Answers {options[0]?.id} – {options[options.length - 1]?.id}
      </div>

      <div className="space-y-3">
        {options.map((opt) => {
          const isStrikethrough = strikeThroughOptions.includes(opt.id);
          const isSelected = selectedAnswer === opt.id;

          return (
            <Card
              key={opt.id}
              className={cn(
                "cursor-pointer transition-all duration-200 select-none",
                "hover:border-primary/50 hover:bg-muted/30",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected && "border-primary ring-2 ring-primary/20 bg-primary/5"
              )}
              onClick={() => onSelectAnswer(opt.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectAnswer(opt.id);
                }
              }}
            >
              <CardContent className="p-4 sm:p-4 flex items-center gap-3 min-h-[44px] sm:min-h-0">
                <div
                  className={cn(
                    "w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-semibold text-sm transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {opt.id}
                </div>
                <div
                  className={cn(
                    "flex-1 min-w-0 text-foreground",
                    isStrikethrough && "line-through text-muted-foreground"
                  )}
                >
                  {opt.text}
                </div>
                {isSelected && (
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                )}
                {onToggleStrikeThrough && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStrikeThrough(opt.id);
                    }}
                  >
                    <Eye
                      className={cn(
                        "h-4 w-4",
                        isStrikethrough ? "text-muted-foreground" : "text-muted-foreground"
                      )}
                    />
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
