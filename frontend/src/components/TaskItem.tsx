import { useState } from "react";
import { Task } from "@/types/task";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongDescription = task.description.length > 150;
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          dot: "bg-amber-400",
        };
      case "in_progress":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          dot: "bg-blue-400",
        };
      case "done":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          dot: "bg-emerald-400",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          dot: "bg-gray-400",
        };
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusColors = getStatusColor(task.status);

  return (
    <div className="group bg-white border border-gray-200/50 rounded-xl p-4 sm:p-5 transition-all duration-200 hover:border-gray-300/70 hover:bg-gray-50/50">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-3 gap-2">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900">
              {task.title}
            </h4>
          </div>

          {/* Description */}
          <div className="relative">
            <p
              className={`text-sm text-gray-600 mb-4 ${isExpanded ? "" : "line-clamp-2"} leading-relaxed whitespace-pre-wrap`}
            >
              {task.description}
            </p>
            {isLongDescription && (
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1 transition-colors duration-150 mb-4 cursor-pointer"
              >
                <span>{isExpanded ? "Show less" : "Show more"}</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center space-x-4 text-xs text-gray-500 flex-wrap gap-1">
            <div className="flex items-center space-x-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{formatDate(task.created_at)}</span>
            </div>
            {task.updated_at !== task.created_at && (
              <div className="flex items-center space-x-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>{formatDate(task.updated_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Status Selector */}
          <div className="relative w-full">
            <select
              title="Change status"
              value={task.status}
              onChange={(e) =>
                onUpdateStatus(task.id, e.target.value as Task["status"])
              }
              className={`text-sm border rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer hover:bg-gray-100 transition-colors duration-150 min-w-[140px] font-medium appearance-none ${statusColors.bg} ${statusColors.text} ${statusColors.border} border w-full`}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Completed</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onDeleteTask(task.id)}
            className="group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 sm:p-2.5 rounded-lg cursor-pointer transition-all duration-150 border border-red-200  min-w-[38px] flex items-center justify-center"
            title="Delete task"
            type="button"
            aria-label="Delete task"
          >
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
