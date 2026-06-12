import { serverFetch } from "@/lib/api/server-fetch";
import type { Banner } from "@/types/banner";

export const bannerService = {
  async findAll(positions?: string | string[]) {
    const params = new URLSearchParams();

    if (positions) {
      params.set(
        "positions",
        Array.isArray(positions) ? positions.join(",") : positions,
      );
    }

    return serverFetch<Banner[]>(`/banners?${params.toString()}`, {
      revalidate: 300,
      tags: ["banners"],
    });
  },
};
