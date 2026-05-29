import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { CartItem } from "../../types";
import {
  addCartItem,
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from "../../services/cartService";

type CartResponse = {
  data: CartItem[];
};

const getToken = (state: RootState) => state.auth.token;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response: { data: { message: string } } };
    return axiosError.response.data.message;
  }

  return fallback;
};

export const getCartItemsThunk = createAsyncThunk(
  "cart/getItems",
  async (_, thunkAPI) => {
    const token = getToken(thunkAPI.getState() as RootState);

    if (!token) {
      return thunkAPI.rejectWithValue("Please login to view your cart.");
    }

    try {
      const response = (await getCartItems(token)) as CartResponse;
      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Unable to load cart items."),
      );
    }
  },
);

export const addCartItemThunk = createAsyncThunk(
  "cart/addItem",
  async (data: { foodId: string; quantity?: number }, thunkAPI) => {
    const token = getToken(thunkAPI.getState() as RootState);

    if (!token) {
      return thunkAPI.rejectWithValue("Please login to add items to cart.");
    }

    try {
      const response = (await addCartItem(data, token)) as CartResponse;
      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Unable to add item to cart."),
      );
    }
  },
);

export const updateCartItemQuantityThunk = createAsyncThunk(
  "cart/updateQuantity",
  async (data: { foodId: string; quantity: number }, thunkAPI) => {
    const token = getToken(thunkAPI.getState() as RootState);

    if (!token) {
      return thunkAPI.rejectWithValue("Please login to update your cart.");
    }

    try {
      const response = (await updateCartItemQuantity(data, token)) as CartResponse;
      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Unable to update cart item."),
      );
    }
  },
);

export const removeCartItemThunk = createAsyncThunk(
  "cart/removeItem",
  async (foodId: string, thunkAPI) => {
    const token = getToken(thunkAPI.getState() as RootState);

    if (!token) {
      return thunkAPI.rejectWithValue("Please login to update your cart.");
    }

    try {
      const response = (await removeCartItem(foodId, token)) as CartResponse;
      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Unable to remove cart item."),
      );
    }
  },
);
