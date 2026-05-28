import type { UUID, ISODateString } from "./api";

export type BannerPosition = string; // اگر enum داری بعداً دقیق‌ترش می‌کنیم (مثل "home" | "category" ...)

export type Banner = {
  id: UUID;
  title: string;
  imageUrl: string;
  mobileImageUrl?: string;
  link?: string;
  position: BannerPosition;
  order: number;
  isActive: boolean;
  startDate?: ISODateString;
  endDate?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};
