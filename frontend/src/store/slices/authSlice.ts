import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tokenUtils } from "@/utils/tokenUtils";
import { authApi } from "../services/authApi";

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
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  token: tokenUtils.getToken(),
  isAuthenticated: !!tokenUtils.getToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      tokenUtils.setToken(action.payload);
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      tokenUtils.removeToken();
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.token = payload.access_token;
          state.user = payload.user;
          state.isAuthenticated = true;
        },
      )
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addMatcher(
        authApi.endpoints.getCurrentUser.matchFulfilled,
        (state, { payload }) => {
          state.user = payload;
          state.isAuthenticated = true;
        },
      );
  },
});

export const { setToken, clearAuth, setUser } = authSlice.actions;
export default authSlice.reducer;
