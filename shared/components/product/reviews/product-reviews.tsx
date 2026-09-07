"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, MessageSquareText } from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser, useIsLoggedIn } from "@/features/auth/queries";
import {
  useMyReview,
  useMyReviewVotes,
  useProductReviews,
  useReviewSummary,
} from "@/features/review/queries";
import {
  useCreateReview,
  useDeleteReview,
  useVoteReview,
} from "@/features/review/mutations";
import {
  clearPendingReview,
  readPendingReview,
  reviewLoginUrl,
} from "@/shared/lib/pending-review";
import { cn } from "@/shared/lib/utils";
import { ReviewForm, type ReviewDraft } from "./review-form";
import { ReviewCard } from "./review-card";
import { ReviewSummary } from "./review-summary";
import { ReviewListSkeleton, ReviewSummarySkeleton } from "./review-skeleton";
import type { ReviewSort } from "@/types/review";

const SORT_OPTIONS: { key: ReviewSort; label: string }[] = [
  { key: "newest", label: "جدیدترین" },
  { key: "helpful", label: "مفیدترین" },
  { key: "highest", label: "بیشترین امتیاز" },
  { key: "lowest", label: "کمترین امتیاز" },
];

interface ProductReviewsProps {
  productId: string;
  productSlug: string;
}

/**
 * The reviews tab of the product page. Everyone can read; only logged-in users can write.
 *
 * A visitor who submits while logged out is sent to /login with a draft parked in
 * sessionStorage. On the way back, ProductDetails opens this tab and scrolls to it, and this
 * component restores the draft and submits it once — see `shared/lib/pending-review.ts`.
 */
export function ProductReviews({ productId, productSlug }: ProductReviewsProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const autoSubmitted = useRef(false);

  const [sort, setSort] = useState<ReviewSort>("newest");
  const [restoredDraft, setRestoredDraft] = useState<ReviewDraft | null>(null);

  const isLoggedIn = useIsLoggedIn();
  const { isLoading: isUserLoading } = useCurrentUser();

  const { data: summary, isLoading: isSummaryLoading } =
    useReviewSummary(productId);
  const {
    data: pages,
    isLoading: isListLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductReviews(productId, sort);
  const { data: myReview } = useMyReview(productId);
  const { data: myVotes } = useMyReviewVotes(productId);

  const createReview = useCreateReview(productId);
  const deleteReview = useDeleteReview(productId);
  const voteReview = useVoteReview(productId, sort);

  const reviews = useMemo(
    () => pages?.pages.flatMap((p) => p.data) ?? [],
    [pages],
  );
  const total = pages?.pages[0]?.total ?? summary?.count ?? 0;

  // Coming back from login: restore what the user wrote, scroll back to it and submit once.
  // The scroll is done here rather than relying on the "#reviews" hash because the page renders
  // client-side, so the anchor may not exist yet when the browser handles the hash.
  useEffect(() => {
    if (autoSubmitted.current) return;
    const pending = readPendingReview(productId);
    if (!pending) return;

    const draft: ReviewDraft = {
      rating: pending.rating,
      comment: pending.comment,
      isRecommended: pending.isRecommended,
    };
    setRestoredDraft(draft);

    // Wait until we know who the user is before deciding to submit.
    if (isUserLoading) return;
    if (!isLoggedIn) return;

    autoSubmitted.current = true;
    clearPendingReview();
    createReview.mutate({
      productId,
      rating: draft.rating,
      comment: draft.comment || undefined,
      isRecommended: draft.isRecommended ?? undefined,
    });
    // createReview is stable enough for this one-shot effect; the ref guards re-entry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, isLoggedIn, isUserLoading]);

  const handleSubmit = (draft: ReviewDraft) => {
    setRestoredDraft(null);
    createReview.mutate({
      productId,
      rating: draft.rating,
      comment: draft.comment || undefined,
      isRecommended: draft.isRecommended ?? undefined,
    });
  };

  const handleVote = (reviewId: string, isHelpful: boolean) => {
    if (!isLoggedIn) {
      toast.error("برای رأی دادن به نظرها ابتدا وارد شوید.");
      return;
    }
    voteReview.mutate({ id: reviewId, isHelpful });
  };

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });

  return (
    <div id="reviews" aria-label="نظرات کاربران">
      {total > 0 && (
        <div className="flex items-center gap-2 mb-5 overflow-x-auto -mx-1 px-1">
          <span className="shrink-0 text-xs text-muted-foreground">
            مرتب‌سازی:
          </span>
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setSort(option.key)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors",
                sort === option.key
                  ? "border-secondary/40 bg-secondary/10 text-secondary font-medium"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Summary */}
      {isSummaryLoading ? (
        <ReviewSummarySkeleton />
      ) : (
        summary &&
        summary.count > 0 && <ReviewSummary summary={summary} />
      )}

      {/* Form */}
      <div ref={formRef} className="mt-5">
        <ReviewForm
          productId={productId}
          productSlug={productSlug}
          isLoggedIn={isLoggedIn}
          myReview={myReview ?? null}
          initialDraft={restoredDraft}
          isSubmitting={createReview.isPending}
          onSubmit={handleSubmit}
        />
      </div>

      {/* List */}
      <div className="mt-6 space-y-3">
        {isListLoading ? (
          <ReviewListSkeleton />
        ) : reviews.length === 0 ? (
          <EmptyState isLoggedIn={isLoggedIn} onWrite={scrollToForm} productSlug={productSlug} />
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              myVote={myVotes?.[review.id]}
              isMine={myReview?.id === review.id}
              onVote={(isHelpful) => handleVote(review.id, isHelpful)}
              onEdit={scrollToForm}
              onDelete={() => {
                if (confirm("نظر شما حذف شود؟")) deleteReview.mutate(review.id);
              }}
            />
          ))
        )}

        {hasNextPage && (
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full rounded-2xl border border-border bg-primary/10 py-3 text-sm font-medium text-secondary hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isFetchingNextPage && <Loader2 className="w-4 h-4 animate-spin" />}
            نمایش نظرات بیشتر
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  isLoggedIn,
  onWrite,
  productSlug,
}: {
  isLoggedIn: boolean;
  onWrite: () => void;
  productSlug: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-primary/5 py-10 px-4 text-center">
      <MessageSquareText className="w-8 h-8 text-secondary/60 mx-auto mb-3" />
      <p className="text-sm font-medium text-foreground">
        هنوز نظری برای این محصول ثبت نشده است
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        اولین نفری باش که تجربه‌اش را با بقیه‌ی دوست‌داران حیوانات به اشتراک می‌گذارد.
      </p>
      {isLoggedIn ? (
        <button
          type="button"
          onClick={onWrite}
          className="mt-4 rounded-2xl bg-secondary text-secondary-foreground px-5 py-2 text-sm font-medium hover:bg-secondary/90 transition-colors"
        >
          نوشتن اولین نظر
        </button>
      ) : (
        <Link
          href={reviewLoginUrl(productSlug)}
          className="inline-block mt-4 rounded-2xl bg-secondary text-secondary-foreground px-5 py-2 text-sm font-medium hover:bg-secondary/90 transition-colors"
        >
          ورود و ثبت نظر
        </Link>
      )}
    </div>
  );
}
