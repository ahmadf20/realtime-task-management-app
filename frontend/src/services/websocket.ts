import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { AppDispatch } from "../store";
import {
  setConnecting,
  setConnected,
  setDisconnected,
  setError,
  setEcho,
} from "../store/slices/websocketSlice";
import {
  addTaskFromWebSocket,
  updateTaskFromWebSocket,
  removeTaskFromWebSocket,
  Task,
} from "../store/slices/tasksSlice";

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: typeof Echo;
  }
}

export const initializeWebSocket = (
  token: string,
  dispatch: AppDispatch,
  userId: number,
) => {
  dispatch(setConnecting());

  try {
    window.Pusher = Pusher;

    Pusher.logToConsole = process.env.NODE_ENV === "development";

    const echo = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || "laravel-key",
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || "localhost",
      wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || "8080"),
      wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || "8080"),
      forceTLS: false,
      enabledTransports: ["ws", "wss"],
      authEndpoint: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    });

    // Listen for task events on private channel
    echo
      .private(`tasks.${userId}`)
      .listen(".task.created", (event: { task: Task }) => {
        dispatch(addTaskFromWebSocket(event.task));
      })
      .listen(".task.status.updated", (event: { task: Task }) => {
        dispatch(updateTaskFromWebSocket(event.task));
      })
      .listen(
        ".task.deleted",
        (event: { task_id: number; message: string }) => {
          dispatch(removeTaskFromWebSocket(event.task_id));
        },
      );

    // Listen for connection events
    echo.connector.pusher.connection.bind("connected", () => {
      dispatch(setConnected());
      dispatch(setEcho(echo));
      console.log("Connected to WebSocket!");
    });

    echo.connector.pusher.connection.bind("disconnected", () => {
      dispatch(setDisconnected());
      console.log("Disconnected from WebSocket");
    });

    echo.connector.pusher.connection.bind("error", (error: Error) => {
      dispatch(setError(error.message));
      console.log(`WebSocket error: ${error.message}`);
    });

    return echo;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to initialize WebSocket";
    dispatch(setError(errorMessage));
    return null;
  }
};

export const disconnectWebSocket = (echo: Echo<"reverb"> | null) => {
  if (echo) {
    echo.disconnect();
  }
};
