import "./LoginPage.css";
import logo from "../components/logo.svg";
import p_icon from "../components/profile icon.svg";
import l_icon from "../components/lock-icon.svg";
import google from "../components/google icon.svg";
import apple from "../components/apple icon.svg";
import w_logo from "../components/wordlogo.svg";

function LoginPage() {
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

        <div className="Login-tab-group">
          <button type="button" className="Login-tab-button Login-tab-button--active">
            Student
          </button>
          <button type="button" className="Login-tab-button">
            Lecturer
          </button>
          <button type="button" className="Login-tab-button">
            Admin
          </button>
        </div>

        <form>
          <div className="Login-input-wrapper">
            <img src={p_icon} alt="" className="Login-input-icon" />
            <input type="text" placeholder="Enter Username or Email" className="Login-input" />
          </div>

          <div className="Login-input-wrapper">
            <img src={l_icon} alt="" className="Login-input-icon" />
            <input type="password" placeholder="Enter Your Password" className="Login-input" />
          </div>

          <button type="submit" className="Login-button">
            LOGIN
          </button>
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