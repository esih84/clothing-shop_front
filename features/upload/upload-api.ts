import api from "@/shared/api/client";

export type UploadImageResponse = {
  url: string;
  key?: string;
};

export const uploadService = {
  uploadImage: async (file: File): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<UploadImageResponse>("/upload/image", { data: formData });
  },
};
