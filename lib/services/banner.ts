import { api } from "@/lib/api/api";
import { Banner } from "@/types/banner";

export type CreateBannerInput = {
  title: string;
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
  findAll: () =>
    api<Banner[]>("/banners", {
      next: { revalidate: 60 },
    }),

  create: (data: CreateBannerInput) =>
    api<Banner>("/banners", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateBannerInput>) =>
    api<Banner>(`/banners/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    api<{ success: boolean }>(`/banners/${id}`, {
      method: "DELETE",
    }),
};
