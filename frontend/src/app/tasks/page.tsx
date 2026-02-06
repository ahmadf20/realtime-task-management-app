"use client";

import { useTasks } from "../../hooks/useTasks";
import TaskForm from "../../components/TaskForm";
import TaskList from "../../components/TaskList";
import Header from "../../components/Header";
import Pagination from "../../components/ui/Pagination";

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
              currentPage={pagination.current_page ?? 1}
              lastPage={pagination.last_page ?? 1}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
