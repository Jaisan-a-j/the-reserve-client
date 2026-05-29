import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bookingReducer from "../features/booking/bookingSlice";
import cartReducer from "../features/cart/cartSlice";
import foodReducer from "../features/food/foodSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    cart: cartReducer,
    food: foodReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
