"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addressService, AddressInput } from "./address-api";
import { queryKeys } from "@/features/query-keys";

export function useCreateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddressInput) => {
      const res = await addressService.create(data);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.addresses }),
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<AddressInput>;
    }) => {
      const res = await addressService.update(id, data);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.addresses }),
  });
}

export function useSetDefaultAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await addressService.setDefault(id);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.addresses }),
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.addresses }),
  });
}
