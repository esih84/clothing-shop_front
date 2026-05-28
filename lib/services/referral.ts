import { api } from "@/lib/api/api";
import { Referral } from "@/types/referral";

export const referralService = {
  getReferrals: () =>
    api<Referral[]>("/referrals", {
      cache: "no-store",
    }),
};
