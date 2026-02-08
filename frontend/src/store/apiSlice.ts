import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenUtils } from "@/utils/tokenUtils";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    prepareHeaders: (headers) => {
      const token = tokenUtils.getToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);

      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Task", "User"],
  keepUnusedDataFor: 10,
  endpoints: () => ({}),
});
