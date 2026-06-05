import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { OrderInput } from "../../types";
import { createOrder } from "../../services/orderService";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response: { data: { message: string } } };
    return axiosError.response.data.message;
  }

  return fallback;
};

export const createOrderThunk = createAsyncThunk(
  "order/create",
  async (orderData: OrderInput, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("Please login to place your order.");
    }

    try {
      return await createOrder(orderData, token);
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Unable to place your order."),
      );
    }
  },
);
