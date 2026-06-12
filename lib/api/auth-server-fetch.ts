import { cookies } from "next/headers";
import { ApiError, ApiResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function authServerFetch<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...init,
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    const refresh = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (refresh.ok) {
      response = await fetch(`${API_URL}${endpoint}`, {
        ...init,
        headers: {
          Cookie: cookieHeader,
          "Content-Type": "application/json",
          ...init?.headers,
        },
        cache: "no-store",
      });
    }
  }

  if (!response.ok) {
    throw new ApiError(await response.json());
  }

  const result: ApiResponse<T> = await response.json();

  return result.data;
}
