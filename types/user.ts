import type { UUID, ISODateString } from "./api";

export type Role = "USER" | "ADMIN" | string; // چون Role از بک‌اند کاملش را نداریم

export type User = {
  id: UUID;
  phone: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string; // type: 'date' => معمولاً "YYYY-MM-DD"
  role: Role;
  isActive: boolean;
  referralCode?: string;
  referredBy?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};
