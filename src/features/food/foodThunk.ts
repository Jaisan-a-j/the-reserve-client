import { createAsyncThunk } from "@reduxjs/toolkit";
import { getFoodItems as getFoodItemsService } from "../../services/foodService";
import type { FoodItem } from "../../types";

type FoodItemsResponse = {
  data: FoodItem[];
};

export const getFoodItemsThunk = createAsyncThunk(
  "food/getItems",
  async (_, thunkAPI) => {
    try {
      const response = (await getFoodItemsService()) as FoodItemsResponse;
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response: { data: { message: string } } };
        return thunkAPI.rejectWithValue(axiosError.response.data.message);
      }

      return thunkAPI.rejectWithValue("Unable to load menu items.");
    }
  },
);
