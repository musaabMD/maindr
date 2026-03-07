"use client";

interface TiltedArtProps {
  name: string;
}

export function TiltedArt({ name }: TiltedArtProps) {
  const short = name.replace(/[^A-Za-z0-9]/g, "").slice(0, 4).toUpperCase();
  return (
    <div
      className="absolute -bottom-3 -right-2.5 flex size-24 items-center justify-center overflow-hidden rounded-lg"
      style={{
        transform: "rotate(-20deg)",
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.28), rgba(255,255,255,0.07))",
        boxShadow: "4px 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <span
        className="text-xl tracking-wider text-white/95 select-none"
        style={{
          fontFamily: "var(--font-bebas)",
          textShadow: "0 2px 6px rgba(0,0,0,0.35)",
        }}
      >
        {short}
      </span>
    </div>
  );
}
