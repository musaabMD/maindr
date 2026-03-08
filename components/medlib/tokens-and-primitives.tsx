"use client";

// ─── Design tokens ───────────────────────────────────────────────────────────
// Palette: clean clinical white, slate accents, vivid blue primary, red/green for feedback
export const C = {
  primary: "#1A56DB",
  primaryLight: "#EBF5FF",
  primaryDark: "#1040A0",
  green: "#0E9F6E",
  greenLight: "#F0FDF4",
  red: "#E02424",
  redLight: "#FEF2F2",
  yellow: "#D97706",
  yellowLight: "#FFFBEB",
  slate50: "#F8FAFC",
  slate100: "#F1F5F9",
  slate200: "#E2E8F0",
  slate300: "#CBD5E1",
  slate400: "#94A3B8",
  slate500: "#64748B",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1E293B",
  white: "#FFFFFF",
};

// ─── Shared micro-components ─────────────────────────────────────────────────
export function Badge({
  color = "blue",
  children,
}: {
  color?: "blue" | "green" | "red" | "yellow" | "slate";
  children: React.ReactNode;
}) {
  const colors: Record<string, { bg: string; text: string }> = {
    blue: { bg: C.primaryLight, text: C.primary },
    green: { bg: C.greenLight, text: C.green },
    red: { bg: C.redLight, text: C.red },
    yellow: { bg: C.yellowLight, text: C.yellow },
    slate: { bg: C.slate100, text: C.slate600 },
  };
  const s = colors[color] ?? colors.blue;
  return (
    <span
      style={{
        background: s.bg,
        color: s.text,
        padding: "2px 10px",
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.2,
      }}
    >
      {children}
    </span>
  );
}

export function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        background: C.slate100,
        color: C.slate600,
        padding: "3px 10px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
}

export function Pill({
  n,
  active,
  onClick,
}: {
  n: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        border: active ? `2px solid ${C.primary}` : `1.5px solid ${C.slate200}`,
        background: active ? C.primaryLight : C.white,
        color: active ? C.primary : C.slate600,
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
        transition: "all .15s",
      }}
    >
      {n}
    </button>
  );
}

export function ProgressBar({
  value,
  color = C.primary,
  height = 8,
}: {
  value: number;
  color?: string;
  height?: number;
}) {
  return (
    <div
      style={{
        background: C.slate200,
        borderRadius: 99,
        height,
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          background: color,
          borderRadius: 99,
          transition: "width .4s",
        }}
      />
    </div>
  );
}

export function CircleProgress({
  value,
  size = 64,
  stroke = 6,
  color = C.primary,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={C.slate200}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset .5s" }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill={C.slate800}
        fontWeight="700"
        fontSize={size * 0.22}
      >
        {value}%
      </text>
    </svg>
  );
}

export function SectionLabel({
  name,
  priority,
}: {
  name: string;
  priority: "HIGH" | "MED" | "LOW";
}) {
  const pColor =
    priority === "HIGH" ? C.red : priority === "MED" ? C.yellow : C.green;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 12,
        paddingBottom: 10,
        borderBottom: `2px solid ${C.slate100}`,
      }}
    >
      <span
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 15,
          fontWeight: 700,
          color: C.slate800,
          letterSpacing: 0.3,
        }}
      >
        {name}
      </span>
      <span
        style={{
          background: pColor + "22",
          color: pColor,
          fontSize: 10,
          fontWeight: 800,
          padding: "2px 8px",
          borderRadius: 99,
          letterSpacing: 1,
        }}
      >
        {priority} PRIORITY
      </span>
    </div>
  );
}

export function Card({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: C.white,
        border: `1.5px solid ${C.slate200}`,
        borderRadius: 16,
        padding: 24,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
