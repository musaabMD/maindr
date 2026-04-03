"use client";

import { useMemo, useState } from "react";
import { ExamTabToolbar } from "@/components/exams/exam-tab-toolbar";
import { QuestionUI, ExamResults, ExamFullscreen } from "@/components/exams/mock-exam";

interface StudyTabClientProps {
  slug: string;
  meta: { name: string; subjects: string[] };
}

type SortMode = "date" | "subject";

interface StudySet {
  id: string;
  title: string;
  subject: string;
  questions: number;
  progress: number;
  lastModified: string;
  pinned: boolean;
}

const MOCK_STUDY_SETS: StudySet[] = [
  {
    id: "1",
    title: "Cell Biology: Mitosis & Meiosis",
    subject: "Basic Sciences",
    questions: 55,
    progress: 92,
    lastModified: "Jan 7, 2026",
    pinned: true,
  },
  {
    id: "2",
    title: "Calculus: Derivatives & Integrals",
    subject: "Basic Sciences",
    questions: 42,
    progress: 87,
    lastModified: "Feb 1, 2025",
    pinned: true,
  },
  {
    id: "3",
    title: "Quantum Mechanics Basics",
    subject: "Basic Sciences",
    questions: 38,
    progress: 33,
    lastModified: "Mar 1, 2026",
    pinned: false,
  },
  {
    id: "4",
    title: "Linear Algebra: Matrices",
    subject: "Basic Sciences",
    questions: 28,
    progress: 48,
    lastModified: "Feb 18, 2026",
    pinned: false,
  },
  {
    id: "5",
    title: "Photosynthesis & Respiration",
    subject: "Basic Sciences",
    questions: 31,
    progress: 83,
    lastModified: "Feb 10, 2026",
    pinned: false,
  },
  {
    id: "6",
    title: "Clinical Pharmacology",
    subject: "Clinical Sciences",
    questions: 67,
    progress: 71,
    lastModified: "Feb 5, 2026",
    pinned: false,
  },
  {
    id: "7",
    title: "Internal Medicine: Cardiology",
    subject: "Medicine",
    questions: 89,
    progress: 56,
    lastModified: "Jan 28, 2026",
    pinned: false,
  },
];

/** Score bands: red = needs focus, amber = borderline, green = solid */
const scoreColor = (s: number) => {
  if (s === 0) return "#cbd5e1";
  if (s < 50) return "#e11d48";
  if (s < 70) return "#d97706";
  if (s < 85) return "#059669";
  return "#047857";
};

function PinIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? "#374151" : "none"}
      stroke={filled ? "#374151" : "#6B7280"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
    </svg>
  );
}

