import { createSlice } from "@reduxjs/toolkit";
import type { UserOrder } from "../../types";
import { createOrderThunk, getMyOrdersThunk } from "./orderThunk";

interface OrderState {
  items: UserOrder[];
  loading: boolean;
  error: string | null;
  latestOrderId: string | null;
}

const initialState: OrderState = {
  items: [],
  loading: false,
  error: null,
  latestOrderId: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.latestOrderId = action.payload.order?._id ?? null;
        if (action.payload.order) {
          state.items = [action.payload.order, ...state.items];
        }
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Unable to place your order.";
      })
      .addCase(getMyOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.orders ?? [];
      })
      .addCase(getMyOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Unable to load your orders.";
      });
  },
});

export const { clearOrderError } = orderSlice.actions;

export default orderSlice.reducer;
