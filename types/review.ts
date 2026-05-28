import type { UUID, ISODateString } from "./api";
import type { User } from "./user";

export type Review = {
  id: UUID;
  productId: UUID;

  userId: UUID;
  user?: User;

  rating: number;
  comment?: string;
  isApproved: boolean;

  createdAt: ISODateString;
  updatedAt: ISODateString;
};
