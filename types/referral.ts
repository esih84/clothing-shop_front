import type { UUID, ISODateString } from "./api";
import type { User } from "./user";

export type ReferralStatus = "pending" | "completed";

export type Referral = {
  id: UUID;

  referrerId: UUID;
  referrer?: User;

  referredId?: UUID;
  referred?: User | null;

  code: string;
  status: ReferralStatus;

  referrerReward: number;
  referredReward: number;

  completedAt?: ISODateString;
  createdAt: ISODateString;
};
