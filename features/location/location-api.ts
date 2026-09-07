import api from "@/shared/api/client";
import type { ApiResponse } from "@/types/api";

export interface Province {
  name: string;
  cities: string[];
}

export const locationService = {
  getProvinces: () =>
    api.get<ApiResponse<Province[]>>("/locations/provinces"),
};
