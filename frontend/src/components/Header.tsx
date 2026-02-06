import { User } from "../store/slices/authSlice";
import WebSocketStatus from "./WebSocketStatus";

interface HeaderProps {
  user: User | null;
  isConnected: boolean;
  onLogout: () => void;
}

export default function Header({ user, isConnected, onLogout }: HeaderProps) {
  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Task Management
            </h1>
            <WebSocketStatus isConnected={isConnected} />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
