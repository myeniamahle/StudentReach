// App.tsx — routing setup

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { FlagDetail } from './pages/FlagDetail';
import { MessagePreview } from './pages/MessagePreview';
import { FollowUp } from './pages/FollowUp';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { Resource } from './pages/Resource';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected advisor routes */}
        <Route
          path="/advisor/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advisor/flag/:id"
          element={
            <ProtectedRoute>
              <FlagDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advisor/message-preview/:id"
          element={
            <ProtectedRoute>
              <MessagePreview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advisor/follow-up/:id"
          element={
            <ProtectedRoute>
              <FollowUp />
            </ProtectedRoute>
          }
        />
        <Route
  path="/advisor/resource/:id/:option"
  element={
    <ProtectedRoute>
      <Resource />
    </ProtectedRoute>
  }
/>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;