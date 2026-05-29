import { createSlice } from "@reduxjs/toolkit";
import type { FoodItem } from "../../types";
import { getFoodItemsThunk } from "./foodThunk";

interface FoodState {
  items: FoodItem[];
  loading: boolean;
  error: string | null;
}

const initialState: FoodState = {
  items: [],
  loading: false,
  error: null,
};

const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFoodItemsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFoodItemsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getFoodItemsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Unable to load menu items.";
      });
  },
});

export default foodSlice.reducer;
