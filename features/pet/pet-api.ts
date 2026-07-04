import api from "@/shared/api/client";
import type { ApiResponse } from "@/types/api";

export type PetType = "dog" | "cat" | "bird" | "other";

export interface Pet {
  id: string;
  name: string;
  type?: PetType;
  breed?: string;
  birthDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type PetInput = {
  name: string;
  type?: PetType;
  breed?: string;
  birthDate?: string;
};

export const petService = {
  getAll: () => api.get<ApiResponse<Pet[]>>("/users/me/pets"),
  create: (data: PetInput) =>
    api.post<ApiResponse<Pet>>("/users/me/pets", data),
  update: (id: string, data: Partial<PetInput>) =>
    api.patch<ApiResponse<Pet>>(`/users/me/pets/${id}`, data),
  remove: (id: string) => api.delete(`/users/me/pets/${id}`),
};
