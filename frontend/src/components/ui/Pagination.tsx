import React from "react";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  lastPage,
  onPageChange,
}: PaginationProps) {
  if (lastPage <= 1) return null;

  return (
    <div className="mt-6 flex justify-center">
      <nav className="flex items-center space-x-2">
        {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              page === currentPage
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
      </nav>
    </div>
  );
}
