"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/tasks");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          {isLoading ? "Loading user data..." : "Redirecting..."}
        </p>
      </div>
    </div>
  );
}
