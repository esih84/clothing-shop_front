import { userService } from "./api";

export async function useServerMe() {
  try {
    const user = await userService.getMe();
    return { data: user, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function useServerUpdateMe(data: any) {
  try {
    const user = await userService.updateMe(data);
    return { data: user, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
