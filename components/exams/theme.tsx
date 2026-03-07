"use client";

export function useTheme(dark: boolean) {
  return {
    bg: dark ? "#0e0e10" : "#ffffff",
    sidebar: dark ? "#1a1a1e" : "#efefef",
    surface: dark ? "#232328" : "#e8e8ec",
    surface2: dark ? "#2d2d33" : "#dfdfe5",
    border: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    text: dark ? "#f2f2f4" : "#111114",
    subtext: dark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.4)",
    muted: dark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)",
    inputBg: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
  };
}
