import { cartService } from "./api";

export async function useServerCart() {
  try {
    const cart = await cartService.getCart();
    return { data: cart, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function useServerAddCartItem(variantId: string, quantity: number = 1) {
  try {
    const result = await cartService.addItem(variantId, quantity);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function useServerUpdateCartItem(itemId: string, quantity: number) {
  try {
    const result = await cartService.updateItem(itemId, quantity);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function useServerRemoveCartItem(itemId: string) {
  try {
    const result = await cartService.removeItem(itemId);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function useServerClearCart() {
  try {
    const result = await cartService.clear();
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
