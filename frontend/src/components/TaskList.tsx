"use client";

import { Task } from "../store/slices/tasksSlice";
import TaskItem from "./TaskItem";
import LoadingSpinner from "./ui/LoadingSpinner";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onUpdateStatus: (
    id: number,
    status: "pending" | "in_progress" | "done",
  ) => void;
  onDeleteTask: (id: number) => void;
}

export default function TaskList({
  tasks,
  isLoading,
  onUpdateStatus,
  onDeleteTask,
}: TaskListProps) {
  if (isLoading && tasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <LoadingSpinner
          text="Loading tasks..."
          className="h-8 w-8 text-indigo-600"
        />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new task.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Tasks
        </h3>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdateStatus={onUpdateStatus}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
