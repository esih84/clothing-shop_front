import { authService } from "./api";

export async function sendOtp(phone: string) {
  try {
    const result = await authService.sendOtp(phone);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function verifyOtp(phone: string, code: string) {
  try {
    const result = await authService.verifyOtp(phone, code);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function refreshToken(refreshToken: string) {
  try {
    const result = await authService.refresh(refreshToken);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
