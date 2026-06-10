import { createSlice } from "@reduxjs/toolkit";
import { sendChatMessageThunk } from "./chatThunk";

interface ChatMessage {
  id: number;
  role: "user" | "bot";
  text: string;
}

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [
    {
      id: 1,
      role: "bot",
      text: "Hi there! I’m your assistant for reservations, menu help, and order questions.",
    },
  ],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        id: state.messages.length + 1,
        role: "user",
        text: action.payload,
      });
    },
    addBotMessage: (state, action) => {
      state.messages.push({
        id: state.messages.length + 1,
        role: "bot",
        text: action.payload,
      });
    },
    clearChatError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessageThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatMessageThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: state.messages.length + 1,
          role: "bot",
          text: action.payload,
        });
      })
      .addCase(sendChatMessageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addUserMessage, addBotMessage, clearChatError } =
  chatSlice.actions;

export default chatSlice.reducer;
