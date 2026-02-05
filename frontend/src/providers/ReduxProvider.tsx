"use client";

import { Provider } from "react-redux";
import { store } from "../store";
import { useEffect } from "react";
import { getCurrentUser } from "../store/slices/authSlice";

interface ReduxProviderProps {
  children: React.ReactNode;
}

function AuthInitializer() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      store.dispatch(getCurrentUser());
    }
  }, [token]);

  return null;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
}
