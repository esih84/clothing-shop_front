import { referralService } from "./api";

export async function useServerReferrals() {
  try {
    const referrals = await referralService.getReferrals();
    return { data: referrals, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
