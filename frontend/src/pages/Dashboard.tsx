import "./Dashboard.css";
import logoMark from "../components/logo.svg";
import wordLogo from "../components/wordlogo.svg";
import meshGradient from "../components/mesh-card.png";
import chevronDown from "../components/chevron-down-icon.svg";
import capIcon from "../components/grad-hat icon.svg";
import heartIcon from "../components/wellness-icon.svg";
import milestoneIcon from "../components/checklist icon.svg";
import closeIcon from "../components/close_icon.svg";
import sparkleIcon from "../components/sparkle_icon.svg";
import phoneIcon from "../components/phone_icon.svg";
import chatIcon from "../components/chat_icon.svg";
import sadicon from "../components/sad_icon.svg";
import neutralIcon from "../components/neutral_icon.svg";
import ex_Icon from "../components/exhausted_icon.svg";

function Dashboard() {
  return (
    <div className="Dashboard-page">
      {/* Top nav */}
      <div className="Dashboard-navbar">
        <div className="Dashboard-navbar-brand">
          <img src={logoMark} alt="" className="Dashboard-navbar-logo" />
          <img src={wordLogo} alt="StudentReach" className="Dashboard-navbar-wordmark" />
        </div>
        <button type="button" className="Dashboard-role-pill">
          Student
          <img src={chevronDown} alt="" className="Dashboard-role-chevron" />
        </button>
      </div>

      {/* Hero card */}
      <div className="Dashboard-hero">
        <img src={meshGradient} alt="" className="Dashboard-hero-mesh" />
        <div className="Dashboard-hero-content">
          <div className="Dashboard-hero-top-row">
            <div className="Dashboard-hero-campus">
              <img src={capIcon} alt="" className="Dashboard-hero-campus-icon" />
              <span>Rosebank International Durban Campus</span>
            </div>
            <span className="Dashboard-hero-student-id">#KIMNDL001</span>
          </div>

          <h1 className="Dashboard-hero-greeting">Sawubona, Kim!</h1>
          <p className="Dashboard-hero-faculty">Faculty of Information Technology</p>

          <div className="Dashboard-hero-stats">
            <div className="Dashboard-stat-card">
              <span className="Dashboard-stat-label">StudentReach Health</span>
              <span className="Dashboard-stat-value">3.5 / 5.0</span>
            </div>
            <div className="Dashboard-stat-card">
              <span className="Dashboard-stat-label">Assessments</span>
              <span className="Dashboard-stat-value">88%</span>
            </div>
            <div className="Dashboard-stat-card">
              <span className="Dashboard-stat-label">Term Attendance</span>
              <span className="Dashboard-stat-value Dashboard-stat-value--accent">92%</span>
            </div>
            <div className="Dashboard-stat-card">
              <span className="Dashboard-stat-label">Check-ins Logged</span>
              <span className="Dashboard-stat-value">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="Dashboard-tab-row">
        <button type="button" className="Dashboard-tab Dashboard-tab--active">
          <img src={heartIcon} alt="" className="Dashboard-tab-icon" />
          Wellness Check-In
        </button>
        <button type="button" className="Dashboard-tab">
          <img src={capIcon} alt="" className="Dashboard-tab-icon" />
          Academic &amp; Support
        </button>
        <button type="button" className="Dashboard-tab">
          <img src={milestoneIcon} alt="" className="Dashboard-tab-icon" />
          Milestones
        </button>
      </div>

      {/* Daily check-in card */}
      <div className="Dashboard-card">
        <div className="Dashboard-card-header">
          <div>
            <h2 className="Dashboard-card-title">Daily Check-In</h2>
            <p className="Dashboard-card-subtitle">Take 15 seconds to log your mental space</p>
          </div>
          <button type="button" className="Dashboard-card-close" aria-label="Close">
            <img src={closeIcon} alt="" />
          </button>
        </div>

        <p className="Dashboard-question">How are you feeling right now?</p>
        <div className="Dashboard-mood-row">
          <button type="button" className="Dashboard-mood-button">
           <img src={ex_Icon} alt="" className="Dashboard-mood-emoji" />
            <span className="Dashboard-mood-label">Struggling</span>
          </button>
          <button type="button" className="Dashboard-mood-button">
            <img src={sadicon} alt="" className="Dashboard-mood-emoji" />
            <span className="Dashboard-mood-label">Low</span>
          </button>
          <button type="button" className="Dashboard-mood-button">
            <img src={neutralIcon} alt="" className="Dashboard-mood-emoji" />
            <span className="Dashboard-mood-label">Okay</span>
          </button>
          <button type="button" className="Dashboard-mood-button">
            <img src={sparkleIcon} alt="" className="Dashboard-mood-emoji" />
            <span className="Dashboard-mood-label">Great</span>
          </button>
        </div>

        <p className="Dashboard-question">What stressors are impacting you right now?</p>
        <div className="Dashboard-stressor-grid">
          <button type="button" className="Dashboard-stressor-chip">
            Midterm Exams
          </button>
          <button type="button" className="Dashboard-stressor-chip">
            Accommodation / Commute
          </button>
          <button type="button" className="Dashboard-stressor-chip Dashboard-stressor-chip--active">
            Mental Exhaustion
          </button>
          <button type="button" className="Dashboard-stressor-chip">
            Assignment Deadlines
          </button>
          <button type="button" className="Dashboard-stressor-chip">
            Group Project Dynamics
          </button>
          <button type="button" className="Dashboard-stressor-chip">
            NSFAS / Allowance Delays
          </button>
        </div>

        <p className="Dashboard-question">Perceived Academic Workload Pressure:</p>
        <div className="Dashboard-slider-wrapper">
          <input type="range" min={0} max={3} defaultValue={1} className="Dashboard-slider" />
          <div className="Dashboard-slider-labels">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
            <span>Overwhelming</span>
          </div>
        </div>

        <p className="Dashboard-question">Personal Reflection or Note (Optional):</p>
        <textarea className="Dashboard-textarea" rows={3} placeholder="" />
      </div>

      <button type="button" className="Dashboard-submit-button">
        Submit Wellness Check-In
      </button>

      {/* Check-in history */}
      <h3 className="Dashboard-history-heading">RECENT CHECK-IN HISTORY</h3>

      <div className="Dashboard-history-list">
        <div className="Dashboard-history-item">
          <p className="Dashboard-history-date">2026-08-19</p>
          <p className="Dashboard-history-meta">Energy: 3/5 ~ Sleep: 6h ~ Pressure: High</p>
          <p className="Dashboard-history-quote">
            "Feeling a bit overwhelmed by the web algorithms practical upcoming on Friday."
          </p>
        </div>
        <div className="Dashboard-history-item">
          <p className="Dashboard-history-date">2026-08-16</p>
          <p className="Dashboard-history-meta">Energy: 3/5 ~ Sleep: 6.5h ~ Pressure: Moderate</p>
          <p className="Dashboard-history-quote">
            "Good progress with the Durban campus computer lab today."
          </p>
        </div>
      </div>

      {/* Immediate support */}
      <div className="Dashboard-support-card">
        <img src={meshGradient} alt="" className="Dashboard-support-mesh" />
        <div className="Dashboard-support-content">
          <div className="Dashboard-support-eyebrow">
            <img src={phoneIcon} alt="" className="Dashboard-support-eyebrow-icon" />
            IMMEDIATE STUDENT SUPPORT
          </div>
          <h3 className="Dashboard-support-heading">Need to speak with someone?</h3>
          <p className="Dashboard-support-text">
            Rosebank International Durban Campus Student Wellness and SADAG 24/7 Student Crisis
            Helpline are free &amp; confidential.
          </p>

          <button type="button" className="Dashboard-support-button Dashboard-support-button--primary">
            <img src={phoneIcon} alt="" className="Dashboard-support-button-icon" />
            Call SADAG Crisis Line (0800 12 13 14)
          </button>
          <button type="button" className="Dashboard-support-button Dashboard-support-button--secondary">
            <img src={chatIcon} alt="" className="Dashboard-support-button-icon" />
            WhatsApp Student Counsellor
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;