import { api } from "@/lib/api/api";
import { User } from "@/types/user";

export const userService = {
  getMe: () => api<User>("/users/me", { cache: "no-store" }),

  updateMe: (data: Partial<User>) =>
    api<User>("/users/me", { method: "PUT", body: JSON.stringify(data) }),
};
