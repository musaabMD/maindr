"use client";

import { useState, useRef, useEffect } from "react";
/* ─── data ─── */
const QUESTIONS = [
  { id: 1, text: "A 58-year-old male presents with acute chest pain. ECG shows ST elevation in leads II, III, and aVF. Which coronary artery is most likely occluded?", options: ["Left anterior descending", "Right coronary artery", "Left circumflex", "Left main"], answer: 1, tag: "Cardiology" },
  { id: 2, text: "A 45-year-old woman with rheumatoid arthritis on methotrexate presents with dry cough and dyspnea. CXR shows bilateral interstitial infiltrates. Most likely diagnosis?", options: ["Bacterial pneumonia", "Methotrexate-induced pneumonitis", "Pulmonary embolism", "Congestive heart failure"], answer: 1, tag: "Rheumatology" },
  { id: 3, text: "A 32-year-old man presents with painless jaundice, weight loss, and a palpable non-tender gallbladder. Which eponym describes this sign?", options: ["Murphy's sign", "Courvoisier's sign", "Charcot's triad", "Reynolds' pentad"], answer: 1, tag: "Surgery" },
  { id: 4, text: "A 25-year-old woman presents with amenorrhea, galactorrhea, and bitemporal hemianopia. MRI shows a pituitary mass. First-line treatment?", options: ["Surgical resection", "Radiation therapy", "Dopamine agonist (cabergoline)", "Somatostatin analogue"], answer: 2, tag: "Endocrinology" },
  { id: 5, text: "A 70-year-old man has progressive ascending weakness, areflexia, and albuminocytologic dissociation on CSF analysis. Diagnosis?", options: ["Multiple sclerosis", "Myasthenia gravis", "Guillain-Barré syndrome", "Amyotrophic lateral sclerosis"], answer: 2, tag: "Neurology" },
  { id: 6, text: "A 4-year-old presents with periorbital edema, frothy urine, and hypoalbuminemia. Renal biopsy: normal light microscopy, foot process effacement on EM. Diagnosis?", options: ["FSGS", "Minimal change disease", "IgA nephropathy", "Membranous nephropathy"], answer: 1, tag: "Nephrology" },
  { id: 7, text: "A 55-year-old smoker has hyponatremia, inappropriately elevated urine osmolality, and a central lung mass on CT. Most likely paraneoplastic syndrome?", options: ["Ectopic ACTH → Cushing's", "SIADH from ectopic ADH", "PTHrP-mediated hypercalcemia", "Lambert-Eaton syndrome"], answer: 1, tag: "Oncology" },
  { id: 8, text: "A newborn has a continuous machinery-like murmur at the left infraclavicular area. First-line pharmacological treatment?", options: ["Aspirin", "Indomethacin", "Furosemide", "Digoxin"], answer: 1, tag: "Pediatrics" },
  { id: 9, text: "A 40-year-old woman has fatigue, weight gain, cold intolerance. TSH 12 mIU/L, low free T4, markedly elevated anti-TPO. Diagnosis?", options: ["Graves' disease", "De Quervain thyroiditis", "Hashimoto's thyroiditis", "Secondary hypothyroidism"], answer: 2, tag: "Endocrinology" },
  { id: 10, text: "A 28-year-old male has recurrent oral and genital ulcers, uveitis, and a positive pathergy test. Most likely diagnosis?", options: ["Systemic lupus erythematosus", "Behçet's disease", "Reiter's syndrome", "Crohn's disease"], answer: 1, tag: "Rheumatology" },
];

const TAG_COLOR: Record<string, string> = {
  Cardiology: "#ef4444",
  Rheumatology: "#8b5cf6",
  Surgery: "#f97316",
  Endocrinology: "#10b981",
  Neurology: "#3b82f6",
  Nephrology: "#14b8a6",
  Oncology: "#eab308",
  Pediatrics: "#ec4899",
};

const LETTERS = ["A", "B", "C", "D"];
const PER_PAGE = 5;

/* ─── helpers ─── */
function Bold({ text }: { text: string }) {
  if (!text) return null;
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : (
          p
        )
      )}
    </>
  );
}

function BookmarkIcon({ filled, color }: { filled: boolean; color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ChevronLeft() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>;
}
function ChevronRight() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>;
}
function SendIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
}
function SparkleIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>;
}

