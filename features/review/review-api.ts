import api from "@/shared/api/client";
import type {
  OwnReview,
  Review,
  ReviewSort,
  ReviewSummary,
  ReviewVoteMap,
  ReviewVoteResult,
} from "@/types/review";
import type { ApiResponse, ApiListResponse } from "@/types/api";

export type ReviewListResponse = ApiListResponse<Review, "data">;

export type CreateReviewInput = {
  productId: string;
  rating: number;
  comment?: string;
  isRecommended?: boolean;
};

export type UpdateReviewInput = {
  rating?: number;
  comment?: string;
  isRecommended?: boolean;
};

export const reviewService = {
  create: (data: CreateReviewInput) =>
    api.post<ApiResponse<OwnReview>>("/reviews", data),

  update: (id: string, data: UpdateReviewInput) =>
    api.put<ApiResponse<OwnReview>>(`/reviews/${id}`, data),

  findByProduct: (
    productId: string,
    { page = 1, limit = 10, sort = "newest" as ReviewSort } = {},
  ) =>
    api.get<ApiResponse<ReviewListResponse>>(
      `/reviews/product/${productId}?page=${page}&limit=${limit}&sort=${sort}`,
    ),

  getSummary: (productId: string) =>
    api.get<ApiResponse<ReviewSummary>>(`/reviews/product/${productId}/summary`),

  /** The current user's own review, returned even if an admin hid it. */
  getMine: (productId: string) =>
    api.get<ApiResponse<OwnReview | null>>(
      `/reviews/product/${productId}/mine`,
    ),

  getMyVotes: (productId: string) =>
    api.get<ApiResponse<ReviewVoteMap>>(
      `/reviews/product/${productId}/my-votes`,
    ),

  vote: (id: string, isHelpful: boolean) =>
    api.post<ApiResponse<ReviewVoteResult>>(`/reviews/${id}/vote`, {
      isHelpful,
    }),

  remove: (id: string) => api.delete(`/reviews/${id}`),
};
