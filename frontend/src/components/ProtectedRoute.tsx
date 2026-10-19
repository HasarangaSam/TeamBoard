import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <p className="p-8 text-slate-600">Checking your session...</p>;
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}
