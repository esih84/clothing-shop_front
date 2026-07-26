export type Role = "USER" | "ADMIN" | string; // Since we don't have the full Role from the backend

export type User = {
  id: string;
  phone: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string; // type: 'date' => usually "YYYY-MM-DD"
  role: Role;
  isActive: boolean;
  referralCode?: string;
  referredBy?: string;
  createdAt: string;
  updatedAt: string;
};
