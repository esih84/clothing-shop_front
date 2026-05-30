import type { Banner } from "@/types/banner";
import api from "@/lib/api/api";

export type CreateBannerInput = {
  title: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  link?: string;
  position?: string;
  order?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
};

export const bannerService = {
  findAll: async (positions?: string | string[]) => {
    const params: Record<string, string> = {};
    if (positions) {
      params.positions = Array.isArray(positions)
        ? positions.join(",")
        : positions;
    }
    const res = await api.get<Banner[]>("/banners", { params, adapter: "fetch", fetchOptions: { cache: "no-store" } });
    return res.data;
  },
  create: async (data: CreateBannerInput) => {
    const res = await api.post<Banner>("/banners", data);
    return res.data;
  },
  update: async (id: string, data: Partial<CreateBannerInput>) => {
    const res = await api.put<Banner>(`/banners/${id}`, data);
    return res.data;
  },
  remove: async (id: string) => {
    const res = await api.delete<{ success: boolean }>(`/banners/${id}`);
    return res.data;
  },
};
