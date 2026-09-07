"use client";

import { useQuery } from "@tanstack/react-query";
import { locationService, type Province } from "./location-api";
import { queryKeys } from "@/features/query-keys";

const EMPTY: Province[] = [];

/**
 * The province/city list, served from the backend so the storefront and the
 * admin panel scope shipping methods against exactly the same spellings.
 * It only changes with a deploy, so it is fetched once per session.
 */
export function useProvinces() {
  const query = useQuery({
    queryKey: queryKeys.provinces,
    queryFn: async () => {
      const res = await locationService.getProvinces();
      return res.data.data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
  return { ...query, provinces: query.data ?? EMPTY };
}

export function getCities(provinces: Province[], province: string): string[] {
  return provinces.find((p) => p.name === province)?.cities ?? [];
}

/**
 * Best-effort province lookup for addresses saved before the province picker
 * existed. A handful of city names repeat across provinces (حاجی‌آباد, نورآباد,
 * صالح‌آباد, …) and the first match wins — good enough to prefill a form the
 * user can still change, not a source of truth.
 */
export function findProvinceByCity(
  provinces: Province[],
  city: string,
): string | undefined {
  if (!city) return undefined;
  return provinces.find((p) => p.cities.includes(city))?.name;
}
