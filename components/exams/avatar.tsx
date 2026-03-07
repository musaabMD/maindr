"use client";

interface AvatarProps {
  initials: string;
  color?: string;
  size?: number;
}

export function Avatar({ initials, color, size = 32 }: AvatarProps) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-extrabold text-white select-none"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.35,
        background: color || "#555",
      }}
    >
      {initials}
    </div>
  );
}
