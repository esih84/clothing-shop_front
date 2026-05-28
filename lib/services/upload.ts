import { api } from "@/lib/api/api";

export type UploadImageResponse = {
  url: string;
  key?: string;
};

export const uploadService = {
  uploadImage: async (file: File): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    return api<UploadImageResponse>("/upload/image", {
      method: "POST",
      body: formData,
      // مهم: برای FormData نباید Content-Type را دستی ست کنی
      isFormData: true,
    } as any);
  },
};
