/**
 * A review as the public endpoint returns it.
 *
 * The backend maps the entity down to exactly these fields (`toPublicReview`) — no `userId`,
 * no `user` relation, no `isApproved`. If a field you need is missing here, add it to the
 * mapper on the backend rather than widening this type.
 */
export type Review = {
  id: string;
  rating: number;
  comment?: string;
  /** "I recommend it" / "I don't"; null when the reviewer skipped the question. */
  isRecommended: boolean | null;
  helpfulCount: number;
  notHelpfulCount: number;
  /** Derived from the reviewer's paid orders for this product. */
  isVerifiedPurchase: boolean;
  /** Display name, already composed server-side (falls back to a neutral label). */
  authorName: string;
  createdAt: string;
};

/** The user's own review also carries the visibility flag, so they can be told it was hidden. */
export type OwnReview = Review & { isApproved: boolean };

export type ReviewSort = "newest" | "helpful" | "highest" | "lowest";

export type ReviewSummary = {
  average: number;
  count: number;
  /** Number of reviews per star level, keys "1".."5" — always all five. */
  breakdown: Record<string, number>;
  recommendedPercentage: number | null;
};

/** What a vote returns: the fresh counters for that review. */
export type ReviewVoteResult = {
  id: string;
  helpfulCount: number;
  notHelpfulCount: number;
};

/** The current user's votes on a product's reviews: `{ [reviewId]: isHelpful }`. */
export type ReviewVoteMap = Record<string, boolean>;