type QuestionItem = (typeof QUESTIONS)[number];

/* ══════════════════════════════════════════════════
   CHAT PANEL
══════════════════════════════════════════════════ */
function ChatPanel({ question, onClose }: { question: QuestionItem; onClose: () => void }) {
  const tagColor = TAG_COLOR[question.tag] ?? "#64748b";
  const [msgs, setMsgs] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: `I'll help you understand this **${question.tag}** question. The correct answer is **${question.options[question.answer]}**. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [onClose]);

  const systemPrompt = `You are a concise, expert medical educator. The student is reviewing:

"${question.text}"

Options:
${question.options.map((o, i) => `${LETTERS[i]}. ${o}`).join("\n")}

Correct: ${LETTERS[question.answer]}. ${question.options[question.answer]}

Answer clearly with **bold** for key terms. Be direct and educational.`;

  const send = async () => {
    const t = input.trim();
    if (!t || loading) return;
    const next = [...msgs, { role: "user" as const, content: t }];
    setMsgs([...next, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: systemPrompt,
          messages: next.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = res.status === 503 ? "AI not configured. Add ANTHROPIC_API_KEY to .env.local." : (data.error ?? "Request failed");
        throw new Error(msg);
      }
      const content = data.content ?? "No response.";
      setMsgs((prev) => {
        const rest = prev.slice(0, -1);
        return [...rest, { role: "assistant" as const, content }];
      });
    } catch {
      setMsgs((prev) => {
        const rest = prev.slice(0, -1);
        return [...rest, { role: "assistant" as const, content: "Something went wrong. Please try again." }];
      });
    }
    setLoading(false);
  };

  const quick = ["Why is this the correct answer?", "Why are the other options wrong?", "What's the key clinical pearl?"];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.25)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "flex-end" }}>
      <div
        ref={panelRef}
        style={{
          width: "min(420px,100vw)",
          height: "100dvh",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-2px 0 24px rgba(0,0,0,0.10)",
          animation: "slideIn .25s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: tagColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <SparkleIcon />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", fontFamily: "'Geist',system-ui,sans-serif" }}>AI Explanation</div>
            <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'Geist',system-ui,sans-serif", marginTop: 1 }}>{question.tag}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".06em", fontFamily: "'Geist',system-ui,sans-serif", marginBottom: 6 }}>Correct Answer</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "9px 12px" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#16a34a", color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✓</div>
            <span style={{ fontSize: 13, color: "#15803d", fontWeight: 600, fontFamily: "'Geist',system-ui,sans-serif" }}>{question.options[question.answer]}</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-start" }}>
              {m.role === "assistant" && (
                <div style={{ width: 28, height: 28, borderRadius: 8, background: tagColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <SparkleIcon />
                </div>
              )}
              <div
                style={{
                  maxWidth: "82%",
                  padding: "10px 14px",
                  borderRadius: m.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                  background: m.role === "user" ? "#0f172a" : "#f8fafc",
                  border: m.role === "user" ? "none" : "1px solid #e2e8f0",
                  fontSize: 13.5,
                  lineHeight: 1.7,
                  color: m.role === "user" ? "#fff" : "#1e293b",
                  fontFamily: "'Geist',system-ui,sans-serif",
                }}
              >
                {m.content ? (
                  <Bold text={m.content} />
                ) : (
                  <span style={{ display: "flex", gap: 4, alignItems: "center", height: 18 }}>
                    {[0, 0.18, 0.36].map((d, k) => (
                      <span key={k} style={{ width: 7, height: 7, borderRadius: "50%", background: "#cbd5e1", display: "inline-block", animation: `dot 1.1s ${d}s infinite` }} />
                    ))}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {msgs.length <= 1 && (
          <div style={{ padding: "0 16px 10px", display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
            {quick.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setInput(q);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "9px 14px", fontSize: 12.5, color: "#475569", fontWeight: 500, cursor: "pointer", textAlign: "left", fontFamily: "'Geist',system-ui,sans-serif", transition: "all .12s" }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0, background: "#fff" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask a follow-up…"
            rows={1}
            style={{ flex: 1, border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 14px", fontSize: 13.5, fontFamily: "'Geist',system-ui,sans-serif", color: "#0f172a", resize: "none", outline: "none", background: "#f8fafc", lineHeight: 1.5, transition: "border-color .15s" }}
          />
          <button
            type="button"
            onClick={send}
            disabled={!input.trim() || loading}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: input.trim() && !loading ? "#0f172a" : "#e2e8f0",
              border: "none",
              color: input.trim() && !loading ? "#fff" : "#94a3b8",
              cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all .15s",
            }}
          >
            <SendIcon />
          </button>
        </div>
      </div>

      <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}} @keyframes dot{0%,80%,100%{transform:scale(.5);opacity:.4}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   QUESTION CARD
══════════════════════════════════════════════════ */
function QuestionCard({
  q,
  num,
  index,
  bookmarked,
  onBookmark,
}: {
  q: QuestionItem;
  num: number;
  index: number;
  bookmarked: boolean;
  onBookmark: (id: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [chat, setChat] = useState(false);
  const tagColor = TAG_COLOR[q.tag] ?? "#64748b";
  const answered = selected !== null;
  const correct = selected === q.answer;

  const pick = (i: number) => {
    if (answered) return;
    setSelected(i);
  };

  return (
    <>
      <div className="qcard" style={{ animationDelay: `${index * 0.06}s` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".08em", fontFamily: "'Geist',system-ui,sans-serif" }}>Q{num}</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, background: `${tagColor}14`, color: tagColor, border: `1px solid ${tagColor}28`, fontFamily: "'Geist',system-ui,sans-serif", letterSpacing: ".03em" }}>{q.tag}</span>
          </div>
          <button
            type="button"
            onClick={() => onBookmark(q.id)}
            style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", flexShrink: 0 }}
          >
            <BookmarkIcon filled={bookmarked} color={bookmarked ? tagColor : "#94a3b8"} />
          </button>
        </div>

        <p style={{ fontFamily: "'Lora',Georgia,serif", fontSize: 15, lineHeight: 1.8, color: "#0f172a", marginBottom: 20, fontWeight: 400 }}>{q.text}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: answered ? 16 : 0 }}>
          {q.options.map((opt, i) => {
            const isCorrect = i === q.answer;
            const isChosen = i === selected;
            let state: "idle" | "correct" | "wrong" | "dim" = "idle";
            if (answered) state = isCorrect ? "correct" : isChosen ? "wrong" : "dim";

            const bg = state === "correct" ? "#f0fdf4" : state === "wrong" ? "#fef2f2" : state === "dim" ? "#fafafa" : "#fafafa";
            const border = state === "correct" ? "#86efac" : state === "wrong" ? "#fca5a5" : state === "dim" ? "#f1f5f9" : "#e2e8f0";
            const lblClr = state === "correct" ? "#15803d" : state === "wrong" ? "#dc2626" : "#334155";
            const letBg = state === "correct" ? "#dcfce7" : state === "wrong" ? "#fee2e2" : "#f1f5f9";
            const letClr = state === "correct" ? "#16a34a" : state === "wrong" ? "#dc2626" : "#64748b";
            const letBdr = state === "correct" ? "#86efac" : state === "wrong" ? "#fca5a5" : "#e2e8f0";

            return (
              <button
                key={i}
                type="button"
                onClick={() => pick(i)}
                disabled={answered}
                className="opt-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: bg,
                  border: `1.5px solid ${border}`,
                  borderRadius: 12,
                  padding: "11px 14px",
                  cursor: answered ? "default" : "pointer",
                  textAlign: "left",
                  width: "100%",
                  opacity: state === "dim" ? 0.45 : 1,
                  transition: "all .16s",
                }}
              >
                <span style={{ width: 28, height: 28, borderRadius: 8, background: letBg, border: `1.5px solid ${letBdr}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: letClr, flexShrink: 0, fontFamily: "'Geist',system-ui,sans-serif" }}>{LETTERS[i]}</span>
                <span style={{ flex: 1, fontSize: 13.5, color: lblClr, fontFamily: "'Geist',system-ui,sans-serif", fontWeight: state === "correct" ? 600 : 400, lineHeight: 1.5 }}>{opt}</span>
                {state === "correct" && <span style={{ color: "#16a34a", fontSize: 16, fontWeight: 800, flexShrink: 0 }}>✓</span>}
                {state === "wrong" && <span style={{ color: "#dc2626", fontSize: 16, fontWeight: 800, flexShrink: 0 }}>✕</span>}
              </button>
            );
          })}
        </div>

        {answered && (
          <>
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#15803d", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4, fontFamily: "'Geist',system-ui,sans-serif" }}>Correct answer</div>
              <div style={{ fontSize: 13.5, color: "#166534", fontWeight: 600, fontFamily: "'Geist',system-ui,sans-serif" }}>{q.options[q.answer]}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid #f1f5f9", marginTop: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, fontFamily: "'Geist',system-ui,sans-serif", background: correct ? "#dcfce7" : "#fee2e2", color: correct ? "#16a34a" : "#dc2626" }}>
                {correct ? "✓ Correct" : "✕ Incorrect"}
              </span>
              <button
              type="button"
              onClick={() => setChat(true)}
              className="explain-btn"
              style={{ display: "flex", alignItems: "center", gap: 6, background: "#0f172a", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Geist',system-ui,sans-serif", transition: "all .15s" }}
            >
              <SparkleIcon /> Explain
            </button>
            </div>
          </>
        )}
      </div>

      {chat && <ChatPanel question={q} onClose={() => setChat(false)} />}
    </>
  );
}

