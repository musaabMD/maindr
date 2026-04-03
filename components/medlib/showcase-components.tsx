"use client";

import { useState } from "react";
import {
  C,
  Badge,
  Tag,
  ProgressBar,
  CircleProgress,
  SectionLabel,
  Card,
} from "./tokens-and-primitives";

// ─── 1. QUESTION CARD (Full Screen) ──────────────────────────────────────────
export function QuestionCardShowcase() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correct = 1;
  const opts = [
    "Aortic stenosis",
    "Mitral regurgitation",
    "Hypertrophic cardiomyopathy",
    "Tricuspid stenosis",
  ];
  const getBorder = (i: number) => {
    if (!revealed)
      return selected === i ? `2px solid ${C.primary}` : `1.5px solid ${C.slate200}`;
    if (i === correct) return `2px solid ${C.green}`;
    if (i === selected && i !== correct) return `2px solid ${C.red}`;
    return `1.5px solid ${C.slate200}`;
  };
  const getBg = (i: number) => {
    if (!revealed) return selected === i ? C.primaryLight : C.white;
    if (i === correct) return C.greenLight;
    if (i === selected && i !== correct) return C.redLight;
    return C.white;
  };
  return (
    <div
      style={{
        background: C.slate50,
        borderRadius: 20,
        border: `1.5px solid ${C.slate200}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: C.white,
          borderBottom: `1.5px solid ${C.slate200}`,
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 800, color: C.slate800, fontSize: 14 }}>
            Q 14
          </span>
          <span style={{ color: C.slate400, fontSize: 13 }}>/&nbsp;40</span>
          <Badge color="blue">Cardiology</Badge>
          <Badge color="slate">Step 2 CK</Badge>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            style={{
              border: `1.5px solid ${C.slate200}`,
              borderRadius: 8,
              background: C.white,
              color: C.slate600,
              padding: "5px 14px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            ⚑ Flag
          </button>
          <button
            type="button"
            style={{
              border: `1.5px solid ${C.slate200}`,
              borderRadius: 8,
              background: C.white,
              color: C.slate600,
              padding: "5px 14px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            🔖 Notes
          </button>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: 440,
        }}
      >
        <div
          style={{
            padding: 28,
            borderRight: `1.5px solid ${C.slate200}`,
          }}
        >
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.75,
              color: C.slate700,
              marginBottom: 24,
            }}
          >
            A <strong>62-year-old man</strong> presents with progressive
            exertional dyspnea and occasional syncope over 6 months. On exam,
            there is a{" "}
            <strong>harsh systolic crescendo-decrescendo murmur</strong> heard
            best at the right upper sternal border radiating to the carotids.
            Blood pressure is 110/80 mmHg with a narrow pulse pressure. Carotid
            upstroke is diminished and delayed (
            <em>pulsus parvus et tardus</em>).
          </p>
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.slate800,
              marginBottom: 16,
            }}
          >
            What is the most likely diagnosis?
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {opts.map((o, i) => (
              <button
                key={i}
                type="button"
                onClick={() => !revealed && setSelected(i)}
                style={{
                  textAlign: "left",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: getBorder(i),
                  background: getBg(i),
                  color: C.slate700,
                  fontSize: 14,
                  cursor: revealed ? "default" : "pointer",
                  transition: "all .15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    border: `1.5px solid ${
                      revealed && i === correct ? C.green : C.slate300
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: revealed && i === correct ? C.green : C.slate500,
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                {o}
                {revealed && i === correct && (
                  <span
                    style={{
                      marginLeft: "auto",
                      color: C.green,
                      fontSize: 18,
                    }}
                  >
                    ✓
                  </span>
                )}
                {revealed && i === selected && i !== correct && (
                  <span
                    style={{
                      marginLeft: "auto",
                      color: C.red,
                      fontSize: 18,
                    }}
                  >
                    ✗
                  </span>
                )}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            {!revealed ? (
              <button
                type="button"
                onClick={() => selected !== null && setRevealed(true)}
                disabled={selected === null}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 10,
                  border: "none",
                  background: selected !== null ? C.primary : C.slate200,
                  color: selected !== null ? C.white : C.slate400,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: selected !== null ? "pointer" : "default",
                }}
              >
                Submit Answer
              </button>
            ) : (
              <>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    borderRadius: 10,
                    border: `1.5px solid ${C.slate200}`,
                    background: C.white,
                    color: C.slate700,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    borderRadius: 10,
                    border: "none",
                    background: C.primary,
                    color: C.white,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Next →
                </button>
              </>
            )}
          </div>
        </div>
        <div
          style={{
            padding: 28,
            background: revealed ? C.white : C.slate50,
            transition: "background .3s",
          }}
        >
          {!revealed ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                color: C.slate400,
              }}
            >
              <div style={{ fontSize: 40 }}>🔒</div>
              <p style={{ fontSize: 14, textAlign: "center" }}>
                Submit your answer to unlock the explanation
              </p>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    background: C.greenLight,
                    color: C.green,
                    fontSize: 13,
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: 8,
                  }}
                >
                  ✓ Correct — Aortic Stenosis
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.8,
                  color: C.slate700,
                  marginBottom: 14,
                }}
              >
                <strong>Aortic stenosis</strong> classically presents with the
                triad of <em>angina, syncope, and heart failure</em>. The harsh
                crescendo-decrescendo systolic murmur radiating to the carotids,
                narrow pulse pressure, and pulsus parvus et tardus are
                hallmarks.
              </p>
              <div
                style={{
                  background: C.primaryLight,
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 14,
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.primary,
                    marginBottom: 6,
                  }}
                >
                  HIGH-YIELD BUZZWORDS
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {[
                    "Pulsus parvus et tardus",
                    "Right sternal border",
                    "Carotid radiation",
                    "Narrow pulse pressure",
                  ].map((t) => (
                    <Tag key={t} label={t} />
                  ))}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  style={{
                    border: `1.5px solid ${C.slate200}`,
                    borderRadius: 8,
                    background: C.white,
                    padding: "6px 14px",
                    fontSize: 12,
                    cursor: "pointer",
                    color: C.slate600,
                  }}
                >
                  📚 Linked Resource
                </button>
                <button
                  type="button"
                  style={{
                    border: `1.5px solid ${C.slate200}`,
                    borderRadius: 8,
                    background: C.white,
                    padding: "6px 14px",
                    fontSize: 12,
                    cursor: "pointer",
                    color: C.slate600,
                  }}
                >
                  📊 Stats
                </button>
                <button
                  type="button"
                  style={{
                    border: `1.5px solid ${C.slate200}`,
                    borderRadius: 8,
                    background: C.white,
                    padding: "6px 14px",
                    fontSize: 12,
                    cursor: "pointer",
                    color: C.slate600,
                  }}
                >
                  ✏️ Add Note
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div
        style={{
          background: C.white,
          borderTop: `1.5px solid ${C.slate200}`,
          padding: "10px 24px",
        }}
      >
        <ProgressBar value={35} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <span style={{ fontSize: 11, color: C.slate400 }}>
            14 of 40 answered
          </span>
          <span style={{ fontSize: 11, color: C.slate400 }}>
            ⏱ 18:42 remaining
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── 2. TEST BUILDER ──────────────────────────────────────────────────────────
export function TestBuilderShowcase() {
  const [mode, setMode] = useState<"timed" | "tutor" | "untimed">("timed");
  const [count, setCount] = useState(40);
  const subjects = [
    "Cardiology",
    "Pulmonology",
    "GI",
    "Neurology",
    "Psychiatry",
    "Pharmacology",
    "Biochemistry",
  ];
  const [active, setActive] = useState(["Cardiology", "Neurology"]);
  const toggle = (s: string) =>
    setActive((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  return (
    <Card>
      <SectionLabel name="Test Builder" priority="HIGH" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: C.slate500,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Mode
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {(["timed", "tutor", "untimed"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 10,
                  border:
                    mode === m
                      ? `2px solid ${C.primary}`
                      : `1.5px solid ${C.slate200}`,
                  background: mode === m ? C.primaryLight : C.white,
                  color: mode === m ? C.primary : C.slate600,
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: C.slate500,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginTop: 18,
            }}
          >
            Questions
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {[10, 20, 40, 80].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 10,
                  border:
                    count === n
                      ? `2px solid ${C.primary}`
                      : `1.5px solid ${C.slate200}`,
                  background: count === n ? C.primaryLight : C.white,
                  color: count === n ? C.primary : C.slate600,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {n}
              </button>
            ))}
          </div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: C.slate500,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginTop: 18,
            }}
          >
            Question Source
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Unused", "Incorrect", "Marked", "All"].map((s) => (
              <label
                key={s}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  fontSize: 13,
                  color: C.slate700,
                }}
              >
                <input
                  type="checkbox"
                  defaultChecked={s === "Unused"}
                  style={{ accentColor: C.primary }}
                />{" "}
                {s}
              </label>
            ))}
          </div>
        </div>
        <div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: C.slate500,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Subject Filter
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {subjects.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggle(s)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: active.includes(s)
                    ? `2px solid ${C.primary}`
                    : `1.5px solid ${C.slate200}`,
                  background: active.includes(s) ? C.primaryLight : C.white,
                  color: active.includes(s) ? C.primary : C.slate600,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: 18,
              background: C.slate50,
              borderRadius: 10,
              padding: "14px 16px",
            }}
          >
            <p style={{ fontSize: 12, color: C.slate500, marginBottom: 4 }}>
              Available questions matching filters
            </p>
            <p style={{ fontSize: 28, fontWeight: 800, color: C.primary }}>
              1,240
            </p>
          </div>
          <button
            type="button"
            style={{
              marginTop: 14,
              width: "100%",
              padding: "13px 0",
              borderRadius: 10,
              border: "none",
              background: C.primary,
              color: C.white,
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Start Test →
          </button>
        </div>
      </div>
    </Card>
  );
}

