import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendChatMessage } from "../../services/chatService";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response: { data: { message: string } } };
    return axiosError.response?.data?.message ?? fallback;
  }

  return fallback;
};

export const sendChatMessageThunk = createAsyncThunk<string, string>(
  "chat/sendMessage",
  async (message, thunkAPI) => {
    try {
      const response = await sendChatMessage(message);
      return response.reply;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Unable to get a reply from the chat server."),
      );
    }
  },
);
