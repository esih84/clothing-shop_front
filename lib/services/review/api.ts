import api from "@/lib/api/client";
import { Review } from "@/types/review";
import { ApiListResponse } from "@/types/api";

export type CreateReviewInput = {
  productId: string;
  rating: number;
  comment?: string;
};

export const reviewService = {
  create: (data: CreateReviewInput) =>
    api.post<Review>("/reviews", { data: JSON.stringify(data) }),

  findByProduct: (productId: string, page = 1, limit = 20) =>
    api.get<ApiListResponse<Review>>(
      `/reviews/product/${productId}?page=${page}&limit=${limit}`,
      { adapter: "fetch", fetchOptions: { cache: "no-store" } },
    ),

  approve: (id: string) => api.put<Review>(`/reviews/${id}/approve`),

  remove: (id: string) => api.delete<{ success: boolean }>(`/reviews/${id}`),
};
