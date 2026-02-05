import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../api";
import { AxiosError } from "axios";
import { HttpResponseError } from "@/types/http";

export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

type LoginResponse = {
  access_token: string;
  user: User;
};

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Load token from localStorage on initialization
const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post<LoginResponse>("/api/login", credentials);
      const { access_token, user } = response.data;

      // Store token in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", access_token);
      }

      return { token, user };
    } catch (e) {
      const error = e as AxiosError<HttpResponseError>;
      return rejectWithValue(error?.response?.data?.message || "Login failed");
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/api/logout");
      // Remove token from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    } catch (e) {
      const error = e as AxiosError<HttpResponseError>;
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  },
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<User>("/api/user");
      return response.data;
    } catch (e) {
      const error = e as AxiosError<HttpResponseError>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to get user",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...initialState,
    token,
    isAuthenticated: !!token,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload);
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Even if logout fails on server, clear local auth
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      });
  },
});

export const { clearError, setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
