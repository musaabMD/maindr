"use client";

interface StarRatingProps {
  rating: number;
  dark: boolean;
}

export function StarRating({ rating, dark }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className="text-xs"
          style={{
            color:
              s <= rating
                ? "#fbbf24"
                : dark
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(0,0,0,0.12)",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
