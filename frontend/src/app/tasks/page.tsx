"use client";

import { useTasks } from "../../hooks/useTasks";
import TaskForm from "../../components/TaskForm";
import TaskList from "../../components/TaskList";
import Header from "../../components/Header";
import Pagination from "../../components/ui/Pagination";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function TasksPage() {
  const {
    tasks,
    isFetching,
    isSaving,
    error,
    pagination,
    user,
    isConnected,
    handleCreateTask,
    handleUpdateStatus,
    handleDeleteTask,
    handleLogout,
    handlePageChange,
  } = useTasks();

  // Show loading spinner during auth state transitions or initial task fetch
  // Show loading spinner during auth logic, but not for subsequent task fetches
  // We check tasks.length to allow initial load spinner, but avoid it if we have potential stale data to show
  // However, simpler for now: Only blocking load if we're technically "loading" (auth check)
  // OR if we are fetching tasks and have NO tasks to show yet.
  if (!user) {
    // Auth loading or initial user load
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner
            className="h-12 w-12 text-indigo-600"
            text="Loading..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} isConnected={isConnected} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TaskForm onSubmit={handleCreateTask} isLoading={isSaving} />
          </div>

          <div className="lg:col-span-2">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <TaskList
              tasks={tasks}
              isLoading={isFetching}
              onUpdateStatus={handleUpdateStatus}
              onDeleteTask={handleDeleteTask}
            />

            <Pagination
              currentPage={pagination.current_page}
              lastPage={pagination.last_page}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
