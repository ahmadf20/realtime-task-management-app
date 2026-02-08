"use client";

import { useTasks } from "../../hooks/useTasks";
import TaskForm from "../../components/TaskForm";
import TaskList from "../../components/TaskList";
import Header from "../../components/Header";
import Pagination from "../../components/ui/Pagination";

export default function TasksPage() {
  const {
    tasks,
    isLoading,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} isConnected={isConnected} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Form Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-[102px]">
              <TaskForm onSubmit={handleCreateTask} isLoading={isSaving} />
            </div>
          </div>

          {/* Task List Column */}
          <div className="lg:col-span-2">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <TaskList
              tasks={tasks}
              isLoading={isLoading}
              isAuthenticated={isConnected}
              onUpdateStatus={handleUpdateStatus}
              onDeleteTask={handleDeleteTask}
            />

            {/* Pagination */}
            <div className="mt-6">
              <Pagination
                currentPage={pagination.current_page ?? 1}
                lastPage={pagination.last_page ?? 1}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
