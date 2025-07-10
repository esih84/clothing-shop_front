import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface CartItem {
  id: string
  name: string
  size: string
  color?: string
  price: number
  quantity: number
  imageUrl: string
}

interface CartState {
  items: CartItem[]
  total: number
}

const initialState: CartState = {
  items: [],
  total: 0,
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id && item.size === action.payload.size && item.color === action.payload.color,
      )

      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }

      state.total = calculateTotal(state.items)
    },
    removeFromCart: (state, action: PayloadAction<{ id: string; size: string; color?: string }>) => {
      state.items = state.items.filter(
        (item) =>
          !(item.id === action.payload.id && item.size === action.payload.size && item.color === action.payload.color),
      )
      state.total = calculateTotal(state.items)
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; size: string; color?: string; quantity: number }>) => {
      const item = state.items.find(
        (item) =>
          item.id === action.payload.id && item.size === action.payload.size && item.color === action.payload.color,
      )

      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (item) =>
              !(
                item.id === action.payload.id &&
                item.size === action.payload.size &&
                item.color === action.payload.color
              ),
          )
        } else {
          item.quantity = action.payload.quantity
        }
      }

      state.total = calculateTotal(state.items)
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
