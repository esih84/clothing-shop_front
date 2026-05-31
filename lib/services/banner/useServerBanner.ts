import { bannerService } from "./api";

export async function getBanners(positions?: string | string[]) {
  try {
    const banners = await bannerService.findAll(positions);
    return { data: banners, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
