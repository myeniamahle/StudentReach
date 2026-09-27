import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import { getDemoSession } from "./auth/demoSession";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import AdvisorPage from "./pages/AdvisorPage";
import MessagesPage from "./pages/MessagesPage";
import StudentChatPage from "./pages/StudentChatPage";

function StudentOnly({ children }: { children: ReactNode }) {
    const session = getDemoSession();
    return session?.role === "student" ? children : <Navigate to="/login" replace />;
}

function StaffOnly({ children }: { children: ReactNode }) {
    const session = getDemoSession();
    return session?.role === "lecturer" || session?.role === "admin"
        ? children
        : <Navigate to="/login" replace />;
}

function ChatAccess({ children }: { children: ReactNode }) {
    const session = getDemoSession();
    const { studentId } = useParams();
    if (!session) return <Navigate to="/login" replace />;
    if (session.role === "student" && session.studentId !== studentId) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<StudentOnly><Dashboard /></StudentOnly>} />
                <Route path="/advisor" element={<StaffOnly><AdvisorPage /></StaffOnly>} />
                <Route path="/messages" element={<StudentOnly><MessagesPage /></StudentOnly>} />
                <Route path="/chat/:studentId" element={<ChatAccess><StudentChatPage /></ChatAccess>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;