// App.tsx — routing setup

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { FlagDetail } from './pages/FlagDetail';
import { MessagePreview } from './pages/MessagePreview';
import { FollowUp } from './pages/FollowUp';
import { LecturerDashboard } from './pages/LecturerDashboard';
import { StudentDetail } from './pages/StudentDetail';
import { ReportConcern } from './pages/ReportConcern';
import { ProtectedRoute } from './auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Advisor routes */}
        <Route path="/advisor/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/advisor/flag/:id" element={<ProtectedRoute><FlagDetail /></ProtectedRoute>} />
        <Route path="/advisor/message-preview/:id" element={<ProtectedRoute><MessagePreview /></ProtectedRoute>} />
        <Route path="/advisor/follow-up/:id" element={<ProtectedRoute><FollowUp /></ProtectedRoute>} />

        {/* Lecturer routes */}
        <Route path="/lecturer/dashboard" element={<ProtectedRoute><LecturerDashboard /></ProtectedRoute>} />
        <Route path="/lecturer/student/:id" element={<ProtectedRoute><StudentDetail /></ProtectedRoute>} />
        <Route path="/lecturer/report-concern/:id" element={<ProtectedRoute><ReportConcern /></ProtectedRoute>} />

        {/* Default */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;