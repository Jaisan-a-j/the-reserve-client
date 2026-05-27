import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  loginUser,
  registerUser,
  loginGoogleUser,
  getCurrentUser,
} from "../../services/authService";

import type { CredentialResponse } from "@react-oauth/google";

export const registerUserThunk = createAsyncThunk(
  "auth/register",
  async (
    data: {
      fullName: string;
      email: string;
      password: string;
    },
    thunkAPI,
  ) => {
    try {
      const normalizedData = {
        ...data,
        email: data.email.trim().toLowerCase(),
      };
      const response = await registerUser(normalizedData);

      localStorage.setItem("token", response.token);

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

export const loginUserThunk = createAsyncThunk(
  "auth/login",
  async (
    data: {
      email: string;
      password: string;
    },
    thunkAPI,
  ) => {
    try {
      const normalizedData = {
        ...data,
        email: data.email.trim().toLowerCase(),
      };
      const response = await loginUser(normalizedData);

      localStorage.setItem("token", response.token);

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

export const loginGoogleThunk = createAsyncThunk(
  "auth/googleLogin",
  async (credentialResponse: CredentialResponse, thunkAPI) => {
    try {
      const response = await loginGoogleUser(credentialResponse);

      localStorage.setItem("token", response.token);

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

export const verifyUserThunk = createAsyncThunk(
  "auth/verifyUser",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const user = await getCurrentUser(token);

      return {
        user,
        token,
      };
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response: { data: { message: string } } };
        return thunkAPI.rejectWithValue(axiosError.response.data.message);
      }

      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  },
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.removeItem("token");

      return {};
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response: { data: { message: string } } };
        return thunkAPI.rejectWithValue(axiosError.response.data.message);
      }
      return thunkAPI.rejectWithValue("Logout failed");
    }
  },
);
