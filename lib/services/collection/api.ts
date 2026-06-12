import api from "@/lib/api/client";
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
    api.get<Collection[]>("/collections", {
      adapter: "fetch",
      fetchOptions: { cache: "no-store" },
    }),

  findOne: (slug: string) =>
    api.get<Collection>(`/collections/${slug}`, {
      adapter: "fetch",
      fetchOptions: { cache: "no-store" },
    }),

  create: (data: CreateCollectionInput) =>
    api.post<Collection>("/collections", { data: JSON.stringify(data) }),

  update: (id: string, data: Partial<CreateCollectionInput>) =>
    api.put<Collection>(`/collections/${id}`, { data: JSON.stringify(data) }),

  remove: (id: string) =>
    api.delete<{ success: boolean }>(`/collections/${id}`),
};
