import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clearDemoSession, getDemoSession } from "../auth/demoSession";
import logo from "../components/logo.svg";
import wordmark from "../components/wordlogo.svg";
import "./MessagesPage.css";

const API_URL = "http://localhost:4000";

type Student = {
  id: string;
  student_number: string;
  first_name: string;
  last_name: string;
  programme: string;
};

function MessagesPage() {
  const session = getDemoSession();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const studentId = session?.studentId;

  useEffect(() => {
    if (!studentId) return;

    let active = true;
    fetch(`${API_URL}/api/students/${studentId}`)
      .then(async response => {
        if (!response.ok) throw new Error("Could not load your student profile.");
        return response.json();
      })
      .then(profile => { if (active) setStudent(profile); })
      .catch(requestError => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [studentId]);

  return (
    <main className="messages-page">
      <section className="messages-card">
        <div className="messages-brand">
          <img src={logo} alt="" className="messages-logo" />
          <img src={wordmark} alt="StudentReach" className="messages-wordmark" />
        </div>
        <header className="messages-header">
          <p className="messages-eyebrow">STUDENT MESSAGES</p>
          <h1>Your inbox</h1>
          <span>Messages from your student support team.</span>
        </header>

        {loading && <p className="messages-state">Loading your inbox…</p>}
        {error && <p className="messages-error" role="alert">{error}</p>}
        {!loading && !error && (
          <section className="messages-list" aria-label="Your student profile">
            {student && (
              <Link className="messages-student" to={`/chat/${student.id}`}>
                <span className="messages-student-name">{student.first_name} {student.last_name}</span>
                <span>{student.student_number} · {student.programme}</span>
                <span className="messages-open">Open inbox</span>
              </Link>
            )}
          </section>
        )}

        <nav className="messages-nav" aria-label="Main navigation">
          <Link to="/dashboard">Dashboard</Link>
          <button type="button" onClick={() => { clearDemoSession(); window.location.assign("/login"); }}>Sign out</button>
        </nav>
      </section>
    </main>
  );
}

export default MessagesPage;
