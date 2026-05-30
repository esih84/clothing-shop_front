import { wishlistService, AddWishlistItemInput } from "./api";

export async function useServerWishlist() {
  try {
    const wishlist = await wishlistService.getWishlist();
    return { data: wishlist, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function useServerAddWishlistItem(data: AddWishlistItemInput) {
  try {
    const item = await wishlistService.addItem(data);
    return { data: item, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function useServerRemoveWishlistItem(productId: string) {
  try {
    const result = await wishlistService.removeItem(productId);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
