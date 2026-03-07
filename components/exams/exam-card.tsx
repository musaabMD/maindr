"use client";

import { useState } from "react";
import type { Doc } from "@/convex/_generated/dataModel";
import { TiltedArt } from "./tilted-art";

interface ExamCardProps {
  exam: Doc<"exams">;
}

export function ExamCard({ exam }: ExamCardProps) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="relative flex flex-col justify-between overflow-hidden rounded-xl p-5 transition-all duration-200"
      style={{
        aspectRatio: "2/1",
        minHeight: "180px",
        background: exam.color,
        transform: hov ? "scale(1.035)" : "scale(1)",
        filter: hov ? "brightness(1.14)" : "brightness(1)",
        transitionTimingFunction: "cubic-bezier(.34,1.45,.64,1)",
      }}
    >
      <div
        className="z-10 max-w-[62%] text-white"
        style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "clamp(24px,3.2vw,36px)",
          letterSpacing: "0.04em",
          lineHeight: 1,
        }}
      >
        {exam.name}
      </div>
      <TiltedArt name={exam.name} />
    </div>
  );
}