function StartModal({
  item,
  onClose,
  onStart,
}: {
  item: StudySet | null;
  onClose: () => void;
  onStart: (item: StudySet) => void;
}) {
  if (!item) return null;
  const color = scoreColor(item.progress);
  const notStarted = item.progress === 0;
  const correct = Math.round((item.progress * item.questions) / 100);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        backdropFilter: "blur(3px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: "32px 32px 28px",
          width: 400,
          boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
          border: "1.5px solid #D1D5DB",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#6B7280",
            textTransform: "uppercase",
            letterSpacing: 0.9,
            marginBottom: 6,
          }}
        >
          {item.subject}
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#111827",
            marginBottom: 24,
            lineHeight: 1.35,
          }}
        >
          {item.title}
        </div>

        <div
          style={{
            display: "flex",
            gap: 0,
            marginBottom: 20,
            borderRadius: 10,
            overflow: "hidden",
            border: "1.5px solid #D1D5DB",
          }}
        >
          {[
            { label: "Questions", val: item.questions, color: "#111827" },
            {
              label: "Score",
              val: notStarted ? "—" : `${item.progress}%`,
              color: notStarted ? "#9CA3AF" : color,
            },
            ...(!notStarted
              ? [
                  {
                    label: "Correct",
                    val: `${correct}/${item.questions}`,
                    color: "#111827",
                  },
                ]
              : []),
          ].map((s, i, arr) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                padding: "14px 16px",
                textAlign: "center",
                borderRight:
                  i < arr.length - 1 ? "1.5px solid #D1D5DB" : "none",
                background: "#F9FAFB",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#6B7280",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.7,
                  marginBottom: 4,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: s.color,
                  letterSpacing: -0.5,
                }}
              >
                {s.val}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "#E5E7EB",
            borderRadius: 99,
            height: 8,
            marginBottom: 24,
            overflow: "hidden",
            border: "1px solid #D1D5DB",
          }}
        >
          <div
            style={{
              width: `${item.progress}%`,
              height: "100%",
              borderRadius: 99,
              background: color,
              transition: "width 0.5s ease",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 9,
              border: "1.5px solid #D1D5DB",
              background: "#fff",
              fontSize: 13.5,
              fontWeight: 600,
              color: "#374151",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onStart(item)}
            style={{
              flex: 2,
              padding: "11px 0",
              borderRadius: 9,
              border: "none",
              background: "var(--primary)",
              fontSize: 13.5,
              fontWeight: 600,
              color: "var(--primary-foreground)",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {notStarted ? "Start" : "Retake"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StudyCard({
  item,
  index,
  onTogglePin,
  isLast,
  onSelect,
  showSubject,
  pinned,
}: {
  item: StudySet;
  index: number;
  onTogglePin: (id: string) => void;
  isLast: boolean;
  onSelect: (item: StudySet) => void;
  showSubject: boolean;
  pinned: boolean;
}) {
  const notStarted = item.progress === 0;
  const color = scoreColor(item.progress);
  const [hovered, setHovered] = useState(false);
  const correct = Math.round((item.progress * item.questions) / 100);

  return (
    <div
      onClick={() => onSelect(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex items-center gap-2 sm:gap-4 py-2.5 px-3 sm:py-4 sm:px-6 border-b border-gray-200 last:border-b-0 transition-colors cursor-pointer ${
        hovered ? "bg-gray-50" : "bg-white"
      }`}
    >
      <span className="shrink-0 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded bg-primary text-[11px] font-bold text-primary-foreground sm:text-xs">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] sm:text-base font-semibold text-gray-900 truncate leading-tight">
          {item.title}
        </div>
        {showSubject && (
          <div className="text-[11px] text-gray-500 mt-0.5 truncate">{item.subject}</div>
        )}
      </div>
      <div className="shrink-0 flex items-center gap-1 sm:gap-2 whitespace-nowrap">
        <span className="text-[11px] sm:text-sm font-medium text-gray-600 tabular-nums">
          {notStarted ? (
            <span className="text-gray-400">{item.questions}Q</span>
          ) : (
            `${correct}/${item.questions}`
          )}
        </span>
        <span
          className="text-xs sm:text-sm font-bold tabular-nums min-w-[2.5rem] text-right"
          style={{ color: notStarted ? "#9CA3AF" : color }}
        >
          {notStarted ? "—" : `${item.progress}%`}
        </span>
      </div>
      <div className="hidden sm:block flex-1 min-w-[80px] max-w-[140px] h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${item.progress}%`, background: color }}
        />
      </div>
      <div className="sm:hidden w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden shrink-0">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${item.progress}%`, background: color }}
        />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin(item.id);
        }}
        className="shrink-0 p-1 rounded border border-gray-300 hover:border-gray-500 transition-colors"
      >
        <PinIcon filled={pinned} />
      </button>
    </div>
  );
}

function CardContainer({
  items,
  showSubject,
  onTogglePin,
  onSelect,
  pinnedIds,
}: {
  items: StudySet[];
  showSubject: boolean;
  onTogglePin: (id: string) => void;
  onSelect: (item: StudySet) => void;
  pinnedIds: Set<string>;
}) {
  if (items.length === 0)
    return (
      <div
        style={{
          textAlign: "center",
          color: "#9CA3AF",
          padding: "52px 0",
          fontSize: 13.5,
        }}
      >
        No study sets found.
      </div>
    );
  return (
    <div className="-mx-3 sm:mx-0">
      <div
        className="rounded-2xl border border-warm-200 bg-white shadow-sm overflow-hidden"
      >
        {items.map((item, i) => (
        <StudyCard
          key={item.id}
          item={item}
          index={i}
          onTogglePin={onTogglePin}
          isLast={i === items.length - 1}
          onSelect={onSelect}
          showSubject={showSubject}
          pinned={pinnedIds.has(item.id)}
        />
      ))}
      </div>
    </div>
  );
}

type ExamView = "exam" | "results" | null;

export function StudyTabClient({ slug, meta }: StudyTabClientProps) {
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("date");
  const [selected, setSelected] = useState<StudySet | null>(null);
  const [examView, setExamView] = useState<ExamView>(null);
  const [examStudySet, setExamStudySet] = useState<StudySet | null>(null);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(
    () => new Set(MOCK_STUDY_SETS.filter((s) => s.pinned).map((s) => s.id))
  );

  const handleStartExam = (item: StudySet) => {
    setSelected(null);
    setExamStudySet(item);
    setExamView("exam");
  };

  const handleExamSubmit = () => {
    setExamView("results");
  };

  const handleReturnFromResults = () => {
    setExamView(null);
    setExamStudySet(null);
  };

  const togglePin = (id: string) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredAndSorted = useMemo(() => {
    let list = MOCK_STUDY_SETS.filter(
      (s) =>
        !search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.subject.toLowerCase().includes(search.toLowerCase())
    );
    if (sortMode === "date") {
      list = [...list].sort(
        (a, b) =>
          new Date(b.lastModified).getTime() -
          new Date(a.lastModified).getTime()
      );
    } else {
      list = [...list].sort((a, b) =>
        a.subject.localeCompare(b.subject, undefined, { sensitivity: "base" })
      );
    }
    list.sort((a, b) => {
      const aPinned = pinnedIds.has(a.id);
      const bPinned = pinnedIds.has(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
    return list;
  }, [search, sortMode, pinnedIds]);

  const pinnedCount = pinnedIds.size;

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      `}</style>

      <StartModal
        item={selected}
        onClose={() => setSelected(null)}
        onStart={handleStartExam}
      />

      {examView === "exam" && (
        <QuestionUI
          examTitle={examStudySet?.title ?? "Study Set"}
          timeLimit={600}
          onSubmitExam={handleExamSubmit}
        />
      )}

      {examView === "results" && (
        <ExamFullscreen isActive>
          <ExamResults onReturnToMenu={handleReturnFromResults} />
        </ExamFullscreen>
      )}

      <ExamTabToolbar
        sortTabs={[
          { value: "date", label: "By Date" },
          { value: "subject", label: "By Subject" },
        ]}
        sortMode={sortMode}
        onSortChange={(v) => setSortMode(v as SortMode)}
        searchPlaceholder="Search sets or subjects…"
        searchValue={search}
        onSearchChange={setSearch}
      />

      <main className="mx-auto max-w-[1200px] w-full px-3 py-4 sm:px-6 sm:py-10 md:px-10 md:py-12">
        <CardContainer
          items={filteredAndSorted}
          showSubject={sortMode === "subject"}
          onTogglePin={togglePin}
          onSelect={setSelected}
          pinnedIds={pinnedIds}
        />
      </main>
    </div>
  );
}
