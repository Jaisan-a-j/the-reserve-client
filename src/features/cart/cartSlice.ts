import { createSlice } from "@reduxjs/toolkit";
import type { CartItem } from "../../types";
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
      .addCase(updateCartItemQuantityThunk.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateCartItemQuantityThunk.rejected, (state, action) => {
        state.error = action.payload as string;
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

export const { clearCartError } = cartSlice.actions;

export default cartSlice.reducer;
