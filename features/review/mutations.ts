"use client";

import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  reviewService,
  type CreateReviewInput,
  type ReviewListResponse,
  type UpdateReviewInput,
} from "./review-api";
import { queryKeys } from "@/features/query-keys";
import { getApiErrorMessage } from "@/shared/api/get-error-message";
import type { ReviewVoteMap } from "@/types/review";

/**
 * Submits a review. The backend turns a second submission for the same product into an edit,
 * so the caller never has to branch on "did I already review this".
 */
export function useCreateReview(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateReviewInput) => {
      const res = await reviewService.create(data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.productReviews(productId) });
      toast.success("نظر شما ثبت شد. ممنون که تجربه‌ات را نوشتی!");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useUpdateReview(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateReviewInput;
    }) => {
      const res = await reviewService.update(id, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.productReviews(productId) });
      toast.success("نظر شما ویرایش شد.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useDeleteReview(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.productReviews(productId) });
      toast.success("نظر شما حذف شد.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

/**
 * Helpful / not-helpful vote, applied optimistically so the counter reacts instantly.
 * Voting the same way twice clears the vote — the same rule the backend applies.
 */
export function useVoteReview(productId: string, sort: string) {
  const qc = useQueryClient();
  const listKey = queryKeys.productReviewList(productId, sort);
  const votesKey = queryKeys.myProductReviewVotes(productId);

  return useMutation({
    mutationFn: async ({
      id,
      isHelpful,
    }: {
      id: string;
      isHelpful: boolean;
    }) => {
      const res = await reviewService.vote(id, isHelpful);
      return res.data.data;
    },
    onMutate: async ({ id, isHelpful }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: listKey }),
        qc.cancelQueries({ queryKey: votesKey }),
      ]);

      const previousList =
        qc.getQueryData<InfiniteData<ReviewListResponse>>(listKey);
      const previousVotes = qc.getQueryData<ReviewVoteMap>(votesKey);

      const current = previousVotes?.[id];
      // Same button again = remove the vote; other button = move it across.
      const next = current === isHelpful ? undefined : isHelpful;

      qc.setQueryData<ReviewVoteMap>(votesKey, (old) => {
        const copy = { ...(old ?? {}) };
        if (next === undefined) delete copy[id];
        else copy[id] = next;
        return copy;
      });

      qc.setQueryData<InfiniteData<ReviewListResponse>>(listKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((review) => {
              if (review.id !== id) return review;
              let { helpfulCount, notHelpfulCount } = review;
              if (current === true) helpfulCount -= 1;
              if (current === false) notHelpfulCount -= 1;
              if (next === true) helpfulCount += 1;
              if (next === false) notHelpfulCount += 1;
              return {
                ...review,
                helpfulCount: Math.max(0, helpfulCount),
                notHelpfulCount: Math.max(0, notHelpfulCount),
              };
            }),
          })),
        };
      });

      return { previousList, previousVotes };
    },
    onError: (err, _vars, context) => {
      if (context?.previousList) qc.setQueryData(listKey, context.previousList);
      if (context?.previousVotes)
        qc.setQueryData(votesKey, context.previousVotes);
      toast.error(getApiErrorMessage(err));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: votesKey });
    },
  });
}
