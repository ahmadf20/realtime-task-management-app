"use client";

import { Task } from "@/types/task";
import TaskItem from "./TaskItem";
import TaskSkeleton from "./ui/TaskSkeleton";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  isAuthenticated: boolean;
  onUpdateStatus: (
    id: number,
    status: "pending" | "in_progress" | "done",
  ) => void;
  onDeleteTask: (id: number) => void;
}

export default function TaskList({
  tasks,
  isLoading,
  isAuthenticated,
  onUpdateStatus,
  onDeleteTask,
}: TaskListProps) {
  if (isLoading || !isAuthenticated) {
    return <TaskSkeleton count={3} />;
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tasks yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first task to get started with TaskFlow.
          </p>
          <div className="inline-flex items-center space-x-2 text-sm text-gray-400">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Tasks will appear here once created</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl">
      {/* Task List */}
      <div className="p-6">
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdateStatus={onUpdateStatus}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
