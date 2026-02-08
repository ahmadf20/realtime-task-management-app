import { apiSlice } from "../apiSlice";
import { Task } from "@/types/task";
import { HttpResponse, HttpResponseWithPagination } from "@/types/http";
import { getCurrentPageFromUrl } from "@/utils/url";

export const tasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<HttpResponseWithPagination<Task[]>, number>({
      query: (page = 1) => `/api/tasks?page=${page}&limit=20`,
      providesTags: () => [{ type: "Task", id: "LIST" }],
      keepUnusedDataFor: 10,
    }),
    createTask: builder.mutation<HttpResponse<Task>, Partial<Task>>({
      query: (body) => ({
        url: "/api/tasks",
        method: "POST",
        body,
      }),
      onQueryStarted: async (_newTask, { dispatch, queryFulfilled }) => {
        try {
          const { data: createdTask } = await queryFulfilled;

          // Optimistically add to cache
          dispatch(
            tasksApi.util.updateQueryData("getTasks", 1, (draft) => {
              const currentData = draft.data || [];
              const updatedData = Array.isArray(currentData) ? currentData : [];

              if (createdTask.data) {
                updatedData.unshift(createdTask.data);
              }

              draft.data = updatedData;
            }),
          );
        } catch {
          // Let the error propagate - no optimistic update to revert
        }
      },
    }),
    updateTaskStatus: builder.mutation<
      HttpResponse<Task>,
      { id: number; status: Task["status"] }
    >({
      query: ({ id, status }) => ({
        url: `/api/tasks/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      onQueryStarted: async ({ id, status }, { dispatch, queryFulfilled }) => {
        // Optimistically update the cache
        const currentPage = getCurrentPageFromUrl();
        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getTasks", currentPage, (draft) => {
            const currentData = draft.data || [];
            const updatedData = Array.isArray(currentData) ? currentData : [];

            const taskIndex = updatedData.findIndex((task) => task.id === id);

            if (taskIndex !== -1) {
              updatedData[taskIndex] = {
                ...updatedData[taskIndex],
                status,
                updated_at: new Date().toISOString(),
              };
            }

            draft.data = updatedData;
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert on error
          patchResult.undo();
        }
      },
    }),
    deleteTask: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/tasks/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        // Optimistically remove from cache
        const currentPage = getCurrentPageFromUrl();
        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getTasks", currentPage, (draft) => {
            const currentData = draft.data || [];
            const updatedData = Array.isArray(currentData) ? currentData : [];

            const filteredData = updatedData.filter((task) => task.id !== id);
            draft.data = filteredData;
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert on error
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} = tasksApi;
