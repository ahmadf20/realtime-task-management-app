import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../api";
import {
  HttpResponse,
  HttpResponseError,
  HttpResponseWithPagination,
} from "@/types/http";

export type Task = {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "done";
  created_at: string;
  updated_at: string;
  _isOptimistic?: boolean; // Flag to identify optimistic updates
};

type TasksState = {
  tasks: Task[];
  currentTask?: Task | null;
  isLoading: boolean;
  isFetching: boolean;
  isSaving: boolean;
  error?: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

const initialState: TasksState = {
  tasks: [],
  currentTask: null,
  isLoading: false,
  isFetching: false,
  isSaving: false,
  error: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  },
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await api.get<HttpResponseWithPagination<Task[]>>(
        `/api/tasks?page=${page}`,
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: HttpResponseError } }).response
              ?.data?.message || "Failed to fetch tasks"
          : "Failed to fetch tasks";
      return rejectWithValue(errorMessage);
    }
  },
);

export const fetchTask = createAsyncThunk(
  "tasks/fetchTask",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get<HttpResponse<Task>>(`/api/tasks/${id}`);
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: HttpResponseError } }).response
              ?.data?.message || "Failed to fetch task"
          : "Failed to fetch task";
      return rejectWithValue(errorMessage);
    }
  },
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (
    taskData: { title: string; description: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post<HttpResponse<Task>>(
        "/api/tasks",
        taskData,
      );
      return { ...response.data, _isOptimistic: true };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: HttpResponseError } }).response
              ?.data?.message || "Failed to create task"
          : "Failed to create task";
      return rejectWithValue(errorMessage);
    }
  },
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async (
    { id, status }: { id: number; status: Task["status"] },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch<HttpResponse<Task>>(
        `/api/tasks/${id}/status`,
        {
          status,
        },
      );
      return { ...response.data, _isOptimistic: true };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: HttpResponseError } }).response
              ?.data?.message || "Failed to update task status"
          : "Failed to update task status";
      return rejectWithValue(errorMessage);
    }
  },
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      return id;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: HttpResponseError } }).response
              ?.data?.message || "Failed to delete task"
          : "Failed to delete task";
      return rejectWithValue(errorMessage);
    }
  },
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addTaskFromWebSocket: (state, action: PayloadAction<Task>) => {
      // Remove any optimistic task with the same ID to prevent duplicates
      const existingOptimisticIndex = state.tasks.findIndex(
        (task) => task.id === action.payload.id && task._isOptimistic,
      );

      if (existingOptimisticIndex !== -1) {
        // Replace optimistic task with real data
        state.tasks[existingOptimisticIndex] = action.payload;
      } else {
        // Add new task (not from optimistic update)
        state.tasks.unshift(action.payload);
      }
    },
    updateTaskFromWebSocket: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id,
      );
      if (index !== -1) {
        // Replace the task, removing optimistic flag if present
        state.tasks[index] = { ...action.payload, _isOptimistic: false };
      }
      if (state.currentTask?.id === action.payload.id) {
        state.currentTask = { ...action.payload, _isOptimistic: false };
      }
    },
    removeTaskFromWebSocket: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      if (state.currentTask?.id === action.payload) {
        state.currentTask = null;
      }
    },
    setCurrentTask: (state, action: PayloadAction<Task | null>) => {
      state.currentTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFetching = false;
        state.tasks = action.payload.data || [];
        state.pagination = {
          current_page: action.payload.meta?.current_page || 1,
          last_page: action.payload.meta?.last_page || 1,
          per_page: action.payload.meta?.per_page || 10,
          total: action.payload.meta?.total || 0,
        };
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isFetching = false;
        state.error = action.payload as string;
      })
      // Fetch single task
      .addCase(fetchTask.pending, (state) => {
        state.isLoading = true;
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFetching = false;
        state.currentTask = action.payload.data;
        state.error = null;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isFetching = false;
        state.error = action.payload as string;
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSaving = false;
        // Add optimistic task - will be replaced by websocket event
        if (action.payload.data) {
          state.tasks.unshift(action.payload.data);
        }
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isSaving = false;
        state.error = action.payload as string;
      })
      // Update task status
      .addCase(updateTaskStatus.pending, (state) => {
        state.isLoading = true;
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSaving = false;
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.data?.id,
        );
        if (index !== -1 && action.payload.data) {
          state.tasks[index] = action.payload.data;
        }
        if (state.currentTask?.id === action.payload.data?.id) {
          state.currentTask = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isSaving = false;
        state.error = action.payload as string;
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.isSaving = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSaving = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null;
        }
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isSaving = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  addTaskFromWebSocket,
  updateTaskFromWebSocket,
  removeTaskFromWebSocket,
  setCurrentTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;
