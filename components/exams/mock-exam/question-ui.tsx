"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ExamProgressBar,
  QuestionCard,
  ExamNavigationFooter,
  ExamFullscreen,
} from "./index";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface MockQuestion {
  id: string;
  text: string;
  options: QuestionOption[];
  correctAnswer?: string;
  subject: string;
}

interface QuestionUIProps {
  questions?: MockQuestion[];
  onSubmitExam?: (answers: Record<string, string>) => void;
  timeLimit?: number;
  examTitle?: string;
}

const DEFAULT_QUESTIONS: MockQuestion[] = [
  {
    id: "q1",
    text: 'Female patient presented with green vaginal frothy discharge, cervix showed multiple micropetechiae (i.e., "strawberry cervix"). Which of the following is the most likely diagnosis?',
    options: [
      { id: "A", text: "Trichomonas" },
      { id: "B", text: "Fungal" },
      { id: "C", text: "Bacterial vaginosis" },
      { id: "D", text: "N. gonorrhoeae" },
    ],
    correctAnswer: "A",
    subject: "Obstetrics and Gynecology",
  },
  {
    id: "q2",
    text: "A 45-year-old patient presents with chest pain. Which enzyme is most specific for myocardial infarction in the first 6 hours?",
    options: [
      { id: "A", text: "CK-MB" },
      { id: "B", text: "Troponin I" },
      { id: "C", text: "LDH" },
      { id: "D", text: "AST" },
    ],
    correctAnswer: "B",
    subject: "Medicine",
  },
  {
    id: "q3",
    text: "Pregnant lady in the first trimester came complaining of nausea, vomiting, and palpitations. Labs: TSH: 0.06 (low), T4: elevated, Anti-TPO: positive. What's the most likely diagnosis?",
    options: [
      { id: "A", text: "Hyperemesis gravidarum" },
      { id: "B", text: "Graves' disease" },
      { id: "C", text: "Molar pregnancy" },
      { id: "D", text: "Gestational transient thyrotoxicosis" },
    ],
    correctAnswer: "B",
    subject: "Obstetrics and Gynecology",
  },
  {
    id: "q4",
    text: "Pregnant patient came to clinic during influenza season and asked about vaccination (she already took the flu vaccine this year).",
    options: [
      { id: "A", text: "Intranasal influenza" },
      { id: "B", text: "Tdap in 27–36 weeks" },
      { id: "C", text: "MMR" },
      { id: "D", text: "IM influenza" },
    ],
    correctAnswer: "B",
    subject: "Preventive Medicine",
  },
  {
    id: "q5",
    text: "26-year-old female patient complaining of abdominal pain and bloating with diarrhea. What is the most appropriate next step?",
    options: [
      { id: "A", text: "Hydrogen breath test" },
      { id: "B", text: "Abdominal ultrasound" },
      { id: "C", text: "Anti-tissue transglutaminase antibody" },
      { id: "D", text: "Fecal occult blood" },
    ],
    correctAnswer: "C",
    subject: "Gastrointestinal Disorders",
  },
];

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function QuestionUI({
  questions = DEFAULT_QUESTIONS,
  onSubmitExam,
  timeLimit = 3600,
  examTitle = "Practice Exam",
}: QuestionUIProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [strikeThroughOptions, setStrikeThroughOptions] = useState<Record<string, string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<string[]>([]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (timeRemaining <= 0) {
      onSubmitExam?.(selectedAnswers);
      return;
    }
    const timer = setInterval(() => setTimeRemaining((r) => r - 1), 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, selectedAnswers, onSubmitExam]);

  const handleSubmitExam = () => {
    onSubmitExam?.(selectedAnswers);
  };

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const toggleStrikeThrough = (questionId: string, optionId: string) => {
    setStrikeThroughOptions((prev) => {
      const strikes = prev[questionId] || [];
      if (strikes.includes(optionId)) {
        return { ...prev, [questionId]: strikes.filter((id) => id !== optionId) };
      }
      return { ...prev, [questionId]: [...strikes, optionId] };
    });
  };

  const toggleBookmark = (questionId: string) => {
    setBookmarkedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  if (!currentQuestion) return null;

  return (
    <ExamFullscreen isActive>
      <div className="min-h-screen flex flex-col bg-background">
        <ExamProgressBar
          examTitle={examTitle}
          currentQuestion={currentIndex + 1}
          totalQuestions={questions.length}
          timeRemaining={formatTime(timeRemaining)}
          onEndExam={handleSubmitExam}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="bg-card border-r border-border w-32 flex-shrink-0 hidden sm:block">
            <div className="p-2 border-b border-border">
              {bookmarkedQuestions.length > 0 && (
                <div className="mb-2">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-1">BOOKMARKED</h3>
                  <div className="flex flex-wrap gap-1">
                    {bookmarkedQuestions.map((questionId) => {
                      const idx = questions.findIndex((q) => q.id === questionId);
                      return (
                        <Button
                          key={questionId}
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0 border-primary min-w-6"
                          onClick={() => setCurrentIndex(idx)}
                        >
                          {idx + 1}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="overflow-y-auto h-full">
              <div className="flex flex-col">
                {questions.map((_, index) => {
                  const isCurrent = currentIndex === index;
                  const isAnswered = selectedAnswers[questions[index].id] !== undefined;
                  const isBookmarked = bookmarkedQuestions.includes(questions[index].id);
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className={`rounded-none h-12 flex items-center justify-center ${
                        isCurrent ? "bg-primary/10" : isAnswered ? "bg-muted" : ""
                      } ${isBookmarked ? "border-r-4 border-primary" : ""}`}
                      onClick={() => setCurrentIndex(index)}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCurrent ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
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

          {/* Main Content */}
          <main className="flex-1 overflow-auto relative bg-background">
            <div className="w-full px-4 sm:px-6 lg:px-8 bg-card min-h-full shadow-sm border border-border/50">
              <QuestionCard
                questionNumber={currentIndex + 1}
                totalQuestions={questions.length}
                subject={currentQuestion.subject}
                questionText={currentQuestion.text}
                options={currentQuestion.options}
                selectedAnswer={selectedAnswers[currentQuestion.id]}
                strikeThroughOptions={strikeThroughOptions[currentQuestion.id] || []}
                onSelectAnswer={(optId) => handleSelectAnswer(currentQuestion.id, optId)}
                onToggleStrikeThrough={(optId) =>
                  toggleStrikeThrough(currentQuestion.id, optId)
                }
              />
            </div>
          </main>
        </div>

        <ExamNavigationFooter
          currentQuestion={currentIndex + 1}
          totalQuestions={questions.length}
          isFlagged={bookmarkedQuestions.includes(currentQuestion.id)}
          onToggleFlag={() => toggleBookmark(currentQuestion.id)}
          onPrevious={goPrevious}
          onNext={goNext}
          onSubmit={handleSubmitExam}
          isFirstQuestion={currentIndex === 0}
          isLastQuestion={currentIndex === questions.length - 1}
        />
      </div>
    </ExamFullscreen>
  );
}
