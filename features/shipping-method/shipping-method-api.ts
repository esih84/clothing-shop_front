import api from "@/shared/api/client";
import type { ApiResponse } from "@/types/api";

export interface ShippingMethod {
  id: string;
  label: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  /** Cities the method is offered in; an empty list means every city. */
  cities: string[];
  /** Hide the global methods in this method's cities. */
  replacesGlobal: boolean;
  order: number;
}

export const shippingMethodService = {
  getActive: () =>
    api.get<ApiResponse<ShippingMethod[]>>("/shipping-methods/active"),
};
