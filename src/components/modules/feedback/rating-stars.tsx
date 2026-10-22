"use client";

import { StarIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const STARS = [1, 2, 3, 4, 5] as const;

const SIZE_CLASS = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-7",
} as const;

interface RatingStarsProps {
  // 0-5; দশমিক হতে পারে (average rating এর জন্য), তখন তারা আংশিক ভরাট দেখায়
  value: number;
  // দিলে interactive (customer rating দেওয়ার সময়); না দিলে শুধু দেখানো
  onChange?: (value: number) => void;
  size?: keyof typeof SIZE_CLASS;
  // তারার পাশে "4.5" লেখা
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
}

function StarRow({
  filled,
  size,
}: {
  filled: boolean;
  size: keyof typeof SIZE_CLASS;
}) {
  return (
    <>
      {STARS.map((star) => (
        <StarIcon
          key={star}
          aria-hidden="true"
          className={cn(
            "shrink-0",
            SIZE_CLASS[size],
            filled
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-muted-foreground/40",
          )}
        />
      ))}
    </>
  );
}

// শুধু দেখানো: 4.3 হলে চতুর্থ তারা 30% ভরাট
function ReadOnlyStars({
  value,
  size,
  showValue,
  className,
}: Pick<RatingStarsProps, "value" | "showValue" | "className"> & {
  size: keyof typeof SIZE_CLASS;
}) {
  const safe = Math.min(Math.max(value, 0), 5);

  return (
    <span
      role="img"
      aria-label={`Rated ${safe.toFixed(1)} out of 5`}
      className={cn("inline-flex items-center gap-1.5", className)}
    >
      <span className="relative inline-flex">
        <span className="inline-flex gap-0.5">
          <StarRow filled={false} size={size} />
        </span>
        <span
          className="absolute inset-y-0 left-0 inline-flex gap-0.5 overflow-hidden"
          style={{ width: `${(safe / 5) * 100}%` }}
        >
          <StarRow filled size={size} />
        </span>
      </span>
      {showValue ? (
        <span className="text-sm font-medium tabular-nums">
          {safe.toFixed(1)}
        </span>
      ) : null}
    </span>
  );
}

export default function RatingStars({
  value,
  onChange,
  size = "md",
  showValue = false,
  disabled = false,
  className,
}: RatingStarsProps) {
  const [hovered, setHovered] = useState(0);

  if (!onChange) {
    return (
      <ReadOnlyStars
        value={value}
        size={size}
        showValue={showValue}
        className={className}
      />
    );
  }

  const active = hovered || value;

  return (
    <fieldset
      className={cn(
        "m-0 inline-flex items-center gap-1 border-0 p-0",
        className,
      )}
      aria-label="Rating"
      onMouseLeave={() => setHovered(0)}
    >
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          aria-pressed={value === star}
          className="rounded-sm p-0.5 outline-none transition-transform hover:scale-110 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
          onMouseEnter={() => setHovered(star)}
          onFocus={() => setHovered(star)}
          onBlur={() => setHovered(0)}
          onClick={() => onChange(star)}
        >
          <StarIcon
            aria-hidden="true"
            className={cn(
              SIZE_CLASS[size],
              star <= active
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-muted-foreground/40",
            )}
          />
        </button>
      ))}
      {showValue && value > 0 ? (
        <span className="ml-1 text-sm font-medium tabular-nums">{value}/5</span>
      ) : null}
    </fieldset>
  );
}
