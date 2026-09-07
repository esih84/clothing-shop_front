"use client";

import {
  BadgeCheck,
  Pencil,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { StarRating } from "@/shared/ui/star-rating";
import { cn, formatJalaliDate } from "@/shared/lib/utils";
import { toPersianDigits } from "@/shared/lib/digits";
import type { Review } from "@/types/review";

interface ReviewCardProps {
  review: Review;
  /** The current user's vote on this review, or undefined if they haven't voted. */
  myVote?: boolean;
  isMine: boolean;
  onVote: (isHelpful: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

function initials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
}

export function ReviewCard({
  review,
  myVote,
  isMine,
  onVote,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  const name = review.authorName;

  return (
    <article className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <header className="flex items-start gap-3">
        <div
          aria-hidden
          className="w-10 h-10 shrink-0 rounded-full bg-primary/25 text-secondary flex items-center justify-center text-sm font-bold"
        >
          {initials(name) || "؟"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-medium text-foreground text-sm">{name}</span>
            {isMine && (
              <span className="text-[10px] rounded-full border border-secondary/40 bg-secondary/10 px-2 py-0.5 text-secondary">
                نظر شما
              </span>
            )}
            {review.isVerifiedPurchase && (
              <span className="flex items-center gap-1 text-[10px] rounded-full border border-green-600/30 bg-green-600/10 px-2 py-0.5 text-green-700">
                <BadgeCheck className="w-3 h-3" />
                خرید تأییدشده
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <StarRating value={review.rating} size="sm" />
            <span className="text-xs text-muted-foreground">
              {formatJalaliDate(review.createdAt)}
            </span>
          </div>
        </div>

        {isMine && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={onEdit}
              aria-label="ویرایش نظر"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-secondary hover:bg-primary/15 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label="حذف نظر"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {review.isRecommended !== null && review.isRecommended !== undefined && (
        <p
          className={cn(
            "flex items-center gap-1.5 mt-3 text-xs font-medium",
            review.isRecommended ? "text-green-700" : "text-destructive",
          )}
        >
          {review.isRecommended ? (
            <ThumbsUp className="w-3.5 h-3.5" />
          ) : (
            <ThumbsDown className="w-3.5 h-3.5" />
          )}
          {review.isRecommended
            ? "این محصول را پیشنهاد می‌کنم"
            : "این محصول را پیشنهاد نمی‌کنم"}
        </p>
      )}

      {review.comment?.trim() && (
        <p className="mt-3 text-sm leading-7 text-foreground whitespace-pre-line">
          {review.comment}
        </p>
      )}

      <footer className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-border/60">
        <span className="text-xs text-muted-foreground ml-1">
          آیا این نظر مفید بود؟
        </span>
        <VoteButton
          active={myVote === true}
          count={review.helpfulCount}
          onClick={() => onVote(true)}
          label="بله، مفید بود"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
        </VoteButton>
        <VoteButton
          active={myVote === false}
          count={review.notHelpfulCount}
          onClick={() => onVote(false)}
          label="خیر، مفید نبود"
        >
          <ThumbsDown className="w-3.5 h-3.5" />
        </VoteButton>
      </footer>
    </article>
  );
}

function VoteButton({
  active,
  count,
  onClick,
  label,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
        active
          ? "border-secondary/40 bg-secondary/10 text-secondary"
          : "border-border text-muted-foreground hover:border-secondary/40 hover:text-secondary",
      )}
    >
      {children}
      <span className="tabular-nums">{toPersianDigits(count)}</span>
    </button>
  );
}
