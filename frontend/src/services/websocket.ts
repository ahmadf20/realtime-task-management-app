import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { AppDispatch } from "../store";
import {
  setConnecting,
  setConnected,
  setDisconnected,
  setError,
} from "../store/slices/websocketSlice";
import { Task } from "@/types/task";
import { tasksApi } from "../store/services/tasksApi";

export const initializeWebSocket = (
  token: string,
  dispatch: AppDispatch,
  userId: number,
) => {
  dispatch(setConnecting());

  try {
    Pusher.logToConsole = process.env.NODE_ENV === "development";

    const echo = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
      wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT),
      wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT),
      forceTLS: false,
      enabledTransports: ["ws", "wss"],
      authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    });

    echo
      .private(`tasks.${userId}`)
      .listen(".task.created", () => {
        dispatch(tasksApi.util.invalidateTags([{ type: "Task", id: "LIST" }]));
      })
      .listen(".task.status.updated", (event: { task: Task }) => {
        dispatch(
          tasksApi.util.invalidateTags([
            { type: "Task", id: event.task.id },
            { type: "Task", id: "LIST" },
          ]),
        );
      })
      .listen(
        ".task.deleted",
        (event: { task_id: number; message: string }) => {
          dispatch(
            tasksApi.util.invalidateTags([
              { type: "Task", id: event.task_id },
              { type: "Task", id: "LIST" },
            ]),
          );
        },
      );

    echo.connector.pusher.connection.bind("connected", () => {
      dispatch(setConnected());
    });

    echo.connector.pusher.connection.bind("disconnected", () => {
      dispatch(setDisconnected());
    });

    echo.connector.pusher.connection.bind("error", (error: Error) => {
      dispatch(setError(error.message));
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
  echo?.disconnect();
};
