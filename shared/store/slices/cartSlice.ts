import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  /** Item id = productId */
  id: string;
  name: string;
  /** Payable price (with discount if any). */
  price: number;
  /** Product base price; used for the strikethrough display if there is a discount. */
  originalPrice?: number;
  quantity: number;
  imageUrl: string;
  /** Stock quantity; if present, the guest cart quantity is capped to it. */
  stock?: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      // id is the productId
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        // The new stock (if present) is updated on this item
        if (action.payload.stock != null) existingItem.stock = action.payload.stock;
        const next = existingItem.quantity + action.payload.quantity;
        existingItem.quantity =
          existingItem.stock != null ? Math.min(next, existingItem.stock) : next;
      } else {
        const item = { ...action.payload };
        if (item.stock != null) item.quantity = Math.min(item.quantity, item.stock);
        state.items.push(item);
      }
    },
    removeFromCart: (state, action: PayloadAction<{ id: string }>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item && action.payload.quantity >= 1) {
        item.quantity =
          item.stock != null
            ? Math.min(action.payload.quantity, item.stock)
            : action.payload.quantity;
      } else if (item && action.payload.quantity < 1) {
        // Remove item if quantity becomes 0 or negative
        state.items = state.items.filter(
          (cartItem) => cartItem.id !== action.payload.id
        );
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
