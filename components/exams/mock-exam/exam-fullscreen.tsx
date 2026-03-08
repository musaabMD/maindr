"use client";

interface ExamFullscreenProps {
  children: React.ReactNode;
  isActive: boolean;
}

/**
 * Renders exam content as a full-viewport overlay.
 * Covers all other UI (nav, header) so only the exam is visible.
 */
export function ExamFullscreen({ children, isActive }: ExamFullscreenProps) {
  if (!isActive) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-white overflow-auto"
      style={{ isolation: "isolate" }}
    >
      {children}
    </div>
  );
}
