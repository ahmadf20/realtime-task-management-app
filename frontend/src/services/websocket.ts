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
import { getCurrentPageFromUrl } from "@/utils/url";

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
      .listen(".task.created", (event: { task: Task }) => {
        dispatch(
          tasksApi.util.updateQueryData("getTasks", 1, (draft) => {
            if (draft.data && draft.meta) {
              // Avoid duplicates by checking if task already exists
              const exists = draft.data.some(
                (task) => task.id === event.task.id,
              );

              if (!exists) {
                draft.data.unshift(event.task);
                draft.meta.total = (draft.meta.total || 0) + 1;
              }
            }
          }),
        );
      })
      .listen(".task.status.updated", (event: { task: Task }) => {
        const currentPage = getCurrentPageFromUrl();

        dispatch(
          tasksApi.util.updateQueryData("getTasks", currentPage, (draft) => {
            if (draft.data) {
              const taskIndex = draft.data.findIndex(
                (task) => task.id === event.task.id,
              );

              if (taskIndex !== -1) {
                draft.data[taskIndex] = event.task;
              }
            }
          }),
        );
      })
      .listen(
        ".task.deleted",
        (event: { task_id: number; message: string }) => {
          const currentPage = getCurrentPageFromUrl();

          dispatch(
            tasksApi.util.updateQueryData("getTasks", currentPage, (draft) => {
              if (draft.data && draft.meta) {
                const taskIndex = draft.data.findIndex(
                  (task) => task.id === event.task_id,
                );
                if (taskIndex !== -1) {
                  draft.data.splice(taskIndex, 1);
                  draft.meta.total = Math.max(0, (draft.meta.total || 0) - 1);
                }
              }
            }),
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
