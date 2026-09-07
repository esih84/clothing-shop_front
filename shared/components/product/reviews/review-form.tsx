"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, LogIn, ThumbsDown, ThumbsUp } from "lucide-react";
import { Textarea } from "@/shared/ui/textarea";
import { StarRatingInput } from "@/shared/ui/star-rating";
import { cn } from "@/shared/lib/utils";
import { toPersianDigits } from "@/shared/lib/digits";
import {
  reviewLoginUrl,
  savePendingReview,
  type PendingReview,
} from "@/shared/lib/pending-review";
import type { OwnReview } from "@/types/review";

/** Mirrors MAX_REVIEW_LENGTH in the backend DTO. */
const MAX_COMMENT_LENGTH = 2000;

export type ReviewDraft = {
  rating: number;
  comment: string;
  isRecommended: boolean | null;
};

interface ReviewFormProps {
  productId: string;
  productSlug: string;
  isLoggedIn: boolean;
  /** The user's existing review, if any — the form then edits instead of creating. */
  myReview: OwnReview | null;
  /** Draft restored after a login round trip. */
  initialDraft?: ReviewDraft | null;
  isSubmitting: boolean;
  onSubmit: (draft: ReviewDraft) => void;
}

export function ReviewForm({
  productId,
  productSlug,
  isLoggedIn,
  myReview,
  initialDraft,
  isSubmitting,
  onSubmit,
}: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isRecommended, setIsRecommended] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Prefill: a restored draft wins over the saved review, because it is what the user typed last.
  useEffect(() => {
    if (initialDraft) {
      setRating(initialDraft.rating);
      setComment(initialDraft.comment);
      setIsRecommended(initialDraft.isRecommended);
      return;
    }
    if (myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment ?? "");
      setIsRecommended(myReview.isRecommended ?? null);
    }
  }, [initialDraft, myReview]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating < 1) {
      setError("لطفاً امتیاز خود را با ستاره‌ها مشخص کنید.");
      return;
    }

    const draft: ReviewDraft = {
      rating,
      comment: comment.trim(),
      isRecommended,
    };

    // Not logged in: park the draft and come back to this exact section after login.
    if (!isLoggedIn) {
      const pending: PendingReview = { productId, productSlug, ...draft };
      savePendingReview(pending);
      router.push(reviewLoginUrl(productSlug));
      return;
    }

    onSubmit(draft);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold text-foreground">
          {myReview ? "ویرایش نظر شما" : "نظر خود را بنویسید"}
        </h3>
        {!isLoggedIn && (
          <span className="text-xs text-muted-foreground">
            برای ثبت نظر باید وارد شوید
          </span>
        )}
      </div>

      {myReview && !myReview.isApproved && (
        <p className="text-xs text-muted-foreground bg-muted rounded-xl px-3 py-2">
          نظر شما توسط مدیر پنهان شده و در فهرست نمایش داده نمی‌شود.
        </p>
      )}

      <StarRatingInput
        value={rating}
        onChange={(v) => {
          setRating(v);
          setError(null);
        }}
        disabled={isSubmitting}
      />

      <div className="space-y-1.5">
        <Textarea
          value={comment}
          onChange={(e) =>
            setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))
          }
          disabled={isSubmitting}
          rows={4}
          placeholder="تجربه‌ات از این محصول چطور بود؟ برای بقیه بنویس."
          className="rounded-xl bg-muted border-border min-h-28 focus-visible:ring-secondary/20 focus-visible:ring-offset-0"
        />
        <div className="flex justify-end">
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {toPersianDigits(comment.length)} /{" "}
            {toPersianDigits(MAX_COMMENT_LENGTH)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          این محصول را به دیگران پیشنهاد می‌کنید؟
        </p>
        {/* Two columns on mobile so the pair always sits side by side; natural width from sm up. */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <RecommendChip
            active={isRecommended === true}
            disabled={isSubmitting}
            onClick={() =>
              setIsRecommended(isRecommended === true ? null : true)
            }
            tone="positive"
          >
            <ThumbsUp className="w-4 h-4" />
            پیشنهاد می‌کنم
          </RecommendChip>
          <RecommendChip
            active={isRecommended === false}
            disabled={isSubmitting}
            onClick={() =>
              setIsRecommended(isRecommended === false ? null : false)
            }
            tone="negative"
          >
            <ThumbsDown className="w-4 h-4" />
            پیشنهاد نمی‌کنم
          </RecommendChip>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex flex-col items-stretch gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-secondary text-secondary-foreground px-6 py-3 text-sm font-medium hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {!isLoggedIn && <LogIn className="w-4 h-4" />}
          {isLoggedIn
            ? myReview
              ? "ثبت ویرایش"
              : "ثبت نظر"
            : "ورود و ثبت نظر"}
        </button>

        {!isLoggedIn && (
          <Link
            href={reviewLoginUrl(productSlug)}
            className="text-center text-sm text-secondary hover:text-secondary/80 transition-colors"
          >
            حساب دارید؟ وارد شوید
          </Link>
        )}
      </div>
    </form>
  );
}

function RecommendChip({
  active,
  disabled,
  onClick,
  tone,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  tone: "positive" | "negative";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs transition-colors disabled:opacity-60",
        "sm:justify-start sm:gap-2 sm:px-4 sm:py-2 sm:text-sm",
        "[&>svg]:shrink-0",
        active &&
          tone === "positive" &&
          "border-green-600/40 bg-green-600/10 text-green-700",
        active &&
          tone === "negative" &&
          "border-destructive/40 bg-destructive/10 text-destructive",
        !active &&
          "border-border text-muted-foreground hover:border-secondary/40 hover:text-secondary",
      )}
    >
      {children}
    </button>
  );
}
