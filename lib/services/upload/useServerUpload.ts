import { uploadService } from "./api";

export async function uploadImage(file: File) {
  try {
    const result = await uploadService.uploadImage(file);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
