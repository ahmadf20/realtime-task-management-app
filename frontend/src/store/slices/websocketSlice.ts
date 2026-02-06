import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WebSocketState {
  state: "disconnected" | "connecting" | "connected";
  error?: string;
}

const initialState: WebSocketState = {
  state: "disconnected",
};

const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    setConnecting: (state) => {
      state.state = "connecting";
      state.error = undefined;
    },
    setConnected: (state) => {
      state.state = "connected";
      state.error = undefined;
    },
    setDisconnected: (state) => {
      state.state = "disconnected";
      state.error = undefined;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.state = "disconnected";
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
});

export const {
  setConnecting,
  setConnected,
  setDisconnected,
  setError,
  clearError,
} = websocketSlice.actions;

export default websocketSlice.reducer;
