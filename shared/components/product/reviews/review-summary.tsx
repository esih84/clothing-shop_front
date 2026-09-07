"use client";

import { ThumbsUp } from "lucide-react";
import { StarRating } from "@/shared/ui/star-rating";
import { toPersianDigits } from "@/shared/lib/digits";
import type { ReviewSummary as Summary } from "@/types/review";

interface ReviewSummaryProps {
  summary: Summary;
}

const STAR_LEVELS = [5, 4, 3, 2, 1] as const;

/** Average score, star distribution bars and the recommendation rate. */
export function ReviewSummary({ summary }: ReviewSummaryProps) {
  const { average, count, breakdown, recommendedPercentage } = summary;

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 rounded-2xl border border-border bg-primary/10 p-5">
      {/* Average */}
      <div className="flex sm:flex-col items-center sm:justify-center gap-3 sm:gap-1.5 sm:w-40 sm:shrink-0">
        <span className="text-4xl font-bold text-foreground leading-none">
          {toPersianDigits(average.toFixed(1))}
        </span>
        <div className="flex flex-col sm:items-center gap-1">
          <StarRating value={average} size="md" />
          <span className="text-xs text-muted-foreground">
            از {toPersianDigits(count)} نظر
          </span>
        </div>
      </div>

      {/* Distribution */}
      <div className="flex-1 space-y-1.5">
        {STAR_LEVELS.map((level) => {
          const n = breakdown?.[String(level)] ?? 0;
          const percent = count > 0 ? (n / count) * 100 : 0;
          return (
            <div key={level} className="flex items-center gap-2.5">
              <span className="text-xs text-muted-foreground w-10 shrink-0 tabular-nums">
                {toPersianDigits(level)} ستاره
              </span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 shrink-0 text-left tabular-nums">
                {toPersianDigits(n)}
              </span>
            </div>
          );
        })}

        {recommendedPercentage !== null && (
          <p className="flex items-center gap-1.5 pt-2 text-sm text-foreground">
            <ThumbsUp className="w-4 h-4 text-secondary" />
            <span className="font-bold text-secondary">
              ٪{toPersianDigits(recommendedPercentage)}
            </span>
            از خریداران این محصول را پیشنهاد می‌کنند
          </p>
        )}
      </div>
    </div>
  );
}