// ─── 3. PERFORMANCE DASHBOARD ─────────────────────────────────────────────────
export function PerformanceDashboardShowcase() {
  const subjects = [
    { name: "Cardiology", score: 78, total: 240, done: 180 },
    { name: "Pulmonology", score: 65, total: 180, done: 120 },
    { name: "GI", score: 82, total: 200, done: 200 },
    { name: "Neurology", score: 59, total: 220, done: 90 },
    { name: "Pharmacology", score: 71, total: 300, done: 150 },
  ];
  return (
    <Card>
      <SectionLabel name="Performance Dashboard" priority="HIGH" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 20,
        }}
      >
        {[
          {
            label: "Overall Score",
            val: "72%",
            sub: "+4% this week",
            color: C.primary,
          },
          {
            label: "Qs Answered",
            val: "740",
            sub: "of 2,400 total",
            color: C.slate700,
          },
          {
            label: "Streak",
            val: "12 days",
            sub: "Personal best!",
            color: C.green,
          },
          {
            label: "Predicted Score",
            val: "240",
            sub: "Step 1 equivalent",
            color: C.yellow,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: C.slate50,
              borderRadius: 12,
              padding: "16px 18px",
              border: `1.5px solid ${C.slate200}`,
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: C.slate500,
                fontWeight: 600,
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: stat.color,
              }}
            >
              {stat.val}
            </p>
            <p style={{ fontSize: 11, color: C.slate400, marginTop: 2 }}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {subjects.map((s) => (
          <div
            key={s.name}
            style={{
              display: "grid",
              gridTemplateColumns: "130px 1fr 60px 60px",
              gap: 12,
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: C.slate700,
                fontWeight: 600,
              }}
            >
              {s.name}
            </span>
            <ProgressBar
              value={s.score}
              color={
                s.score >= 75 ? C.green : s.score >= 60 ? C.yellow : C.red
              }
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color:
                  s.score >= 75 ? C.green : s.score >= 60 ? C.yellow : C.red,
                textAlign: "right",
              }}
            >
              {s.score}%
            </span>
            <span
              style={{
                fontSize: 11,
                color: C.slate400,
                textAlign: "right",
              }}
            >
              {s.done}/{s.total}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── 4. QUESTION NAVIGATOR ────────────────────────────────────────────────────
export function QuestionNavigatorShowcase() {
  const [active, setActive] = useState(14);
  const statuses: Record<number, string> = {};
  for (let i = 1; i <= 40; i++) {
    if (i < 14)
      statuses[i] =
        i % 4 === 0 ? "flagged" : i % 7 === 0 ? "wrong" : "correct";
    else if (i === 14) statuses[i] = "active";
    else statuses[i] = "unanswered";
  }
  const getStyle = (i: number): React.CSSProperties => {
    const s = statuses[i];
    const base: React.CSSProperties = {
      width: 34,
      height: 34,
      borderRadius: 8,
      border: "none",
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
      transition: "all .12s",
    };
    if (s === "active")
      return { ...base, background: C.primary, color: C.white };
    if (s === "correct")
      return {
        ...base,
        background: C.greenLight,
        color: C.green,
        border: `1.5px solid ${C.green}30`,
      };
    if (s === "wrong")
      return {
        ...base,
        background: C.redLight,
        color: C.red,
        border: `1.5px solid ${C.red}30`,
      };
    if (s === "flagged")
      return {
        ...base,
        background: C.yellowLight,
        color: C.yellow,
        border: `1.5px solid ${C.yellow}50`,
      };
    return { ...base, background: C.slate100, color: C.slate500 };
  };
  return (
    <Card>
      <SectionLabel name="Question Navigator" priority="MED" />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 16,
        }}
      >
        {Array.from({ length: 40 }, (_, i) => i + 1).map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            style={getStyle(i)}
          >
            {i}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        {[
          { label: "Correct", color: C.green, bg: C.greenLight },
          { label: "Incorrect", color: C.red, bg: C.redLight },
          { label: "Flagged", color: C.yellow, bg: C.yellowLight },
          { label: "Unanswered", color: C.slate500, bg: C.slate100 },
        ].map((l) => (
          <div
            key={l.label}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: l.bg,
                border: `1.5px solid ${l.color}60`,
              }}
            />
            <span style={{ fontSize: 11, color: C.slate500 }}>{l.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── 5. SPACED REPETITION QUEUE ───────────────────────────────────────────────
export function SpacedRepetitionQueueShowcase() {
  const cards = [
    {
      id: 1,
      front: "Pulsus parvus et tardus",
      back: "Aortic stenosis — weak, delayed carotid pulse",
      due: "Now",
      difficulty: "Hard",
      streak: 0,
    },
    {
      id: 2,
      front: "Hutchinson's triad",
      back:
        "Congenital syphilis: Hutchinson teeth, interstitial keratitis, sensorineural deafness",
      due: "Now",
      difficulty: "Med",
      streak: 2,
    },
    {
      id: 3,
      front: "Kayser-Fleischer rings",
      back:
        "Wilson's disease — copper deposition in Descemet's membrane",
      due: "In 1h",
      difficulty: "Easy",
      streak: 5,
    },
  ];
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const c = cards[idx];
  return (
    <Card>
      <SectionLabel name="Spaced Repetition (Flashcards)" priority="HIGH" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 20,
          alignItems: "start",
        }}
      >
        <div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setFlipped((f) => !f)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setFlipped((f) => !f);
            }}
            style={{
              background: flipped ? C.slate800 : C.primaryLight,
              borderRadius: 14,
              padding: "28px 24px",
              cursor: "pointer",
              minHeight: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background .25s",
              border: `1.5px solid ${
                flipped ? C.slate700 : C.primary + "40"
              }`,
            }}
          >
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: flipped ? C.white : C.primary,
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              {flipped ? c.back : c.front}
            </p>
          </div>
          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: C.slate400,
              marginTop: 8,
            }}
          >
            {flipped
              ? "Answer (tap to flip back)"
              : "Tap to reveal answer"}
          </p>
          {flipped && (
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              {["Again", "Hard", "Good", "Easy"].map((l, i) => {
                const colors = [C.red, C.yellow, C.primary, C.green];
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => {
                      setFlipped(false);
                      setIdx((idx + 1) % cards.length);
                    }}
                    style={{
                      flex: 1,
                      padding: "10px 0",
                      borderRadius: 10,
                      border: `1.5px solid ${colors[i]}60`,
                      background: colors[i] + "18",
                      color: colors[i],
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            minWidth: 120,
          }}
        >
          {cards.map((card, i) => (
            <div
              key={card.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                setIdx(i);
                setFlipped(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setIdx(i);
                  setFlipped(false);
                }
              }}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: i === idx ? C.primaryLight : C.slate50,
                border: `1.5px solid ${
                  i === idx ? C.primary : C.slate200
                }`,
                cursor: "pointer",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: i === idx ? C.primary : C.slate700,
                  marginBottom: 2,
                }}
              >
                {card.front.slice(0, 22)}…
              </p>
              <div style={{ display: "flex", gap: 6 }}>
                <Badge
                  color={
                    card.difficulty === "Hard"
                      ? "red"
                      : card.difficulty === "Med"
                        ? "yellow"
                        : "green"
                  }
                >
                  {card.difficulty}
                </Badge>
              </div>
            </div>
          ))}
          <div
            style={{
              background: C.slate50,
              borderRadius: 10,
              padding: "10px 14px",
              border: `1.5px solid ${C.slate200}`,
              marginTop: 4,
            }}
          >
            <p style={{ fontSize: 11, color: C.slate500, marginBottom: 2 }}>
              Due today
            </p>
            <p style={{ fontSize: 20, fontWeight: 800, color: C.slate800 }}>
              47
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── 6. TEST RESULTS / SCORE REPORT ──────────────────────────────────────────
export function ScoreReportShowcase() {
  const cats = [
    { name: "Cardiology", score: 78, avg: 68 },
    { name: "Pulmonology", score: 55, avg: 70 },
    { name: "GI/Hepatology", score: 82, avg: 72 },
    { name: "Neurology", score: 60, avg: 65 },
    { name: "Pharmacology", score: 73, avg: 69 },
  ];
  return (
    <Card>
      <SectionLabel name="Score Report" priority="HIGH" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <CircleProgress value={72} size={88} stroke={8} />
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.slate500,
              }}
            >
              Test Score
            </p>
            <p
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: C.slate800,
              }}
            >
              29/40
            </p>
            <Badge color="blue">Above Average</Badge>
          </div>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              width: "100%",
            }}
          >
            {[
              { l: "Time spent", v: "41 min" },
              { l: "Avg/Q", v: "1m 02s" },
              { l: "Flagged", v: "5" },
            ].map((s) => (
              <div
                key={s.l}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: C.slate600,
                }}
              >
                <span>{s.l}</span>
                <strong>{s.v}</strong>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: C.primary,
                }}
              />
              <span style={{ fontSize: 12, color: C.slate500 }}>
                Your score
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: C.slate300,
                }}
              />
              <span style={{ fontSize: 12, color: C.slate500 }}>
                Peer avg
              </span>
            </div>
          </div>
          {cats.map((cat) => (
            <div key={cat.name} style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.slate700,
                  }}
                >
                  {cat.name}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: cat.score >= cat.avg ? C.green : C.red,
                  }}
                >
                  {cat.score}%
                </span>
              </div>
              <div style={{ position: "relative", height: 10 }}>
                <div
                  style={{
                    background: C.slate200,
                    borderRadius: 99,
                    height: 10,
                    width: "100%",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: 10,
                    width: `${cat.avg}%`,
                    background: C.slate300,
                    borderRadius: 99,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: 10,
                    width: `${cat.score}%`,
                    background:
                      cat.score >= cat.avg ? C.primary : C.red,
                    borderRadius: 99,
                  }}
                />
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 10,
                border: "none",
                background: C.primary,
                color: C.white,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Review All Qs
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 10,
                border: `1.5px solid ${C.slate200}`,
                background: C.white,
                color: C.slate700,
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Review Wrong
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── 7. STUDY PLAN TIMELINE ───────────────────────────────────────────────────
export function StudyPlanShowcase() {
  const weeks = [
    { week: 1, topic: "Cardiology + Pulm", done: true, score: 74 },
    { week: 2, topic: "GI + Hepatology", done: true, score: 68 },
    { week: 3, topic: "Neurology", done: false, active: true },
    { week: 4, topic: "Pharmacology", done: false },
    { week: 5, topic: "Biochemistry", done: false },
    { week: 6, topic: "Full-Length Mock", done: false },
  ];
  return (
    <Card>
      <SectionLabel name="Study Plan Timeline" priority="MED" />
      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 6,
        }}
      >
        {weeks.map((w) => (
          <div
            key={w.week}
            style={{
              flex: "0 0 140px",
              padding: "14px 16px",
              borderRadius: 12,
              background: w.active
                ? C.primaryLight
                : w.done
                  ? C.greenLight
                  : C.slate50,
              border: `1.5px solid ${
                w.active ? C.primary : w.done ? C.green + "60" : C.slate200
              }`,
              opacity: !w.done && !w.active ? 0.7 : 1,
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: w.active ? C.primary : w.done ? C.green : C.slate400,
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              WEEK {w.week}
            </p>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.slate800,
                marginBottom: 8,
                lineHeight: 1.4,
              }}
            >
              {w.topic}
            </p>
            {w.done ? (
              <Badge color="green">{w.score}% avg</Badge>
            ) : w.active ? (
              <Badge color="blue">In Progress</Badge>
            ) : (
              <Badge color="slate">Upcoming</Badge>
            )}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 16,
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: C.slate50,
          borderRadius: 10,
          padding: "12px 16px",
          border: `1.5px solid ${C.slate200}`,
        }}
      >
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, color: C.slate500, marginBottom: 4 }}>
            Exam Date
          </p>
          <p style={{ fontSize: 16, fontWeight: 800, color: C.slate800 }}>
            March 15, 2026
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, color: C.slate500, marginBottom: 4 }}>
            Days Remaining
          </p>
          <p style={{ fontSize: 16, fontWeight: 800, color: C.red }}>
            9 days
          </p>
        </div>
        <ProgressBar value={66} color={C.primary} />
      </div>
    </Card>
  );
}

