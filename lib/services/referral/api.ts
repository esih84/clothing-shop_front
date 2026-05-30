import api from "@/lib/api/api";
import { Referral } from "@/types/referral";

export const referralService = {
  getReferrals: () =>
    api.get<Referral[]>("/referrals", { adapter: "fetch", fetchOptions: { cache: "no-store" } }),
};
