"use client";

export function useTheme(dark: boolean) {
  return {
    bg: dark ? "#0e0e10" : "#F8F8F7",
    sidebar: dark ? "#1a1a1e" : "#F2F2F0",
    surface: dark ? "#232328" : "#E8E8E6",
    surface2: dark ? "#2d2d33" : "#E0E0DE",
    border: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    text: dark ? "#f2f2f4" : "#111114",
    subtext: dark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.4)",
    muted: dark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)",
    inputBg: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
  };
}
