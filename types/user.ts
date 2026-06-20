export type Role = "USER" | "ADMIN" | string; // چون Role از بک‌اند کاملش را نداریم

export type User = {
  id: string;
  phone: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string; // type: 'date' => معمولاً "YYYY-MM-DD"
  role: Role;
  isActive: boolean;
  referralCode?: string;
  referredBy?: string;
  createdAt: string;
  updatedAt: string;
};
