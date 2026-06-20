import api from "@/shared/api/client";
import { User } from "@/types/user";

export const userService = {
  getMe: () =>
    api.get<User>("/users/me", {
      adapter: "fetch",
      fetchOptions: { cache: "no-store" },
    }),

  updateMe: (data: Partial<User>) => api.put<User>("/users/me", data),
};
