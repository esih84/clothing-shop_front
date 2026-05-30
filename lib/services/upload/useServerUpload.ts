import { uploadService } from "./api";

export async function useServerUploadImage(file: File) {
  try {
    const result = await uploadService.uploadImage(file);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
