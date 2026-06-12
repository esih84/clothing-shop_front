import { cookies } from "next/headers";
import { ApiError, ApiErrorResponse, ApiResponse } from "@/types/api";

type ServerFetchOptions = RequestInit & {
  revalidate?: number;
  tags?: string[];
  auth?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function serverFetch<T>(
  endpoint: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  const { revalidate, tags, auth = false, headers, ...fetchOptions } = options;

  let cookieHeader = "";

  if (auth) {
    const cookieStore = await cookies();

    cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(auth && { Cookie: cookieHeader }),
      ...headers,
    },
    next: {
      revalidate,
      tags,
    },
  });

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json();

    throw new ApiError(error);
  }

  const result: ApiResponse<T> = await response.json();

  return result.data;
}
