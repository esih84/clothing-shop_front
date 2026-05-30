import type { User } from "./user";

export type Review = {
  id: string;
  productId: string;

  userId: string;
  user?: User;

  rating: number;
  comment?: string;
  isApproved: boolean;

  createdAt: string;
  updatedAt: string;
};
