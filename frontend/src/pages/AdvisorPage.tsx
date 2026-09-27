import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clearDemoSession } from "../auth/demoSession";
import "./AdvisorPage.css";

const API_URL = "http://localhost:4000";

type Flag = {
  id: string;
  student_id: string;
  student_number: string;
  first_name: string;
  last_name: string;
  programme: string;
  rule_code: string;
  priority: string;
  reason: string;
  threshold_value: number;
  observed_value: number;
  detected_at: string;
};

function AdvisorPage() {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/flags?status=active`)
      .then(async response => {
        if (!response.ok) throw new Error("Could not load active flags.");
        setFlags(await response.json());
      })
      .catch(requestError => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  async function reviewFlag(flag: Flag, decision: "approved" | "dismissed") {
    setError("");
    setNotice("");
    try {
      const response = await fetch(`${API_URL}/api/flags/${flag.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: decision, advisorName: "Demo Advisor" })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not review this flag.");

      setFlags(current => current.filter(item => item.id !== flag.id));
      if (decision === "approved") {
        setNotice(result.message
          ? `Approved and sent to ${flag.first_name} ${flag.last_name}.`
          : `Approved. No message was sent because a recent message is within the cooldown period.`);
      } else {
        setNotice(`Dismissed the flag for ${flag.first_name} ${flag.last_name}.`);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Request failed.");
    }
  }

  return (
    <main className="advisor-page">
      <header className="advisor-header">
        <div>
          <p className="advisor-eyebrow">STUDENTREACH / ADVISOR</p>
          <h1>Flag review queue</h1>
          <p>Review a signal before any message is sent to a student.</p>
        </div>
        <nav className="advisor-navigation" aria-label="Main navigation">
          <Link className="advisor-link" to="/dashboard">Dashboard</Link>
          <Link className="advisor-link" to="/messages">Student messages</Link>
          <button className="advisor-link advisor-sign-out" type="button" onClick={() => { clearDemoSession(); window.location.assign("/login"); }}>Sign out</button>
        </nav>
      </header>

      {notice && <p className="advisor-notice" role="status">{notice}</p>}
      {error && <p className="advisor-error" role="alert">{error}</p>}
      {loading && <p>Loading active flags…</p>}
      {!loading && !error && flags.length === 0 && <p className="advisor-empty">No active flags to review.</p>}

      <section className="advisor-list" aria-label="Active detection flags">
        {flags.map(flag => (
          <article className="advisor-flag" key={flag.id}>
            <div className="advisor-flag-heading">
              <div>
                <h2>{flag.first_name} {flag.last_name}</h2>
                <p>{flag.student_number} · {flag.programme}</p>
              </div>
              <span className={`advisor-priority advisor-priority--${flag.priority}`}>{flag.priority}</span>
            </div>
            <p className="advisor-rule">{flag.rule_code.replaceAll("_", " ")}</p>
            <p className="advisor-reason">{flag.reason}</p>
            <p className="advisor-measure">
              Threshold: {flag.threshold_value} · Observed: {flag.observed_value} · {new Date(flag.detected_at).toLocaleString()}
            </p>
            <div className="advisor-actions">
              <button type="button" onClick={() => reviewFlag(flag, "approved")}>Approve and send message</button>
              <button type="button" className="advisor-dismiss" onClick={() => reviewFlag(flag, "dismissed")}>Dismiss</button>
              <Link to={`/chat/${flag.student_id}`}>Open student chat</Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default AdvisorPage;
