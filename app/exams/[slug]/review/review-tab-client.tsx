"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ExamTabHeader } from "@/components/exams/exam-tab-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ReviewQuestion = {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  status: "correct" | "incorrect";
  flagged: boolean;
  explanation?: string;
};

const reviewData: ReviewQuestion[] = [
  {
    id: 1,
    category: "Fire Safety Overview",
    question:
      "In type I buildings, structural components such as walls, ceilings, and floors must be constructed from materials capable of withstanding excessive heat and flames. Regarding exterior bearing walls that support more than one floor, what is the minimum fire resistance rating required?",
    options: ["1 hour", "2 hours", "3-4 hours", "4 hours"],
    correctIndex: 2,
    status: "incorrect",
    flagged: false,
    explanation:
      "Exterior bearing walls that support more than one floor in Type I construction require a minimum fire resistance rating of 3-4 hours. This ensures structural integrity during a fire and allows time for occupant evacuation.",
  },
  {
    id: 2,
    category: "Scene Response",
    question:
      "The use of Air-purifying Respirators (APRs) at hazardous materials incidents is approved by NIOSH. Which of the following is not one of the three types of canisters that can be used with an APR at a hazardous material response?",
    options: ["Acid gas", "Organic vapor", "Particulate filter", "Ammonia/methylamine"],
    correctIndex: 2,
    status: "incorrect",
    flagged: false,
    explanation:
      "Particulate filter is not one of the three types of APR canisters. The three types are acid gas, organic vapor, and ammonia/methylamine.",
  },
  {
    id: 3,
    category: "Building Construction",
    question:
      "What classification of building construction uses non-combustible or limited combustible materials for structural elements but does not require fire resistance ratings?",
    options: ["Type I", "Type II", "Type III", "Type IV"],
    correctIndex: 1,
    status: "correct",
    flagged: false,
    explanation:
      "Type II construction uses non-combustible or limited combustible materials for structural elements but does not require fire resistance ratings for those elements.",
  },
  {
    id: 4,
    category: "Hazardous Materials",
    question:
      "According to the ERG, what is the recommended initial isolation distance for a large spill of a flammable liquid during daytime conditions?",
    options: ["30 meters", "50 meters", "100 meters", "300 meters"],
    correctIndex: 2,
    status: "incorrect",
    flagged: false,
    explanation:
      "According to the ERG, a large spill of flammable liquid during daytime typically requires an initial isolation distance of 100 meters.",
  },
  {
    id: 5,
    category: "Fire Behavior",
    question:
      "Which phase of fire development is characterized by a sudden transition to full room involvement due to radiant heat feedback?",
    options: ["Growth", "Flashover", "Fully developed", "Decay"],
    correctIndex: 1,
    status: "correct",
    flagged: false,
    explanation:
      "Flashover is the sudden transition to full room involvement due to radiant heat feedback from the ceiling and upper walls.",
  },
  {
    id: 6,
    category: "Ventilation",
    question:
      "When performing vertical ventilation, what is the recommended location for the initial cut relative to the fire's location?",
    options: ["Directly above the fire", "Between the fire and the exit", "At the point of entry", "Downwind of the fire"],
    correctIndex: 0,
    status: "incorrect",
    flagged: false,
    explanation:
      "The initial cut for vertical ventilation should be made directly above the fire to allow heat and smoke to escape upward.",
  },
  {
    id: 7,
    category: "PPE & Equipment",
    question:
      "What is the minimum rated service life for SCBA cylinders made of composite materials?",
    options: ["5 years", "10 years", "15 years", "20 years"],
    correctIndex: 2,
    status: "incorrect",
    flagged: false,
    explanation:
      "SCBA cylinders made of composite materials have a minimum rated service life of 15 years.",
  },
  {
    id: 8,
    category: "Fire Safety Overview",
    question:
      "What is the primary purpose of a fire stop in building construction?",
    options: ["Prevent fire spread through openings", "Extinguish fires", "Detect smoke", "Provide emergency lighting"],
    correctIndex: 0,
    status: "incorrect",
    flagged: false,
    explanation:
      "Fire stops prevent the spread of fire and smoke through openings in walls, floors, and ceilings.",
  },
  {
    id: 9,
    category: "Scene Response",
    question:
      "During a mass casualty incident, which triage category indicates patients who need immediate life-saving intervention?",
    options: ["Green", "Yellow", "Red", "Black"],
    correctIndex: 2,
    status: "correct",
    flagged: false,
    explanation:
      "The Red triage category indicates patients who need immediate life-saving intervention during mass casualty incidents.",
  },
  {
    id: 10,
    category: "Building Construction",
    question:
      "What type of load is created by the weight of the structure itself including walls, floors, and roof?",
    options: ["Live load", "Dead load", "Impact load", "Wind load"],
    correctIndex: 1,
    status: "incorrect",
    flagged: false,
    explanation:
      "Dead load is the weight of the structure itself, including walls, floors, roof, and permanent fixtures.",
  },
  {
    id: 11,
    category: "Fire Behavior",
    question:
      "What term describes the pre-mixed flaming combustion of gases or vapors that have accumulated in a confined space?",
    options: ["Backdraft", "Flashover", "Rollover", "Flameover"],
    correctIndex: 0,
    status: "correct",
    flagged: false,
    explanation:
      "Backdraft describes the pre-mixed flaming combustion of gases or vapors that have accumulated in a confined space when oxygen is introduced.",
  },
  {
    id: 12,
    category: "Hazardous Materials",
    question:
      "Which NFPA standard covers the competencies for responders to hazardous materials incidents?",
    options: ["NFPA 472", "NFPA 1001", "NFPA 1500", "NFPA 1971"],
    correctIndex: 0,
    status: "incorrect",
    flagged: false,
    explanation:
      "NFPA 472 covers the competencies for responders to hazardous materials incidents.",
  },
];

