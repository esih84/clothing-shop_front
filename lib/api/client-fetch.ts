import { ApiResponse } from "@/types/api";
import axios from "axios";

export const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
export async function clientFetch<T>(url: string): Promise<T> {
  const response = await clientApi.get<ApiResponse<T>>(url);

  return response.data.data;
}

export async function clientPost<T>(url: string, body: unknown): Promise<T> {
  const response = await clientApi.post<ApiResponse<T>>(url, body);

  return response.data.data;
}
