import { api } from "@/lib/api/api";
import { Review } from "@/types/review";
import { ApiListResponse } from "@/types/api";

export type CreateReviewInput = {
  productId: string;
  rating: number;
  comment?: string;
};

export const reviewService = {
  create: (data: CreateReviewInput) =>
    api<Review>("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  findByProduct: (productId: string, page = 1, limit = 20) =>
    api<ApiListResponse<Review>>(
      `/reviews/product/${productId}?page=${page}&limit=${limit}`,
      {
        next: { revalidate: 30 },
      },
    ),

  approve: (id: string) =>
    api<Review>(`/reviews/${id}/approve`, {
      method: "PUT",
    }),

  remove: (id: string) =>
    api<{ success: boolean }>(`/reviews/${id}`, {
      method: "DELETE",
    }),
};