// ─── 8. NOTES PANEL ───────────────────────────────────────────────────────────
export function NotesPanelShowcase() {
  const [tab, setTab] = useState("my");
  const notes = [
    {
      id: 1,
      q: "Q14 — Aortic Stenosis",
      note: "Remember: pulsus parvus et tardus = small + slow carotid upstroke. Classic triad: angina/syncope/CHF.",
      tags: ["Cardiology", "Buzzword"],
      date: "Mar 5",
    },
    {
      id: 2,
      q: "Q22 — Wilson's Disease",
      note: "Kayser-Fleischer rings in posterior cornea. Low ceruloplasmin. Treat with D-penicillamine or zinc.",
      tags: ["GI", "Pharmacology"],
      date: "Mar 4",
    },
  ];
  return (
    <Card>
      <SectionLabel name="Notes Panel" priority="MED" />
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {["my", "shared", "ai-summary"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border:
                tab === t ? `2px solid ${C.primary}` : `1.5px solid ${C.slate200}`,
              background: tab === t ? C.primaryLight : C.white,
              color: tab === t ? C.primary : C.slate600,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {t === "ai-summary"
              ? "AI Summary"
              : t.charAt(0).toUpperCase() + t.slice(1) + " Notes"}
          </button>
        ))}
      </div>
      {tab === "ai-summary" ? (
        <div
          style={{
            background: C.primaryLight,
            borderRadius: 12,
            padding: 18,
            border: `1.5px solid ${C.primary}40`,
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.primary,
              marginBottom: 8,
            }}
          >
            🤖 AI-generated study summary
          </p>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.8,
              color: C.slate700,
            }}
          >
            Based on your recent performance, <strong>Pulmonology</strong> and{" "}
            <strong>Neurology</strong> are weak areas. Focus on obstructive vs.
            restrictive patterns and stroke syndromes. You have consistent
            strength in GI/Hepatology (82%).
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notes.map((n) => (
            <div
              key={n.id}
              style={{
                background: C.slate50,
                borderRadius: 12,
                padding: "14px 16px",
                border: `1.5px solid ${C.slate200}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.primary,
                  }}
                >
                  {n.q}
                </span>
                <span style={{ fontSize: 11, color: C.slate400 }}>
                  {n.date}
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: C.slate700,
                  lineHeight: 1.7,
                  marginBottom: 8,
                }}
              >
                {n.note}
              </p>
              <div style={{ display: "flex", gap: 6 }}>
                {n.tags.map((tag) => (
                  <Tag key={tag} label={tag} />
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            style={{
              padding: "10px 0",
              borderRadius: 10,
              border: `1.5px dashed ${C.slate300}`,
              background: C.white,
              color: C.slate500,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Add Note
          </button>
        </div>
      )}
    </Card>
  );
}

// ─── 9. LEADERBOARD / PEER COMPARISON ────────────────────────────────────────
export function LeaderboardShowcase() {
  const peers = [
    { rank: 1, name: "Sarah K.", avatar: "SK", score: 89, streak: 28 },
    { rank: 2, name: "James M.", avatar: "JM", score: 85, streak: 14 },
    {
      rank: 3,
      name: "You",
      avatar: "ME",
      score: 72,
      streak: 12,
      isMe: true,
    },
    { rank: 4, name: "Priya N.", avatar: "PN", score: 70, streak: 9 },
    { rank: 5, name: "Carlos R.", avatar: "CR", score: 67, streak: 5 },
  ];
  return (
    <Card>
      <SectionLabel name="Peer Leaderboard" priority="LOW" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {peers.map((p) => (
          <div
            key={p.rank}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "10px 14px",
              borderRadius: 12,
              background: p.isMe ? C.primaryLight : C.slate50,
              border: `1.5px solid ${
                p.isMe ? C.primary + "50" : C.slate200
              }`,
            }}
          >
            <span
              style={{
                width: 22,
                textAlign: "center",
                fontWeight: 800,
                color: p.rank <= 2 ? C.yellow : C.slate400,
                fontSize: 14,
              }}
            >
              {p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : p.rank}
            </span>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: p.isMe ? C.primary : C.slate300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.white,
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {p.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: p.isMe ? C.primary : C.slate800,
                }}
              >
                {p.name}{" "}
                {p.isMe && (
                  <Badge color="blue">You</Badge>
                )}
              </p>
              <p style={{ fontSize: 11, color: C.slate400 }}>
                🔥 {p.streak}-day streak
              </p>
            </div>
            <div style={{ width: 80 }}>
              <ProgressBar
                value={p.score}
                color={p.isMe ? C.primary : C.slate400}
                height={6}
              />
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: p.isMe ? C.primary : C.slate600,
                  textAlign: "right",
                  marginTop: 3,
                }}
              >
                {p.score}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── 10. SEARCH / FILTER BAR ──────────────────────────────────────────────────
export function SearchFilterBarShowcase() {
  const [q, setQ] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  return (
    <Card style={{ padding: 16 }}>
      <SectionLabel name="Search & Filter Bar" priority="MED" />
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 15,
              color: C.slate400,
            }}
          >
            🔍
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by keyword, condition, drug..."
            style={{
              width: "100%",
              padding: "10px 12px 10px 36px",
              borderRadius: 10,
              border: `1.5px solid ${C.slate200}`,
              fontSize: 14,
              color: C.slate700,
              outline: "none",
              background: C.slate50,
              boxSizing: "border-box",
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => setFilterOpen((f) => !f)}
          style={{
            padding: "10px 18px",
            borderRadius: 10,
            border: `1.5px solid ${
              filterOpen ? C.primary : C.slate200
            }`,
            background: filterOpen ? C.primaryLight : C.white,
            color: filterOpen ? C.primary : C.slate600,
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          ⚙ Filters
        </button>
      </div>
      {filterOpen && (
        <div
          style={{
            marginTop: 12,
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {["Subject", "Difficulty", "Status", "Topic", "Year"].map((f) => (
            <select
              key={f}
              style={{
                padding: "7px 12px",
                borderRadius: 8,
                border: `1.5px solid ${C.slate200}`,
                fontSize: 13,
                color: C.slate600,
                background: C.white,
                cursor: "pointer",
              }}
            >
              <option>{f}</option>
            </select>
          ))}
        </div>
      )}
    </Card>
  );
}

// ─── 11. QUESTION DETAIL / REVIEW ─────────────────────────────────────────────
export function QuestionReviewListShowcase() {
  const qs = [
    {
      id: 14,
      topic: "Aortic Stenosis",
      result: "correct",
      time: "1m 12s",
      flagged: false,
    },
    {
      id: 22,
      topic: "Wilson's Disease",
      result: "correct",
      time: "2m 04s",
      flagged: true,
    },
    {
      id: 30,
      topic: "COPD Management",
      result: "wrong",
      time: "0m 48s",
      flagged: false,
    },
    {
      id: 37,
      topic: "Antidepressant Mechanisms",
      result: "wrong",
      time: "1m 30s",
      flagged: true,
    },
  ];
  return (
    <Card>
      <SectionLabel name="Question Review List" priority="MED" />
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["All", "Correct", "Wrong", "Flagged"].map((f) => (
          <button
            key={f}
            type="button"
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: `1.5px solid ${C.slate200}`,
              background: f === "All" ? C.primaryLight : C.white,
              color: f === "All" ? C.primary : C.slate600,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {qs.map((q) => (
          <div
            key={q.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 16px",
              borderRadius: 12,
              border: `1.5px solid ${C.slate200}`,
              background: C.white,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 18 }}>
              {q.result === "correct" ? "✅" : "❌"}
            </span>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.slate800,
                }}
              >
                Q{q.id} — {q.topic}
              </p>
              <p style={{ fontSize: 11, color: C.slate400 }}>
                ⏱ {q.time} {q.flagged && "⚑ Flagged"}
              </p>
            </div>
            <button
              type="button"
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                border: `1.5px solid ${C.primary}`,
                color: C.primary,
                background: C.white,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Review
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── 12. PROFILE / SETTINGS ───────────────────────────────────────────────────
export function ProfileSettingsShowcase() {
  return (
    <Card>
      <SectionLabel name="Profile & Settings" priority="LOW" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 20,
          alignItems: "start",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: C.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.white,
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            JD
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.slate800 }}>
            Dr. Jane Doe
          </p>
          <Badge color="blue">Step 2 CK</Badge>
        </div>
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[
              { label: "Exam Target", val: "Step 2 CK" },
              { label: "Exam Date", val: "Mar 15, 2026" },
              { label: "Daily Goal", val: "40 questions" },
              { label: "Notifications", val: "Enabled" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: C.slate50,
                  borderRadius: 10,
                  padding: "12px 14px",
                  border: `1.5px solid ${C.slate200}`,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: C.slate400,
                    marginBottom: 3,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {s.label}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: C.slate800,
                  }}
                >
                  {s.val}
                </p>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 9,
                border: `1.5px solid ${C.slate200}`,
                background: C.white,
                color: C.slate600,
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Edit Profile
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 9,
                border: "none",
                background: C.primary,
                color: C.white,
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