interface ReviewTabClientProps {
  slug: string;
  meta: { name: string; subjects: string[] };
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E"];

export function ReviewTabClient({ slug, meta }: ReviewTabClientProps) {
  const [questions, setQuestions] = useState(reviewData);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [askAiOpen, setAskAiOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const questionsPerPage = 5;

  const counts = {
    all: questions.length,
    flagged: questions.filter((q) => q.flagged).length,
    incorrect: questions.filter((q) => q.status === "incorrect").length,
    correct: questions.filter((q) => q.status === "correct").length,
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesFilter =
      activeFilter === "all"
        ? true
        : activeFilter === "flagged"
          ? q.flagged
          : activeFilter === "incorrect"
            ? q.status === "incorrect"
            : activeFilter === "correct"
              ? q.status === "correct"
              : true;

    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const paginatedQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  const toggleFlag = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, flagged: !q.flagged } : q))
    );
  };

  const openQuestion = useCallback(
    (q: (typeof filteredQuestions)[0]) => {
      const idx = filteredQuestions.findIndex((f) => f.id === q.id);
      setSelectedIndex(idx >= 0 ? idx : null);
    },
    [filteredQuestions]
  );

  const closeModal = useCallback(() => setSelectedIndex(null), []);

  const currentQuestion =
    selectedIndex !== null && selectedIndex >= 0 && selectedIndex < filteredQuestions.length
      ? filteredQuestions[selectedIndex]
      : null;

  const goPrev = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex]);

  const goNext = useCallback(() => {
    if (
      selectedIndex !== null &&
      selectedIndex < filteredQuestions.length - 1
    ) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex, filteredQuestions.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentQuestion === null) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestion, closeModal, goPrev, goNext]);

  // Reset Ask AI chat when user switches to a different question
  useEffect(() => {
    setAiMessages([]);
    setAiQuestion("");
  }, [selectedIndex]);

  const handleAskAi = (e: React.MouseEvent, question?: (typeof filteredQuestions)[0]) => {
    e.stopPropagation();
    if (question) {
      const idx = filteredQuestions.findIndex((f) => f.id === question.id);
      if (idx >= 0) setSelectedIndex(idx);
    }
    setAskAiOpen(true);
    setAiQuestion("");
  };

  const submitAskAi = async () => {
    if (!aiQuestion.trim()) return;
    const userMsg = aiQuestion.trim().toLowerCase();
    setAiMessages((m) => [...m, { role: "user", content: aiQuestion.trim() }]);
    setAiQuestion("");
    setAiLoading(true);
    // If user asks to explain, return the question's explanation when available
    const wantsExplanation =
      userMsg.includes("explain") ||
      userMsg.includes("why") ||
      userMsg.includes("how") ||
      userMsg.startsWith("?");
    // Support "explain 2" or "explain question 2" for a specific question
    const numMatch = userMsg.match(/explain\s+(?:question\s+)?(\d+)/);
    const targetIdx = numMatch
      ? Math.min(Math.max(1, parseInt(numMatch[1], 10)), filteredQuestions.length) - 1
      : selectedIndex ?? 0;
    const q = filteredQuestions[targetIdx] ?? currentQuestion ?? filteredQuestions[0];
    const hasExplanation = q?.explanation;
    if (wantsExplanation && hasExplanation) {
      await new Promise((r) => setTimeout(r, 400));
      setAiMessages((m) => [
        ...m,
        { role: "assistant", content: q!.explanation! },
      ]);
    } else {
      // Placeholder: AI integration - add your API call here
      await new Promise((r) => setTimeout(r, 800));
      setAiMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: hasExplanation
            ? `Here's the explanation:\n\n${q!.explanation}\n\nConnect your AI API for more detailed help.`
            : "AI explanations are coming soon. Connect your AI API to get personalized help with this question.",
        },
      ]);
    }
    setAiLoading(false);
  };

  const closeAskAi = () => {
    setAskAiOpen(false);
    setAiMessages([]);
  };

  const goToQuestionByIndex = (idx: number) => {
    if (idx >= 0 && idx < filteredQuestions.length) setSelectedIndex(idx);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F7] pb-24">
      <ExamTabHeader
        title="Review Questions"
        subtitle="Review your answers and focus on weak areas"
        filterPills={[
          { value: "all", label: "All", count: counts.all },
          { value: "flagged", label: "Flagged", count: counts.flagged },
          { value: "incorrect", label: "Incorrect", count: counts.incorrect },
          { value: "correct", label: "Correct", count: counts.correct },
        ]}
        activeFilter={activeFilter}
        onFilterChange={(v) => {
          setActiveFilter(v);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search questions..."
        searchValue={searchQuery}
        onSearchChange={(v) => {
          setSearchQuery(v);
          setCurrentPage(1);
        }}
      />

      {/* Questions List */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {paginatedQuestions.map((q) => (
            <Card
              key={q.id}
              role="button"
              tabIndex={0}
              onClick={() => openQuestion(q)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openQuestion(q);
                }
              }}
              className="rounded-xl border border-warm-200 bg-card shadow-sm ring-1 ring-warm-200/60 overflow-hidden cursor-pointer transition-colors hover:border-teal-300 hover:shadow-md hover:shadow-teal-500/5 active:bg-warm-50"
            >
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Question
                  </span>
                  <button
                    onClick={(e) => toggleFlag(q.id, e)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      q.flagged ? "text-amber-500 bg-amber-50" : "text-warm-400 hover:text-warm-600 hover:bg-warm-100"
                    }`}
                    aria-label={q.flagged ? "Unpin question" : "Pin question"}
                  >
                    <svg className="w-5 h-5" fill={q.flagged ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
                <p className="text-warm-900 font-semibold leading-relaxed pt-4 text-[15px]">
                  {q.question}
                </p>
              </CardHeader>
              <CardContent className="px-5 pb-4 space-y-2">
                {q.options?.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  return (
                    <div
                      key={idx}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-warm-200 bg-warm-100/80 text-left"
                    >
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-warm-200/80 text-warm-600 text-sm font-medium flex items-center justify-center">
                        {letter}
                      </span>
                      <span className="text-warm-700 text-sm">{opt}</span>
                    </div>
                  );
                })}
              </CardContent>
              <div className="flex items-center justify-between px-5 py-4 border-t border-warm-200 bg-warm-100/60">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-warm-200/80 text-warm-700">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {q.category}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleAskAi(e, q)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Ask AI
                </button>
              </div>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-warm-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-warm-500">No questions match this filter</p>
          </div>
        )}
      </div>

      {/* Fixed Pagination */}
      {totalPages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#F8F8F7] border-t border-warm-200 shadow-lg">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  currentPage === 1
                    ? "text-warm-300 cursor-not-allowed"
                    : "text-warm-700 hover:bg-warm-100"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full font-medium text-sm transition-colors ${
                        currentPage === page
                          ? "bg-teal-600 text-white"
                          : "text-warm-600 hover:bg-warm-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  currentPage === totalPages
                    ? "text-warm-300 cursor-not-allowed"
                    : "text-warm-700 hover:bg-warm-100"
                }`}
              >
                Next
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen question modal */}
      {currentQuestion && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-[#F8F8F7]"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-warm-200 bg-[#F8F8F7] shrink-0">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="gap-2 min-h-10"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </Button>
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-teal-100 text-teal-700">
                {slug.toUpperCase()} Review
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-warm-200/80 text-warm-700">
                {currentQuestion.category}
              </span>
            </div>
            <span className="text-sm font-semibold tabular-nums text-warm-600">
              {selectedIndex! + 1} / {filteredQuestions.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={goPrev}
                disabled={selectedIndex === 0}
                className="h-10 w-10"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goNext}
                disabled={selectedIndex === filteredQuestions.length - 1}
                className="h-10 w-10"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
          <div className="flex-1 flex min-h-0">
            <div className="flex-1 min-w-0 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
                <h2 className="text-xl font-semibold text-warm-900 leading-relaxed mb-6">
                  {currentQuestion.question}
                </h2>
                <div className="space-y-3 mb-6">
                  {currentQuestion.options?.map((opt, idx) => {
                    const isCorrect = idx === currentQuestion.correctIndex;
                    const letter = OPTION_LETTERS[idx] ?? String(idx + 1);
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-4 rounded-xl px-4 py-4 border-2 ${
                          isCorrect
                            ? "bg-emerald-50 border-emerald-300"
                            : "bg-warm-50 border-warm-200"
                        }`}
                      >
                        <span
                          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                            isCorrect ? "bg-emerald-200 text-emerald-800" : "bg-warm-200 text-warm-600"
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="flex-1 text-warm-800">{opt}</span>
                        {isCorrect && (
                          <span className="text-emerald-600 font-medium text-sm">Correct</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {currentQuestion.explanation && (
                  <div className="rounded-xl border border-teal-200/80 bg-teal-50/60 p-4 mb-6">
                    <h3 className="text-sm font-semibold text-teal-800 mb-2">Explanation</h3>
                    <p className="text-teal-900/90 text-sm leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}
                <div className="flex justify-end mb-8">
                  <Button
                    variant="outline"
                    onClick={(e) => handleAskAi(e, currentQuestion)}
                    className="gap-2 border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Ask AI
                  </Button>
                </div>
                </div>
              </div>
              {/* Pagination at bottom of full view - shrink-0 so no extra space */}
              <div className="shrink-0 border-t border-warm-200 bg-[#F8F8F7] py-4">
                <div className="max-w-2xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goPrev()}
                      disabled={selectedIndex === 0}
                      className="gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </Button>
                    <div className="flex items-center gap-1 flex-wrap justify-center max-w-md overflow-x-auto py-1">
                      {filteredQuestions.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => goToQuestionByIndex(idx)}
                          className={`min-w-8 h-8 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                            selectedIndex === idx
                              ? "bg-teal-600 text-white"
                              : "bg-warm-100 text-warm-600 hover:bg-warm-200"
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goNext()}
                      disabled={selectedIndex === filteredQuestions.length - 1}
                      className="gap-1"
                    >
                      Next
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* Side chat panel */}
            {askAiOpen && (
              <div className="w-full sm:w-96 border-l border-warm-200 flex flex-col bg-[#F8F8F7] shrink-0">
                <div className="flex items-center justify-between px-4 py-3 border-b border-warm-200 bg-teal-50/50">
                  <div>
                    <h3 className="font-semibold text-warm-900">Ask AI</h3>
                    <p className="text-xs text-warm-500 mt-0.5 line-clamp-1">
                      Q{selectedIndex! + 1}: {currentQuestion.question.slice(0, 40)}…
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={closeAskAi} className="h-9 w-9">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                  {aiMessages.length === 0 && (
                    <p className="text-sm text-warm-500">
                      Ask anything about this question. Type below and press Ask.
                    </p>
                  )}
                  {aiMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl px-4 py-2 text-sm ${
                          msg.role === "user"
                            ? "bg-teal-600 text-white"
                            : "bg-teal-50 text-warm-800 border border-teal-100"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-xl px-4 py-2 text-sm bg-warm-100 text-warm-500">
                        Thinking…
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-warm-200">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Ask about this question..."
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          submitAskAi();
                        }
                      }}
                      className="min-h-12 resize-none"
                    />
                    <Button onClick={submitAskAi} disabled={aiLoading || !aiQuestion.trim()}>
                      Ask
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
