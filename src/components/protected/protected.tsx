import { useAuth } from "@/store/auth-store";
import React from "react";
import { Navigate } from "react-router-dom";

export default function Protected({ children }: { children: React.ReactNode }) {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Navigate to={"/login"} replace />;
  }

  return children;
}
