import { createAsyncThunk } from "@reduxjs/toolkit";
import { createBooking as createBookingService } from "../../services/bookingService";
import type { BookingInput } from "../../types";

export const createBookingThunk = createAsyncThunk(
  "booking/create",
  async (
    data: {
      bookingData: BookingInput;
      token: string;
    },
    thunkAPI,
  ) => {
    try {
      const response = await createBookingService(data.bookingData, data.token);
      return response;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response: { data: { message: string } } };
        return thunkAPI.rejectWithValue(axiosError.response.data.message);
      }

      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  },
);
