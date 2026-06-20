import api from "@/shared/api/client";
import { Referral } from "@/types/referral";

export const referralService = {
  getReferrals: () =>
    api.get<Referral[]>("/referrals", {
      adapter: "fetch",
      fetchOptions: { cache: "no-store" },
    }),
};
