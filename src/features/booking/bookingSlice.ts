import { createSlice } from "@reduxjs/toolkit";
import { createBookingThunk } from "./bookingThunk";

interface BookingState {
  loading: boolean;
  success: boolean;
  error: string | null;
  message: string | null;
}

const initialState: BookingState = {
  loading: false,
  success: false,
  error: null,
  message: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,

  reducers: {
    clearBookingMessage: (state) => {
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBookingThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.message =
          "Your table is reserved! A confirmation email has already been sent to you.";
      })
      .addCase(createBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          (action.payload as string) ||
          "Booking failed. Please try again later.";
      });
  },
});

export const { clearBookingMessage } = bookingSlice.actions;

export default bookingSlice.reducer;
