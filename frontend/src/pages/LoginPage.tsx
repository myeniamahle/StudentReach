import "./LoginPage.css";
import logo from "../components/logo.svg";
import p_icon from "../components/profile icon.svg";
import google from "../components/google icon.svg";
import apple from "../components/apple icon.svg";
import w_logo from "../components/wordlogo.svg";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { setDemoSession, type DemoRole } from "../auth/demoSession";

const API_URL = "http://localhost:4000";

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<DemoRole>("student");
  const [identity, setIdentity] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (role !== "student") {
      setDemoSession({ role });
      navigate("/advisor");
      return;
    }

    if (!identity.trim()) {
      setError("Enter the student number or email from a demo profile.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch(`${API_URL}/api/students`);
      if (!response.ok) throw new Error("Could not connect to the student directory.");
      const students: Array<{ id: string; student_number: string; email: string; first_name: string; last_name: string }> = await response.json();
      const normalizedIdentity = identity.trim().toLowerCase();
      const student = students.find(candidate =>
        candidate.student_number.toLowerCase() === normalizedIdentity || candidate.email.toLowerCase() === normalizedIdentity
      );

      if (!student) {
        setError("No demo student matches that student number or email.");
        return;
      }

      setDemoSession({
        role: "student",
        studentId: student.id,
        studentNumber: student.student_number,
        firstName: student.first_name,
        lastName: student.last_name
      });
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="Login-page">
      <img src="/full_logo.svg" alt="sr logo" className="Login-top-logo" />

      <div className="Login-card-container">
        <img src={logo} alt="StudentReach" className="Login-card-logo" />

       
          <img src={w_logo} alt="" className="Login-card-title"/>
        
        <p className="Login-card-subtitle">
          Institutional Student Wellness &amp; Academic Support Portal
        </p>

        <h2 className="Login-sign-in-heading">SIGN INTO YOUR ACCOUNT</h2>

        <div className="Login-tab-group" role="group" aria-label="Account type">
          {(["student", "lecturer", "admin"] as const).map(option => (
            <button
              key={option}
              type="button"
              className={`Login-tab-button${role === option ? " Login-tab-button--active" : ""}`}
              aria-pressed={role === option}
              onClick={() => { setRole(option); setError(""); }}
            >
              {option[0].toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin}>
          <div className="Login-input-wrapper">
            <img src={p_icon} alt="" className="Login-input-icon" />
            <input
              type="text"
              placeholder={role === "student" ? "Student number or email" : `${role[0].toUpperCase()}${role.slice(1)} demo access`}
              className="Login-input"
              value={identity}
              onChange={event => setIdentity(event.target.value)}
              disabled={role !== "student"}
              autoComplete="username"
            />
          </div>

          <button type="submit" className="Login-button" disabled={busy}>
            {busy ? "CONNECTING…" : role === "student" ? "SIGN IN" : `CONTINUE AS ${role.toUpperCase()}`}
          </button>
          {error && <p className="Login-error" role="alert">{error}</p>}
        </form>

        <div className="Login-divider-row">
          <span className="Login-divider-line" />
          <span className="Login-divider-text">Or continue with</span>
          <span className="Login-divider-line" />
        </div>

        <div className="Login-social-row">
          <button type="button" className="Login-social-button" aria-label="Continue with Google">
            <img src={google} alt="" />
          </button>
          <button type="button" className="Login-social-button" aria-label="Continue with Apple">
            <img src={apple} alt="" />
          </button>
        </div>
      </div>

      <div className="Login-crisis-footer">
        <p className="Login-crisis-title">Immediate Psychological Support</p>
        <p className="Login-crisis-text">
          If you or someone you know is in crisis, call the toll-free 24/7
          <br />
          Campus Crisis Line: <strong>080 012 3222</strong>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;