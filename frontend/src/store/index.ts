import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import tasksSlice from "./slices/tasksSlice";
import websocketSlice from "./slices/websocketSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tasks: tasksSlice,
    websocket: websocketSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
