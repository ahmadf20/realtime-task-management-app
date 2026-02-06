import { apiSlice } from "../apiSlice";
import { User } from "../slices/authSlice";
import { tokenUtils } from "@/utils/tokenUtils";

type LoginResponse = {
  access_token: string;
  user: User;
};

type LoginRequest = {
  email: string;
  password: string;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/api/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          tokenUtils.setToken(data.access_token);
        } catch {
          // Handle error if needed
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          tokenUtils.removeToken();
        }
      },
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => "/api/user",
      providesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetCurrentUserQuery } =
  authApi;
