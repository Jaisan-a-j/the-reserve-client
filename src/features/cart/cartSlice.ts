import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, FoodItem } from "../../types";
import { logoutThunk } from "../auth/authThunk";
import {
  addCartItemThunk,
  getCartItemsThunk,
  removeCartItemThunk,
  updateCartItemQuantityThunk,
} from "./cartThunk";

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
    addCartItemLocal: (state, action: PayloadAction<FoodItem>) => {
      const food = action.payload;
      const item = state.items.find(
        (cartItem) => cartItem.food._id === food._id,
      );

      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({
          _id: food._id,
          food,
          quantity: 1,
        });
      }
    },
    setCartItemQuantityLocal: (
      state,
      action: PayloadAction<{ foodId: string; quantity: number }>,
    ) => {
      const item = state.items.find(
        (cartItem) => cartItem.food._id === action.payload.foodId,
      );

      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCartItemsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartItemsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getCartItemsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addCartItemThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCartItemThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addCartItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCartItemQuantityThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItemQuantityThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(updateCartItemQuantityThunk.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(removeCartItemThunk.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeCartItemThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.items = [];
        state.error = null;
      });
  },
});

export const { addCartItemLocal, clearCartError, setCartItemQuantityLocal } =
  cartSlice.actions;

export default cartSlice.reducer;
