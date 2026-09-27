// ProtectedRoute.tsx — redirects to login if no token

import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

function isAuthenticated(): boolean {
  return localStorage.getItem('token') !== null;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}