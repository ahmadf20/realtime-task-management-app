'use client';

interface WebSocketStatusProps {
  isConnected: boolean;
}

export default function WebSocketStatus({ isConnected }: WebSocketStatusProps) {
  return (
    <div className="flex items-center ml-4">
      <div className="flex items-center">
        <div
          className={`w-2 h-2 rounded-full mr-2 ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="text-xs text-gray-600">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </div>
  );
}
