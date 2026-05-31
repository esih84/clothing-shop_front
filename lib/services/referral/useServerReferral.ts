import { referralService } from "./api";

export async function getReferrals() {
  try {
    const referrals = await referralService.getReferrals();
    return { data: referrals, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
