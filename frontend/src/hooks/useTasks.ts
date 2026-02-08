import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} from "../store/services/tasksApi";
import { useLogoutMutation } from "../store/services/authApi";
import { tokenUtils } from "../utils/tokenUtils";
import {
  initializeWebSocket,
  disconnectWebSocket,
} from "../services/websocket";
import { apiSlice } from "../store/apiSlice";
import { setDisconnected } from "../store/slices/websocketSlice";
import Echo from "laravel-echo";

export const useTasks = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const echoInstance = useRef<Echo<"reverb">>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const {
    data: tasksData,
    isLoading,
    isFetching,
    error: queryError,
  } = useGetTasksQuery(currentPage, {
    skip: !isAuthenticated,
  });

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [logoutMutation] = useLogoutMutation();

  const { state, error: wsError } = useSelector(
    (state: RootState) => state.websocket,
  );

  const tasks = tasksData?.data || [];
  const pagination = tasksData?.meta || {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  };

  const error = queryError ? "Failed to fetch tasks" : wsError ? wsError : null;

  useEffect(() => {
    if (user && !echoInstance.current) {
      const token = tokenUtils.getToken();

      if (token) {
        const echo = initializeWebSocket(token, dispatch, user.id);
        echoInstance.current = echo;
      }
    }

    return () => {
      if (echoInstance.current) {
        disconnectWebSocket(echoInstance.current);
        dispatch(setDisconnected());
        echoInstance.current = null;
      }
    };
  }, [isAuthenticated, user?.id, dispatch, wsError, user]);

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
  }) => {
    try {
      await createTask(taskData).unwrap();
    } catch (error) {
      console.error("Failed to create task", error);
      throw error;
    }
  };

  const handleUpdateStatus = async (
    id: number,
    status: "pending" | "in_progress" | "done",
  ) => {
    try {
      await updateTaskStatus({ id, status }).unwrap();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id).unwrap();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleLogout = async () => {
    await logoutMutation().unwrap();
    dispatch(apiSlice.util.resetApiState());
    router.replace("/login");
  };

  const handlePageChange = (page: number) => {
    router.replace(`/tasks?page=${page}`);
  };

  return {
    tasks,
    isLoading,
    isFetching,
    isSaving: isCreating,
    error,
    pagination,
    user,
    isAuthenticated,
    isConnected: state === "connected",
    currentPage,
    handleCreateTask,
    handleUpdateStatus,
    handleDeleteTask,
    handleLogout,
    handlePageChange,
  };
};
