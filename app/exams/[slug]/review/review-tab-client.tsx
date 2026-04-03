"use client";

import { useState, useCallback, useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Bot, Send, X, HelpCircle, MessageSquare, Search } from "lucide-react";

type ReviewQuestion = {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  userIndex: number; // index of user's selected answer (for correct/incorrect highlighting)
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
    userIndex: 0,
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
    userIndex: 1,
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
    userIndex: 1,
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
    userIndex: 3,
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
    userIndex: 1,
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
    userIndex: 1,
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
    userIndex: 0,
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
    userIndex: 1,
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
    userIndex: 2,
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
    userIndex: 0,
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
    userIndex: 0,
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
    userIndex: 2,
    status: "incorrect",
    flagged: false,
    explanation:
      "NFPA 472 covers the competencies for responders to hazardous materials incidents.",
  },
];

function ExplainChatPanel({
  question,
  onClose,
}: {
  question: ReviewQuestion;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    {
      role: "ai",
      text: "Hi! I can help you understand this question better. Ask me anything about it.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const correctAnswer = question.options[question.correctIndex];
  const systemPrompt = `You are a helpful exam tutor for fire safety and building codes. The student is reviewing this question: "${question.question}". Correct answer: ${correctAnswer}. Explanation: ${question.explanation ?? "N/A"}. Answer clearly and concisely in 2-4 sentences.`;

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newMessages = [...messages, { role: "user" as const, text: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: systemPrompt,
          messages: newMessages.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg =
          res.status === 503
            ? "AI not configured. Add ANTHROPIC_API_KEY to .env.local."
            : data.error ?? "Request failed";
        throw new Error(msg);
      }
      setMessages([
        ...newMessages,
        { role: "ai", text: data.content ?? "No response." },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "ai", text: "Failed to connect. Please try again." },
      ]);
    }
    setLoading(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col border-l border-warm-200 animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-label="Chat with AI about this question"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-warm-200 shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-violet-600" strokeWidth={2} />
            <h3 className="text-sm font-semibold text-warm-800">Ask AI</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-warm-100 text-warm-500 hover:bg-warm-200 hover:text-warm-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-warm-200 shrink-0">
          <div className="rounded-lg bg-warm-50 p-3 text-xs text-warm-600 leading-relaxed">
            <span className="font-semibold text-warm-700">Q: </span>
            {question.question.length > 90
              ? question.question.slice(0, 90) + "…"
              : question.question}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-3 py-2.5 rounded-xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-neutral-800 text-white rounded-br-md"
                    : "bg-warm-100 text-warm-900 rounded-bl-md"
                }`}
              >
                {msg.role === "ai" && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Bot className="w-3 h-3 text-violet-600" strokeWidth={2} />
                    <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wide">
                      AI Tutor
                    </span>
                  </div>
                )}
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-3 py-2.5 rounded-xl rounded-bl-md bg-warm-100 text-warm-500 text-sm">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Bot className="w-3 h-3 text-violet-600" strokeWidth={2} />
                  <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wide">
                    AI Tutor
                  </span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((n) => (
                    <span
                      key={n}
                      className="w-1.5 h-1.5 rounded-full bg-warm-400 animate-pulse"
                      style={{ animationDelay: `${(n - 1) * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-warm-200 shrink-0 flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about this question…"
            className="flex-1 px-3 py-2.5 text-sm font-inherit border border-warm-200 rounded-lg bg-warm-50 text-warm-900 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center transition-colors ${
              input.trim()
                ? "bg-neutral-800 text-white hover:bg-neutral-900 cursor-pointer"
                : "bg-warm-200 text-warm-400 cursor-default"
            }`}
          >
            <Send className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </aside>
    </>
  );
}

interface ReviewTabClientProps {
  slug: string;
  meta: { name: string; subjects: string[] };
}

const FILTERS = ["All", "Flagged", "Incorrect", "Correct"] as const;

export function ReviewTabClient({ slug, meta }: ReviewTabClientProps) {
  const { isMobile, state } = useSidebar();
  const [questions, setQuestions] = useState(reviewData);
  const [activeFilter, setActiveFilter] = useState<typeof FILTERS[number]>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [explainChatOpen, setExplainChatOpen] = useState(false);
  const labels = ["A", "B", "C", "D"];

  const counts = {
    All: questions.length,
    Flagged: questions.filter((q) => q.flagged).length,
    Incorrect: questions.filter((q) => q.status === "incorrect").length,
    Correct: questions.filter((q) => q.status === "correct").length,
  };

  const filteredQuestions = questions.filter((q) => {
    const s = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      q.question.toLowerCase().includes(s) ||
      q.category.toLowerCase().includes(s);
    if (!matchesSearch) return false;
    if (activeFilter === "All") return true;
    if (activeFilter === "Flagged") return q.flagged;
    if (activeFilter === "Incorrect") return q.status === "incorrect";
    if (activeFilter === "Correct") return q.status === "correct";
    return true;
  });

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

  useEffect(() => {
    setExplainChatOpen(false);
  }, [selectedIndex]);

  const goToQuestionByIndex = (idx: number) => {
    if (idx >= 0 && idx < filteredQuestions.length) setSelectedIndex(idx);
  };

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-24">
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap"
        rel="stylesheet"
      />

      <div className="max-w-[720px] mx-auto px-5 py-8 pb-16" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* Filters + Search */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border-none text-[13px] font-medium cursor-pointer transition-all duration-150 ${
                activeFilter === f
                  ? "bg-neutral-900 text-white"
                  : "bg-[#F3F3F3] text-[#888] hover:bg-[#E8E8E8] hover:text-[#555]"
              }`}
            >
              {f}
              <span className={activeFilter === f ? "opacity-60" : "opacity-50 text-[11px] font-semibold"}>
                {counts[f]}
              </span>
            </button>
          ))}
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#BBB] pointer-events-none" strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[220px] pl-9 pr-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-[13px] text-[#1A1A1A] outline-none transition-[border-color] focus:border-[#999] placeholder:text-[#BBB]"
            />
          </div>
        </div>

        {/* Question cards */}
        <div className="flex flex-col gap-2.5">
          {filteredQuestions.length === 0 && (
            <div className="text-center py-16 text-[13px] text-[#BBB]">
              No questions found
            </div>
          )}

          {filteredQuestions.map((q, i) => {
            const isCorrect = q.status === "correct";
            return (
              <div
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
                className="bg-white border border-[#D8DEE4] rounded-xl px-5 py-4.5 transition-[border-color,box-shadow] hover:border-[#B8C0CA] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-200"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <span className="text-[13.5px] font-normal text-[#5A7080] leading-snug">
                    {q.category}
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => toggleFlag(q.id, e)}
                      title="Flag question"
                      className={`w-7 h-7 rounded-md border-none bg-transparent cursor-pointer flex items-center justify-center transition-all duration-150 ${
                        q.flagged
                          ? "text-[#4A7C9B] bg-[#EDF3F8]"
                          : "text-[#C0C8D0] hover:text-[#8A9AAA] hover:bg-[#F0F2F5]"
                      }`}
                      aria-label={q.flagged ? "Unflag question" : "Flag question"}
                    >
                      <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill={q.flagged ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                        <circle cx="12" cy="10" r="2" fill={q.flagged ? "#fff" : "none"} />
                        <path d="M12 14v2" strokeLinecap="round" />
                      </svg>
                    </button>
                    {isCorrect ? (
                      <svg className="w-5 h-5 text-[#3BA55D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-[#D94040]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    )}
                  </div>
                </div>
                <p className="text-[15.5px] leading-relaxed text-[#1A2530] font-normal">
                  {q.question}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full-screen question modal — above app header so Upgrade/Sign in/Sign up are hidden */}
      {currentQuestion && (
        <div
          className="fixed inset-0 z-[200] flex flex-col bg-background"
          role="dialog"
          aria-modal="true"
        >
          {/* Header — clean, minimal */}
          <header className="flex items-center justify-between px-4 sm:px-6 h-14 shrink-0 bg-card border-b border-border z-20">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={closeModal}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-warm-500 hover:bg-warm-100 hover:text-warm-700 transition-colors shrink-0"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider truncate">
                {slug} Review
              </span>
              <span className="hidden sm:inline text-sm text-warm-500 truncate">· {currentQuestion.category}</span>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 flex items-baseline gap-1">
              <span className="text-sm font-semibold text-warm-900">
                {selectedIndex! + 1}
              </span>
              <span className="text-sm text-warm-500">/ {filteredQuestions.length}</span>
            </div>

            <div className="flex items-center gap-2 min-w-0 justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-neutral-800 text-white hover:bg-neutral-900 transition-colors shrink-0"
              >
                Done
              </button>
            </div>
          </header>

          {/* Progress bar — subtle */}
          <div className="h-0.5 bg-warm-200 shrink-0">
            <div
              className="h-full bg-neutral-700 transition-all duration-300 ease-out"
              style={{ width: `${((selectedIndex! + 1) / filteredQuestions.length) * 100}%` }}
            />
          </div>

          {/* Body: question area — compact card */}
          <div className="flex-1 flex overflow-hidden min-h-0">
            <main className="flex-1 overflow-y-auto flex flex-col min-h-0">
              <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24">
                <div className="flex flex-col bg-white rounded-[14px] border border-warm-200 overflow-hidden shadow-sm">
                  {/* Card top row — Question badge */}
                  <div className="pt-4 sm:pt-5 px-4 sm:px-6 flex items-start justify-between shrink-0">
                    <div className="inline-flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-md">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" strokeWidth={2.5} />
                      <span className="text-xs font-bold text-amber-600">
                        Question
                      </span>
                    </div>
                  </div>

                  {/* Question text */}
                  <div className="pt-2 px-4 sm:px-6">
                    <p className="text-[17px] sm:text-lg font-semibold text-warm-900 leading-relaxed">
                      {currentQuestion.question}
                    </p>
                  </div>

                  {/* Options — styled buttons like ExamReview */}
                  <div className="pt-2.5 px-4 sm:px-6 flex flex-col gap-2">
                    {currentQuestion.options.map((opt, i) => {
                      const isCorrect = i === currentQuestion.correctIndex;
                      const isUser = i === currentQuestion.userIndex;
                      const isWrong = isUser && !isCorrect;
                      const isRight = isCorrect;

                      let bg = "bg-warm-50";
                      let border = "border-warm-200";
                      let textColor = "text-warm-800";
                      let badgeBg = "bg-warm-100";
                      let badgeColor = "text-warm-600";

                      if (isRight) {
                        bg = "bg-emerald-50";
                        border = "border-emerald-200";
                        textColor = "text-emerald-800";
                        badgeBg = "bg-emerald-100";
                        badgeColor = "text-emerald-600";
                      } else if (isWrong) {
                        bg = "bg-red-50";
                        border = "border-red-200";
                        textColor = "text-red-800";
                        badgeBg = "bg-red-100";
                        badgeColor = "text-red-600";
                      }

                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-3 rounded-[10px] border px-4 py-3 transition-colors ${bg} ${border} ${textColor}`}
                        >
                          <span
                            className={`w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold shrink-0 ${badgeBg} ${badgeColor}`}
                          >
                            {labels[i]}
                          </span>
                          <span className="flex-1 text-[15px] sm:text-base font-medium">
                            {opt}
                          </span>
                          {isRight && (
                            <span className="text-sm font-bold text-emerald-600 shrink-0">
                              ✓ Correct
                            </span>
                          )}
                          {isWrong && (
                            <span className="text-sm font-bold text-red-600 shrink-0">
                              ✗ Wrong
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {currentQuestion.explanation && (
                    <div className="mt-3 mx-4 sm:mx-6">
                      <div className="p-4 rounded-[10px] bg-warm-50 border border-warm-200">
                        <p className="text-sm font-bold text-warm-500 uppercase tracking-wider mb-2">
                          Explanation
                        </p>
                        <p className="text-[15px] sm:text-base text-warm-700 leading-relaxed">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Footer — Explain button bottom right */}
                  <div className="pt-3 px-4 sm:px-6 pb-4 flex justify-end border-t border-warm-100 mt-2">
                    <button
                      type="button"
                      onClick={() => setExplainChatOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-neutral-800 text-white hover:bg-neutral-900 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" strokeWidth={2} />
                      Explain
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>

          {/* Explain — side chat panel with AI */}
          {explainChatOpen && (
            <ExplainChatPanel
              question={currentQuestion}
              onClose={() => setExplainChatOpen(false)}
            />
          )}

          {/* Footer — Prev / Question counter / Next — full-width bar */}
          <footer
            className="fixed inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 rounded-t-2xl border border-b-0 border-warm-200 bg-card px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] sm:px-6 sm:py-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
          >
            <button
              type="button"
              onClick={() => goPrev()}
              disabled={selectedIndex === 0}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-xl border border-warm-200 bg-white px-4 py-2.5 text-sm font-semibold text-warm-800 shadow-sm transition-colors hover:border-warm-300 hover:bg-warm-50 active:bg-warm-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-warm-200 sm:min-h-0 sm:min-w-0"
            >
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex flex-1 flex-col items-center justify-center gap-0.5 sm:flex-row sm:gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-warm-500">
                Question
              </span>
              <span className="text-base font-bold tabular-nums text-warm-900 sm:text-lg">
                {selectedIndex! + 1}
                <span className="font-normal text-warm-500"> / {filteredQuestions.length}</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => goNext()}
              disabled={selectedIndex === filteredQuestions.length - 1}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-xl border border-warm-200 bg-white px-4 py-2.5 text-sm font-semibold text-warm-800 shadow-sm transition-colors hover:border-warm-300 hover:bg-warm-50 active:bg-warm-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-warm-200 sm:min-h-0 sm:min-w-0"
            >
              <span className="hidden sm:inline">Next</span>
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </footer>
        </div>
      )}

    </div>
  );
}
