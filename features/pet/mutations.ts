"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { petService, PetInput } from "./pet-api";
import { queryKeys } from "@/features/query-keys";

export function useCreatePet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: PetInput) => {
      const res = await petService.create(data);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.pets }),
  });
}

export function useUpdatePet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PetInput> }) => {
      const res = await petService.update(id, data);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.pets }),
  });
}

export function useDeletePet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => petService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.pets }),
  });
}
