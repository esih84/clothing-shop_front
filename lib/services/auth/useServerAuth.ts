import { authService } from "./api";

export async function useServerSendOtp(phone: string) {
  try {
    const result = await authService.sendOtp(phone);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function useServerVerifyOtp(phone: string, code: string) {
  try {
    const result = await authService.verifyOtp(phone, code);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function useServerRefresh(refreshToken: string) {
  try {
    const result = await authService.refresh(refreshToken);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
