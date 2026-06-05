import { createSlice } from "@reduxjs/toolkit";
import { createOrderThunk } from "./orderThunk";

interface OrderState {
  loading: boolean;
  error: string | null;
  latestOrderId: string | null;
}

const initialState: OrderState = {
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
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Unable to place your order.";
      });
  },
});

export const { clearOrderError } = orderSlice.actions;

export default orderSlice.reducer;
