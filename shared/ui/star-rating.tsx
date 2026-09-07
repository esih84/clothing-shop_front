"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { toPersianDigits } from "@/shared/lib/digits";

const SIZES = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
} as const;

export type StarSize = keyof typeof SIZES;

interface StarRatingProps {
  /** 0–5. Rounded to the nearest whole star for display. */
  value: number;
  size?: StarSize;
  className?: string;
  /** Screen-reader label; defaults to "امتیاز N از ۵". */
  label?: string;
}

/** Read-only star row. */
export function StarRating({
  value,
  size = "md",
  className,
  label,
}: StarRatingProps) {
  const filled = Math.round(value);
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={label ?? `امتیاز ${toPersianDigits(filled)} از ۵`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(
            SIZES[size],
            i <= filled
              ? "fill-primary text-primary"
              : "fill-muted text-muted-foreground/40",
          )}
        />
      ))}
    </div>
  );
}

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: StarSize;
  disabled?: boolean;
  className?: string;
}

const RATING_LABELS = [
  "خیلی بد",
  "بد",
  "متوسط",
  "خوب",
  "عالی",
] as const;

/**
 * Interactive star picker. The stars are real radio inputs, so keyboard and screen-reader users
 * get arrow-key selection for free — hover is only a visual layer on top.
 */
export function StarRatingInput({
  value,
  onChange,
  size = "lg",
  disabled,
  className,
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHovered(0)}
        role="radiogroup"
        aria-label="امتیاز شما به این محصول"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <label
            key={star}
            onMouseEnter={() => !disabled && setHovered(star)}
            className={cn(
              "cursor-pointer p-0.5 rounded-md transition-transform",
              !disabled && "hover:scale-110 active:scale-95",
              disabled && "cursor-not-allowed opacity-60",
              "focus-within:ring-2 focus-within:ring-secondary/40",
            )}
          >
            <input
              type="radio"
              name="review-rating"
              className="sr-only"
              value={star}
              checked={value === star}
              disabled={disabled}
              onChange={() => onChange(star)}
            />
            <Star
              aria-hidden
              className={cn(
                SIZES[size],
                "transition-colors",
                star <= shown
                  ? "fill-primary text-primary"
                  : "fill-muted text-muted-foreground/40",
              )}
            />
            <span className="sr-only">{RATING_LABELS[star - 1]}</span>
          </label>
        ))}
      </div>
      {shown > 0 && (
        <span className="text-sm font-medium text-foreground">
          {RATING_LABELS[shown - 1]}
        </span>
      )}
    </div>
  );
}
