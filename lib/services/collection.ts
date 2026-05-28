import { api } from "@/lib/api/api";
import { Collection } from "@/types/collection";

export type CreateCollectionInput = {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  productIds?: string[];
};

export const collectionService = {
  findAll: () =>
    api<Collection[]>("/collections", {
      next: { revalidate: 60 },
    }),

  findOne: (slug: string) =>
    api<Collection>(`/collections/${slug}`, {
      next: { revalidate: 60 },
    }),

  create: (data: CreateCollectionInput) =>
    api<Collection>("/collections", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateCollectionInput>) =>
    api<Collection>(`/collections/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    api<{ success: boolean }>(`/collections/${id}`, {
      method: "DELETE",
    }),
};
