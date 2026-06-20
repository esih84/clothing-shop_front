import { serverFetch } from "@/shared/api/server-fetch";
import type { Banner } from "@/types/banner";

export const bannerService = {
  async findAll(positions?: string | string[]) {
    const params = new URLSearchParams();

    if (positions) {
      params.set(
        "position",
        Array.isArray(positions) ? positions.join(",") : positions,
      );
    }

    return serverFetch<Banner[]>(`/banners?${params.toString()}`, {
      revalidate: 300,
      tags: ["banners"],
    });
  },
};

/* خواندن سمت سرور — برای استفاده در Server Componentها */
export async function getBanners(positions?: string | string[]) {
  try {
    const data = await bannerService.findAll(positions);
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
