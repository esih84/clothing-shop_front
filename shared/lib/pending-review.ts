/**
 * A review a logged-out visitor already wrote, parked until they come back from login.
 *
 * Same idea as `pending-order` in checkout: the draft survives the round trip through /login in
 * sessionStorage, and the product page picks it up on mount, scrolls back to the reviews section
 * and submits it. Without this the user would lose everything they typed.
 */

const PENDING_REVIEW_KEY = "pending-review";

export type PendingReview = {
  productId: string;
  productSlug: string;
  rating: number;
  comment: string;
  isRecommended: boolean | null;
};

export function savePendingReview(draft: PendingReview): void {
  try {
    sessionStorage.setItem(PENDING_REVIEW_KEY, JSON.stringify(draft));
  } catch {
    // Private mode / storage full — the user just loses the draft, not the flow.
  }
}

/** Reads the draft only if it belongs to this product; anything else is discarded. */
export function readPendingReview(productId: string): PendingReview | null {
  try {
    const raw = sessionStorage.getItem(PENDING_REVIEW_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as PendingReview;
    if (draft?.productId !== productId) return null;
    return draft;
  } catch {
    return null;
  }
}

export function clearPendingReview(): void {
  try {
    sessionStorage.removeItem(PENDING_REVIEW_KEY);
  } catch {
    // ignore
  }
}

/**
 * Login URL that brings the user back to the reviews section of the product they were on.
 * The hash survives because the login page pushes the `redirect` value as-is.
 */
export function reviewLoginUrl(productSlug: string): string {
  return `/login?redirect=${encodeURIComponent(
    `/product/${productSlug}#reviews`,
  )}`;
}
