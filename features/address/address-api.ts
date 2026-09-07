import api from "@/shared/api/client";
import type { ApiResponse } from "@/types/api";

export interface Address {
  id: string;
  label: string;
  /** Optional: addresses saved before the province picker existed have none. */
  province?: string;
  city: string;
  address: string;
  plaque: string;
  postalCode?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AddressInput = {
  label: string;
  province: string;
  city: string;
  address: string;
  plaque: string;
  postalCode?: string;
  isDefault?: boolean;
};

export const addressService = {
  getAll: () => api.get<ApiResponse<Address[]>>("/users/me/addresses"),
  create: (data: AddressInput) =>
    api.post<ApiResponse<Address>>("/users/me/addresses", data),
  update: (id: string, data: Partial<AddressInput>) =>
    api.patch<ApiResponse<Address>>(`/users/me/addresses/${id}`, data),
  setDefault: (id: string) =>
    api.patch<ApiResponse<Address>>(`/users/me/addresses/${id}/default`),
  remove: (id: string) => api.delete(`/users/me/addresses/${id}`),
};
