"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { reviewService } from "./review-api";
import { queryKeys } from "@/features/query-keys";
import { useIsLoggedIn } from "@/features/auth/queries";
import type {
  OwnReview,
  ReviewSort,
  ReviewSummary,
  ReviewVoteMap,
} from "@/types/review";

/** Reviews per "load more" page. */
export const REVIEWS_PAGE_SIZE = 5;

/** Paginated reviews for a product, newest first by default. Public — no auth needed. */
export function useProductReviews(productId: string, sort: ReviewSort) {
  return useInfiniteQuery({
    queryKey: queryKeys.productReviewList(productId, sort),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await reviewService.findByProduct(productId, {
        page: pageParam,
        limit: REVIEWS_PAGE_SIZE,
        sort,
      });
      return res.data.data;
    },
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
  });
}

export function useReviewSummary(productId: string) {
  return useQuery<ReviewSummary>({
    queryKey: queryKeys.productReviewSummary(productId),
    queryFn: async () => {
      const res = await reviewService.getSummary(productId);
      return res.data.data;
    },
  });
}

/** The current user's own review, so the form can switch to "edit" mode. */
export function useMyReview(productId: string) {
  const isLoggedIn = useIsLoggedIn();
  return useQuery<OwnReview | null>({
    queryKey: queryKeys.myProductReview(productId),
    queryFn: async () => {
      const res = await reviewService.getMine(productId);
      return res.data.data ?? null;
    },
    enabled: isLoggedIn,
  });
}

/**
 * The current user's helpful votes, merged into the list client-side. The list endpoint is
 * public and therefore cannot know who is asking.
 */
export function useMyReviewVotes(productId: string) {
  const isLoggedIn = useIsLoggedIn();
  return useQuery<ReviewVoteMap>({
    queryKey: queryKeys.myProductReviewVotes(productId),
    queryFn: async () => {
      const res = await reviewService.getMyVotes(productId);
      return res.data.data ?? {};
    },
    enabled: isLoggedIn,
  });
}
