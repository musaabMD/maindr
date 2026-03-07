"use client";

import { useTheme } from "@/components/exams/theme";

interface TagPillProps {
  label: string;
  color?: string;
  dark: boolean;
}

export function TagPill({ label, color, dark }: TagPillProps) {
  const t = useTheme(dark);
  return (
    <span
      className="rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold whitespace-nowrap font-mono"
      style={{
        background: color ? `${color}22` : t.surface2,
        borderColor: color ? `${color}44` : t.border,
        color: color || t.subtext,
      }}
    >
      {label}
    </span>
  );
}
