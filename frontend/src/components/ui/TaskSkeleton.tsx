interface TaskSkeletonProps {
  count?: number;
}

export default function TaskSkeleton({ count = 3 }: TaskSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200/50 rounded-xl p-5 animate-pulse"
        >
          <div className="flex items-start justify-between">
            {/* Task Content Skeleton */}
            <div className="flex-1 min-w-0">
              {/* Title Row */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>

              {/* Description Skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>

              {/* Metadata Skeleton */}
              <div className="flex items-center space-x-4">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-col items-end space-y-2 ml-6">
              <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
