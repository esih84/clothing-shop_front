import { reviewService, CreateReviewInput } from "./api";

export async function createReview(data: CreateReviewInput) {
  try {
    const review = await reviewService.create(data);
    return { data: review, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getReviewsByProduct(productId: string, page = 1, limit = 20) {
  try {
    const reviews = await reviewService.findByProduct(productId, page, limit);
    return { data: reviews, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function approveReview(id: string) {
  try {
    const review = await reviewService.approve(id);
    return { data: review, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function removeReview(id: string) {
  try {
    const result = await reviewService.remove(id);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
