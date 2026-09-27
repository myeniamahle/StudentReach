import "./RegisterPage.css";
import logo from "../components/logo.svg";
import p_icon from "../components/profile icon.svg";
import l_icon from "../components/lock-icon.svg";
import i_ed from "../components/i_email_address icon.svg"
import b_icon from "../components/campus icon.svg"
import google from "../components/google icon.svg";
import apple from "../components/apple icon.svg";
import w_logo from "../components/wordlogo.svg";
import g_hat_icon from "../components/grad-hat icon.svg"
import { useNavigate } from "react-router-dom";


function RegisterPage() {
const navigate = useNavigate();
  return (
    <div className="register-card-container">
    <div className="Register-page">
        <img src={logo} alt="StudentReach" className="Login-card-logo" />

       
          <img src={w_logo} alt="" className="Login-card-title"/>
        
        <p className="Login-card-subtitle">
          Institutional Student Wellness &amp; Academic Support Portal
        </p>
      <h1 className="Register-title">REGISTER YOUR PROFILE</h1>
      <p className="Register-subtitle">Join your campus wellness &amp; academic ecosystem</p>

      <div className="Register-tab-group">
        <button type="button" className="Register-tab-button Register-tab-button--active">
          Student
        </button>
        <button type="button" className="Register-tab-button">
          Lecturer
        </button>
        <button type="button" className="Register-tab-button">
          Admin
        </button>
      </div>

      <form className="Register-form">
        <label className="Register-label">Full Legal Name</label>
        <div className="Register-input-wrapper">
          <img src={p_icon} alt="" className="Register-input-icon" />
          <input type="text" placeholder="e.g. Kim Ndlovu" className="Register-input" />
        </div>

        <label className="Register-label">Student ID / Student Number</label>
        <div className="Register-input-wrapper">
          <img src={p_icon} alt="" className="Register-input-icon" />
          <input type="text" placeholder="E.G. KIMNDL001 / ST2024-9104" className="Register-input" />
        </div>

        <label className="Register-label">Campus Location</label>
        <div className="Register-select-wrapper">
          <img src={b_icon} alt="" className="Register-input-icon" />
          <select className="Register-select">
            <option>Rosebank International Durban Campus</option>
          </select>
          <img src="/icons/chevron-down.svg" alt="" className="Register-chevron-icon" />
        </div>

        <label className="Register-label">Faculty / Academic Department</label>
        <div className="Register-select-wrapper">
          <img src={g_hat_icon} alt="" className="Register-input-icon" />
          <select className="Register-select">
            <option>Faculty of Information Technology</option>
          </select>
          <img src="/icons/chevron-down.svg" alt="" className="Register-chevron-icon" />
        </div>

        <label className="Register-label">Institutional Email Address</label>
        <div className="Register-input-wrapper">
          <img src={i_ed} alt="" className="Register-input-icon" />
          <input
            type="email"
            placeholder="kim.ndlovu@student.rosebank.ac.za"
            className="Register-input"
          />
        </div>

        <label className="Register-label">Create Access Password</label>
        <div className="Register-input-wrapper">
          <img src={l_icon} alt="" className="Register-input-icon" />
          <input type="password" placeholder="••••••••••" className="Register-input" />
          <img src={l_icon} alt="Show password" className="Register-eye-icon" />
        </div>
        <div className="Register-strength-row">
          <div className="Register-strength-bars">
            <span className="Register-strength-bar Register-strength-bar--filled" />
            <span className="Register-strength-bar Register-strength-bar--filled" />
            <span className="Register-strength-bar Register-strength-bar--filled" />
            <span className="Register-strength-bar" />
          </div>
          <span className="Register-strength-label">
            <img src={l_icon} alt="" className="Register-strength-icon" />
            Strong Password
          </span>
        </div>

        <label className="Register-label">Confirm Password</label>
        <div className="Register-input-wrapper">
          <img src={l_icon} alt="" className="Register-input-icon" />
          <input type="password" placeholder="••••••••••" className="Register-input" />
          <img src="/icons/eye.svg" alt="Show password" className="Register-eye-icon" />
        </div>

        <label className="Register-consent-row">
          <input type="checkbox" className="Register-checkbox" />
          <span className="Register-consent-text">
            I consent to the collection of academic progress and wellness check-in signals in
            compliance with the <strong>South African POPIA Act (Act 4 of 2013)</strong>. Data is
            purpose-bound, confidential, and cryptographically secured.
            <br />
            <a href="/popia-privacy-terms" className="Register-consent-link">
              Read POPIA Privacy Terms
            </a>
          </span>
        </label>

        <button type="submit" className="Register-submit-button" onClick={() => navigate("/dashboard")}>
          CREATE ACCOUNT
          <img src="/icons/arrow-right.svg" alt="" className="Register-submit-icon" />
        </button>
      </form>

      <div className="Register-divider-row">
        <span className="Register-divider-line" />
        <span className="Register-divider-text">OR CONTINUE WITH</span>
        <span className="Register-divider-line" />
      </div>

      <div className="Register-social-row">
        <button type="button" className="Register-social-button">
          <img src={google} alt="" />
          Google
        </button>
        <button type="button" className="Register-social-button">
          <img src={apple} alt="" />
          Apple
        </button>
        <button type="button" className="Register-social-button">
          <img src={b_icon} alt="" />
          Campus SSO
        </button>
      </div>

      <p className="Register-signin-row">
        Already registered? <a href="/login">Sign In</a>
      </p>

      <p className="Register-security-note">
        <img src="/icons/shield-check.svg" alt="" className="Register-security-icon" />
        POPIA Compliant Secure Institutional Portal • 256-bit SSL
      </p>

      <div className="Register-crisis-footer">
        <p className="Register-crisis-title">Immediate Psychological Support</p>
        <p className="Register-crisis-text">
          If you or someone you know is in crisis, call the toll-free 24/7
          <br />
          Campus Crisis Line: <strong>080 012 3222</strong>
        </p>
      </div>
    </div>
    </div>
  );
}

export default RegisterPage;