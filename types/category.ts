import type { UUID, ISODateString } from "./api";

export type Category = {
  id: UUID;
  name: string;
  slug: string;
  imageUrl?: string;
  description?: string;
  order: number;
  isActive: boolean;

  parentId?: UUID;
  parent?: Category | null;
  children?: Category[];

  createdAt: ISODateString;
  updatedAt: ISODateString;
};
