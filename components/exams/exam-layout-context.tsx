"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface ExamLayoutContextValue {
  dark: boolean;
  setDark: (fn: (d: boolean) => boolean) => void;
}

const ExamLayoutContext = createContext<ExamLayoutContextValue | null>(null);

export function ExamLayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(false);
  return (
    <ExamLayoutContext.Provider value={{ dark, setDark }}>
      {children}
    </ExamLayoutContext.Provider>
  );
}

export function useExamLayout() {
  const ctx = useContext(ExamLayoutContext);
  if (!ctx) {
    return { dark: false, setDark: () => {} };
  }
  return ctx;
}
