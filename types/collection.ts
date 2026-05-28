import type { UUID, ISODateString } from "./api";
import type { Product } from "./product";

export type Collection = {
  id: UUID;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;

  products?: Product[];

  createdAt: ISODateString;
  updatedAt: ISODateString;
};
