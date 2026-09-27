import "./Dashboard.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { clearDemoSession, getDemoSession } from "../auth/demoSession";
import logoMark from "../components/logo.svg";
import wordLogo from "../components/wordlogo.svg";
import meshGradient from "../components/mesh-card.png";
import capIcon from "../components/grad-hat icon.svg";
import heartIcon from "../components/wellness-icon.svg";
import milestoneIcon from "../components/checklist icon.svg";
import sparkleIcon from "../components/sparkle_icon.svg";
import phoneIcon from "../components/phone_icon.svg";
import chatIcon from "../components/chat_icon.svg";
import sadicon from "../components/sad_icon.svg";
import neutralIcon from "../components/neutral_icon.svg";
import ex_Icon from "../components/exhausted_icon.svg";

type StudentDashboardProfile = {
  student_number: string;
  first_name: string;
  programme: string;
  attendance: Array<{ attendancePercent: string | number }>;
  assignments: Array<{ submitted: boolean }>;
  engagement: Array<unknown>;
};

function Dashboard() {
  const session = getDemoSession();
  const [student, setStudent] = useState<StudentDashboardProfile | null>(null);
  const [selectedMood, setSelectedMood] = useState("");
  const [stressors, setStressors] = useState<string[]>([]);
  const [checkInMessage, setCheckInMessage] = useState("");
  const [showCheckIn, setShowCheckIn] = useState(true);
  const [submittedCheckIn, setSubmittedCheckIn] = useState<{ mood: string; stressors: string[]; note: string; date: string } | null>(null);
  const [reflection, setReflection] = useState("");
  const [pressure, setPressure] = useState(1);

  useEffect(() => {
    if (!session?.studentId) return;
    fetch(`http://localhost:4000/api/students/${session.studentId}`)
      .then(response => response.ok ? response.json() as Promise<StudentDashboardProfile> : null)
      .then(profile => setStudent(profile))
      .catch(() => setStudent(null));
  }, [session?.studentId]);

  function toggleStressor(stressor: string) {
    setStressors(current => current.includes(stressor)
      ? current.filter(item => item !== stressor)
      : [...current, stressor]);
  }

  function submitCheckIn() {
    if (!selectedMood) {
      setCheckInMessage("Choose how you are feeling before submitting.");
      return;
    }
    const record = { mood: selectedMood, stressors, note: reflection, date: new Date().toLocaleDateString() };
    setSubmittedCheckIn(record);
    setCheckInMessage("Your check-in was added to this page. It is not saved to the database yet.");
  }

  const latestAttendance = student?.attendance?.at(-1)?.attendancePercent;
  const submittedAssignments = student?.assignments?.filter((assignment: { submitted: boolean }) => assignment.submitted).length;
  const assignmentCount = student?.assignments?.length;
  const attendanceValue = latestAttendance == null ? "—" : `${Number(latestAttendance).toFixed(0)}%`;
  const assessmentValue = assignmentCount ? `${Math.round((submittedAssignments ?? 0) / assignmentCount * 100)}%` : "—";

  return (
    <div className="Dashboard-page">
      {/* Top nav */}
      <div className="Dashboard-navbar">
        <div className="Dashboard-navbar-brand">
          <img src={logoMark} alt="" className="Dashboard-navbar-logo" />
          <img src={wordLogo} alt="StudentReach" className="Dashboard-navbar-wordmark" />
        </div>
        <nav className="Dashboard-navbar-actions" aria-label="Main navigation">
          <Link to="/messages" className="Dashboard-nav-link">Messages</Link>
          <button type="button" className="Dashboard-nav-link Dashboard-sign-out" onClick={() => { clearDemoSession(); window.location.assign("/login"); }}>Sign out</button>
        </nav>
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
            <span className="Dashboard-hero-student-id">#{student?.student_number || session?.studentNumber || "STUDENT"}</span>
          </div>

          <h1 className="Dashboard-hero-greeting">Sawubona, {student?.first_name || session?.firstName || "Student"}!</h1>
          <p className="Dashboard-hero-faculty">{student?.programme || "Student profile"}</p>

          <div className="Dashboard-hero-stats">
            <div className="Dashboard-stat-card">
              <span className="Dashboard-stat-label">Student Number</span>
              <span className="Dashboard-stat-value">{student?.student_number || session?.studentNumber || "—"}</span>
            </div>
            <div className="Dashboard-stat-card">
              <span className="Dashboard-stat-label">Assessments</span>
              <span className="Dashboard-stat-value">{assessmentValue}</span>
            </div>
            <div className="Dashboard-stat-card">
              <span className="Dashboard-stat-label">Term Attendance</span>
              <span className="Dashboard-stat-value Dashboard-stat-value--accent">{attendanceValue}</span>
            </div>
            <div className="Dashboard-stat-card">
              <span className="Dashboard-stat-label">Engagement Periods</span>
              <span className="Dashboard-stat-value">{student?.engagement?.length ?? "—"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="Dashboard-tab-row">
        <button type="button" className="Dashboard-tab Dashboard-tab--active" onClick={() => document.getElementById("daily-check-in")?.scrollIntoView({ behavior: "smooth" })}>
          <img src={heartIcon} alt="" className="Dashboard-tab-icon" />
          Wellness Check-In
        </button>
        <button type="button" className="Dashboard-tab" onClick={() => document.querySelector(".Dashboard-support-card")?.scrollIntoView({ behavior: "smooth" })}>
          <img src={capIcon} alt="" className="Dashboard-tab-icon" />
          Academic &amp; Support
        </button>
        <button type="button" className="Dashboard-tab" onClick={() => document.querySelector(".Dashboard-history-heading")?.scrollIntoView({ behavior: "smooth" })}>
          <img src={milestoneIcon} alt="" className="Dashboard-tab-icon" />
          Milestones
        </button>
      </div>

      {/* Daily check-in card */}
      {showCheckIn && <div className="Dashboard-card" id="daily-check-in">
        <div className="Dashboard-card-header">
          <div>
            <h2 className="Dashboard-card-title">Daily Check-In</h2>
            <p className="Dashboard-card-subtitle">Take 15 seconds to log your mental space</p>
          </div>
          <button type="button" className="Dashboard-card-close" aria-label="Close check-in" onClick={() => setShowCheckIn(false)}>
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <p className="Dashboard-question">How are you feeling right now?</p>
        <div className="Dashboard-mood-row">
          <button type="button" aria-pressed={selectedMood === "Struggling"} className={`Dashboard-mood-button${selectedMood === "Struggling" ? " Dashboard-mood-button--active" : ""}`} onClick={() => setSelectedMood("Struggling")}>
           <img src={ex_Icon} alt="" className="Dashboard-mood-emoji" />
            <span className="Dashboard-mood-label">Struggling</span>
          </button>
          <button type="button" aria-pressed={selectedMood === "Low"} className={`Dashboard-mood-button${selectedMood === "Low" ? " Dashboard-mood-button--active" : ""}`} onClick={() => setSelectedMood("Low")}>
            <img src={sadicon} alt="" className="Dashboard-mood-emoji" />
            <span className="Dashboard-mood-label">Low</span>
          </button>
          <button type="button" aria-pressed={selectedMood === "Okay"} className={`Dashboard-mood-button${selectedMood === "Okay" ? " Dashboard-mood-button--active" : ""}`} onClick={() => setSelectedMood("Okay")}>
            <img src={neutralIcon} alt="" className="Dashboard-mood-emoji" />
            <span className="Dashboard-mood-label">Okay</span>
          </button>
          <button type="button" aria-pressed={selectedMood === "Great"} className={`Dashboard-mood-button${selectedMood === "Great" ? " Dashboard-mood-button--active" : ""}`} onClick={() => setSelectedMood("Great")}>
            <img src={sparkleIcon} alt="" className="Dashboard-mood-emoji" />
            <span className="Dashboard-mood-label">Great</span>
          </button>
        </div>

        <p className="Dashboard-question">What stressors are impacting you right now?</p>
        <div className="Dashboard-stressor-grid">
          <button type="button" aria-pressed={stressors.includes("Midterm Exams")} className={`Dashboard-stressor-chip${stressors.includes("Midterm Exams") ? " Dashboard-stressor-chip--active" : ""}`} onClick={() => toggleStressor("Midterm Exams")}>
            Midterm Exams
          </button>
          <button type="button" aria-pressed={stressors.includes("Accommodation / Commute")} className={`Dashboard-stressor-chip${stressors.includes("Accommodation / Commute") ? " Dashboard-stressor-chip--active" : ""}`} onClick={() => toggleStressor("Accommodation / Commute")}>
            Accommodation / Commute
          </button>
          <button type="button" aria-pressed={stressors.includes("Mental Exhaustion")} className={`Dashboard-stressor-chip${stressors.includes("Mental Exhaustion") ? " Dashboard-stressor-chip--active" : ""}`} onClick={() => toggleStressor("Mental Exhaustion")}>
            Mental Exhaustion
          </button>
          <button type="button" aria-pressed={stressors.includes("Assignment Deadlines")} className={`Dashboard-stressor-chip${stressors.includes("Assignment Deadlines") ? " Dashboard-stressor-chip--active" : ""}`} onClick={() => toggleStressor("Assignment Deadlines")}>
            Assignment Deadlines
          </button>
          <button type="button" aria-pressed={stressors.includes("Group Project Dynamics")} className={`Dashboard-stressor-chip${stressors.includes("Group Project Dynamics") ? " Dashboard-stressor-chip--active" : ""}`} onClick={() => toggleStressor("Group Project Dynamics")}>
            Group Project Dynamics
          </button>
          <button type="button" aria-pressed={stressors.includes("NSFAS / Allowance Delays")} className={`Dashboard-stressor-chip${stressors.includes("NSFAS / Allowance Delays") ? " Dashboard-stressor-chip--active" : ""}`} onClick={() => toggleStressor("NSFAS / Allowance Delays")}>
            NSFAS / Allowance Delays
          </button>
        </div>

        <p className="Dashboard-question">Perceived Academic Workload Pressure:</p>
        <div className="Dashboard-slider-wrapper">
          <input type="range" min={0} max={3} value={pressure} onChange={event => setPressure(Number(event.target.value))} className="Dashboard-slider" />
          <div className="Dashboard-slider-labels">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
            <span>Overwhelming</span>
          </div>
        </div>

        <p className="Dashboard-question">Personal Reflection or Note (Optional):</p>
        <textarea className="Dashboard-textarea" rows={3} value={reflection} onChange={event => setReflection(event.target.value)} placeholder="Optional note" />
      </div>}

      {showCheckIn && <button type="button" className="Dashboard-submit-button" onClick={submitCheckIn}>
        Submit Wellness Check-In
      </button>}
      {checkInMessage && <p className="Dashboard-check-in-message" role="status">{checkInMessage}</p>}

      {/* Check-in history */}
      <h3 className="Dashboard-history-heading">RECENT CHECK-IN HISTORY</h3>

      <div className="Dashboard-history-list">
        {submittedCheckIn ? (
          <div className="Dashboard-history-item">
            <p className="Dashboard-history-date">{submittedCheckIn.date}</p>
            <p className="Dashboard-history-meta">Feeling: {submittedCheckIn.mood} · Pressure: {pressure + 1}/4</p>
            {submittedCheckIn.stressors.length > 0 && <p className="Dashboard-history-meta">Stressors: {submittedCheckIn.stressors.join(", ")}</p>}
            {submittedCheckIn.note && <p className="Dashboard-history-quote">{submittedCheckIn.note}</p>}
          </div>
        ) : (
          <p className="Dashboard-history-meta">No check-ins have been added in this session yet.</p>
        )}
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

          <a href="tel:0800121314" className="Dashboard-support-button Dashboard-support-button--primary">
            <img src={phoneIcon} alt="" className="Dashboard-support-button-icon" />
            Call SADAG Crisis Line (0800 12 13 14)
          </a>
          <a href="https://wa.me/27000000000" className="Dashboard-support-button Dashboard-support-button--secondary" target="_blank" rel="noreferrer">
            <img src={chatIcon} alt="" className="Dashboard-support-button-icon" />
            WhatsApp Student Counsellor
          </a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;