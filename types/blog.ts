import type { UUID, ISODateString } from "./api";
import type { User } from "./user";

export type Blog = {
  id: UUID;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;

  authorId?: UUID;
  author?: User;

  featuredImage?: string;
  publishedAt?: ISODateString;
  isPublished: boolean;

  createdAt: ISODateString;
  updatedAt: ISODateString;
};
