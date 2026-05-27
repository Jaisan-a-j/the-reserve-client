import { createSlice } from "@reduxjs/toolkit";

import type { AuthState } from "../../types";

import {
  loginUserThunk,
  registerUserThunk,
  loginGoogleThunk,
  verifyUserThunk,
  verifyOtpThunk,
  logoutThunk,
} from "./authThunk";

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
  minLoaderDuration: 1000,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.minLoaderDuration = 1000;
      })

      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })

      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.minLoaderDuration = 1000;
      })

      .addCase(registerUserThunk.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
        state.minLoaderDuration = 1000;
      })

      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })

      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(loginGoogleThunk.pending, (state) => {
        state.loading = true;
        state.minLoaderDuration = 1000;
      })

      .addCase(loginGoogleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })

      .addCase(loginGoogleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
        state.minLoaderDuration = 1000;
      })

      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.minLoaderDuration = 1000;
      })

      .addCase(logoutThunk.rejected, (state) => {
        state.loading = false;
        state.minLoaderDuration = 1000;
      })

      .addCase(verifyUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
