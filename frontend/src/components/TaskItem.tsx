import React from "react";
import { Task } from "../store/slices/tasksSlice";

interface TaskItemProps {
  task: Task;
  onUpdateStatus: (
    id: number,
    status: "pending" | "in_progress" | "done",
  ) => void;
  onDeleteTask: (id: number) => void;
}

export default function TaskItem({
  task,
  onUpdateStatus,
  onDeleteTask,
}: TaskItemProps) {
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "in_progress":
        return "In Progress";
      case "done":
        return "Done";
      default:
        return status;
    }
  };

  return (
    <li className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-medium text-gray-900">{task.title}</h4>
          <p className="mt-1 text-sm text-gray-600">{task.description}</p>
          <div className="mt-2 flex items-center space-x-4">
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                task.status,
              )}`}
            >
              {getStatusLabel(task.status)}
            </span>
            <span className="text-xs text-gray-500">
              Created: {new Date(task.created_at).toLocaleDateString()}
            </span>
            {task.updated_at !== task.created_at && (
              <span className="text-xs text-gray-500">
                Updated: {new Date(task.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <select
            title="status"
            value={task.status}
            onChange={(e) =>
              onUpdateStatus(task.id, e.target.value as Task["status"])
            }
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button
            onClick={() => onDeleteTask(task.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
