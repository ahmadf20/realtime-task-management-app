import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Echo from "laravel-echo";

interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  echo: Echo<"reverb"> | null;
}

const initialState: WebSocketState = {
  isConnected: false,
  isConnecting: false,
  error: null,
  echo: null,
};

const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    setConnecting: (state) => {
      state.isConnecting = true;
      state.error = null;
    },
    setConnected: (state) => {
      state.isConnected = true;
      state.isConnecting = false;
      state.error = null;
    },
    setDisconnected: (state) => {
      state.isConnected = false;
      state.isConnecting = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.isConnecting = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setEcho: (state, action: PayloadAction<Echo<"reverb">>) => {
      state.echo = action.payload;
    },
    clearEcho: (state) => {
      state.echo = null;
    },
  },
});

export const {
  setConnecting,
  setConnected,
  setDisconnected,
  setError,
  clearError,
  setEcho,
  clearEcho,
} = websocketSlice.actions;

export default websocketSlice.reducer;
