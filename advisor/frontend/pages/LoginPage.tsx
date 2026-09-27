import "./LoginPage.css";
import logo from "../components/logo.svg";
import p_icon from "../components/profile icon.svg";
import l_icon from "../components/lock-icon.svg";
import google from "../components/google icon.svg";
import apple from "../components/apple icon.svg";
import w_logo from "../components/wordlogo.svg";
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

type Tab = "student" | "lecturer" | "admin";

function LoginPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const data = await login(email, password);

      // Validate that the user picked the right tab
      const roleMatchesTab =
        (activeTab === "student" && data.role === "student") ||
        (activeTab === "lecturer" && data.role === "lecturer") ||
        (activeTab === "admin" && data.role === "admin") ||
        // Demo tolerances: advisors are allowed via any tab
        data.role === "advisor";

      if (!roleMatchesTab && data.role !== "advisor") {
        setError(
          `This account is not a ${activeTab}. Try the ${
            data.role === "lecturer" ? "Lecturer" : data.role === "student" ? "Student" : "Admin"
          } tab.`
        );
        setBusy(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      if (data.programme) {
        localStorage.setItem("programme", data.programme);
      }

      if (data.role === "advisor") {
        navigate("/advisor/dashboard");
      } else if (data.role === "lecturer") {
        navigate("/lecturer/dashboard");
      } else if (data.role === "student") {
        // Student dashboard not built yet — fall back to advisor for demo
        navigate("/advisor/dashboard");
      } else {
        navigate("/advisor/dashboard");
      }
    } catch (err: unknown) {
      const response = (err as {
        response?: { data?: { detail?: string } };
      }).response;
      setError(response?.data?.detail || "Login failed");
      setBusy(false);
    }
  };

  return (
    <div className="Login-page">
      <img src="/full_logo.svg" alt="sr logo" className="Login-top-logo" />

      <div className="Login-card-container">
        <img src={logo} alt="StudentReach" className="Login-card-logo" />
        <img src={w_logo} alt="" className="Login-card-title" />

        <p className="Login-card-subtitle">
          Institutional Student Wellness &amp; Academic Support Portal
        </p>

        <h2 className="Login-sign-in-heading">SIGN INTO YOUR ACCOUNT</h2>

        <div className="Login-tab-group">
          <button
            type="button"
            className={
              activeTab === "student"
                ? "Login-tab-button Login-tab-button--active"
                : "Login-tab-button"
            }
            onClick={() => setActiveTab("student")}
          >
            Student
          </button>
          <button
            type="button"
            className={
              activeTab === "lecturer"
                ? "Login-tab-button Login-tab-button--active"
                : "Login-tab-button"
            }
            onClick={() => setActiveTab("lecturer")}
          >
            Lecturer
          </button>
          <button
            type="button"
            className={
              activeTab === "admin"
                ? "Login-tab-button Login-tab-button--active"
                : "Login-tab-button"
            }
            onClick={() => setActiveTab("admin")}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="Login-input-wrapper">
            <img src={p_icon} alt="" className="Login-input-icon" />
            <input
              type="text"
              placeholder="Enter Username or Email"
              className="Login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="Login-input-wrapper">
            <img src={l_icon} alt="" className="Login-input-icon" />
            <input
              type="password"
              placeholder="Enter Your Password"
              className="Login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="Login-error">{error}</p>}

          <button type="submit" className="Login-button" disabled={busy}>
            {busy ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        <div className="Login-divider-row">
          <span className="Login-divider-line" />
          <span className="Login-divider-text">Or continue with</span>
          <span className="Login-divider-line" />
        </div>

        <div className="Login-social-row">
          <button
            type="button"
            className="Login-social-button"
            aria-label="Continue with Google"
          >
            <img src={google} alt="" />
          </button>
          <button
            type="button"
            className="Login-social-button"
            aria-label="Continue with Apple"
          >
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