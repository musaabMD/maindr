"use client";

import { useState } from "react";
import { BlueprintDisplay } from "./blueprint-display";
import { StartPracticing } from "./start-practicing";
import { QuestionUI } from "./question-ui";
import { ExamResults } from "./exam-results";

type AppState = "blueprint" | "start-practicing" | "demo" | "full-exam" | "results";

export function ExamAppExample() {
  const [currentView, setCurrentView] = useState<AppState>("blueprint");
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});

  const handleStartPractice = () => setCurrentView("start-practicing");
  const handleStartDemo = () => setCurrentView("demo");
  const handlePreorder = () => {
    alert("Preorder functionality would be implemented here");
  };
  const handleSubmitExam = (answers: Record<string, string>) => {
    setExamAnswers(answers);
    setCurrentView("results");
  };
  const handleReturnToMenu = () => setCurrentView("blueprint");

  return (
    <div className="min-h-screen">
      {currentView === "blueprint" && (
        <div className="container mx-auto p-4">
          <BlueprintDisplay onStartPractice={handleStartPractice} />
        </div>
      )}

      {currentView === "start-practicing" && (
        <StartPracticing
          onStartDemo={handleStartDemo}
          onPreorder={handlePreorder}
        />
      )}

      {currentView === "demo" && (
        <QuestionUI
          onSubmitExam={handleSubmitExam}
          timeLimit={600}
          examTitle="DrNote Mock Exam"
        />
      )}

      {currentView === "results" && (
        <ExamResults onReturnToMenu={handleReturnToMenu} />
      )}
    </div>
  );
}