/* ══════════════════════════════════════════════════
   QUESTIONS TAB CLIENT
══════════════════════════════════════════════════ */
interface QuestionsTabClientProps {
  slug: string;
  meta: { name: string; subjects: string[] };
}

export function QuestionsTabClient({ slug, meta }: QuestionsTabClientProps) {
  const [page, setPage] = useState(1);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const total = Math.ceil(QUESTIONS.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const slice = QUESTIONS.slice(start, start + PER_PAGE);

  const go = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const toggleBookmark = (id: number) => {
    setBookmarks((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#ffffff", paddingBottom: 90 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&family=Geist:wght@400;500;600;700&display=swap');
        .qcard{background:#fff;border:1.5px solid #e2e8f0;border-radius:18px;padding:22px;box-shadow:0 1px 3px rgba(0,0,0,.03),0 4px 16px rgba(0,0,0,.04);animation:up .4s cubic-bezier(.16,1,.3,1) both;transition:box-shadow .2s,border-color .2s}
        .qcard:hover{box-shadow:0 2px 8px rgba(0,0,0,.05),0 8px 28px rgba(0,0,0,.07);border-color:#cbd5e1}
        @keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .opt-btn:not(:disabled):hover{background:#f0f9ff!important;border-color:#bae6fd!important;transform:translateX(2px)}
        .explain-btn:hover{background:#1e293b!important;transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,.15)}
        @media(max-width:480px){.qcard{padding:16px 14px}}
      `}</style>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {slice.map((q, i) => (
            <QuestionCard
              key={`${slug}-${page}-${q.id}`}
              q={q}
              num={start + i + 1}
              index={i}
              bookmarked={bookmarks.has(q.id)}
              onBookmark={toggleBookmark}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid #e2e8f0",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 500,
          maxWidth: "100vw",
        }}
      >
        <button
          type="button"
          onClick={() => page > 1 && go(page - 1)}
          disabled={page === 1}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: 10,
            border: "1.5px solid #e2e8f0",
            background: page === 1 ? "#f1f5f9" : "#fff",
            color: page === 1 ? "#cbd5e1" : "#334155",
            fontSize: 13,
            fontWeight: 600,
            cursor: page === 1 ? "default" : "pointer",
            fontFamily: "'Geist',system-ui,sans-serif",
            transition: "all .15s",
          }}
        >
          <ChevronLeft /> Back
        </button>

        <span style={{ fontSize: 14, fontWeight: 600, color: "#64748b", fontFamily: "'Geist',system-ui,sans-serif", letterSpacing: ".02em" }}>
          <span style={{ color: "#0f172a" }}>{page}</span>
          <span style={{ margin: "0 4px", color: "#cbd5e1" }}>/</span>
          {total}
        </span>

        <button
          type="button"
          onClick={() => page < total && go(page + 1)}
          disabled={page === total}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: 10,
            border: "1.5px solid #e2e8f0",
            background: page === total ? "#f1f5f9" : "#0f172a",
            color: page === total ? "#cbd5e1" : "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: page === total ? "default" : "pointer",
            fontFamily: "'Geist',system-ui,sans-serif",
            transition: "all .15s",
          }}
        >
          Next <ChevronRight />
        </button>
      </div>
    </div>
  );
}
