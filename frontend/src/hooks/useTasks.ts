import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  fetchTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} from "../store/slices/tasksSlice";
import { logout } from "../store/slices/authSlice";
import {
  initializeWebSocket,
  disconnectWebSocket,
} from "../services/websocket";
import { clearEcho } from "../store/slices/websocketSlice";

export const useTasks = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const { tasks, isLoading, isFetching, isSaving, error, pagination } =
    useSelector((state: RootState) => state.tasks);
  const { isConnected, echo } = useSelector(
    (state: RootState) => state.websocket,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const webSocketInitialized = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTasks(currentPage));
    }
  }, [isAuthenticated, currentPage, dispatch]);

  // Separate effect for handling authentication redirects
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user && !webSocketInitialized.current) {
      const token = localStorage.getItem("token");

      if (token) {
        initializeWebSocket(token, dispatch, user.id);
        webSocketInitialized.current = true;
      }
    }

    return () => {
      if (echo) {
        disconnectWebSocket(echo);
        dispatch(clearEcho());
        webSocketInitialized.current = false;
      }
    };
  }, [isAuthenticated, user?.id, dispatch]);

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
  }) => {
    dispatch(createTask(taskData));
  };

  const handleUpdateStatus = async (
    id: number,
    status: "pending" | "in_progress" | "done",
  ) => {
    dispatch(updateTaskStatus({ id, status }));
  };

  const handleDeleteTask = async (id: number) => {
    dispatch(deleteTask(id));
  };

  const handleLogout = async () => {
    if (echo) {
      disconnectWebSocket(echo);
      dispatch(clearEcho());
    }
    dispatch(logout());
    // Don't push to login here - let the home page handle the redirect
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    tasks,
    isLoading,
    isFetching,
    isSaving,
    error,
    pagination,
    user,
    isAuthenticated,
    isConnected,
    currentPage,
    handleCreateTask,
    handleUpdateStatus,
    handleDeleteTask,
    handleLogout,
    handlePageChange,
  };
};
