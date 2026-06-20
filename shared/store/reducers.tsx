import { combineReducers } from "redux";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
export const reducers = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
});
