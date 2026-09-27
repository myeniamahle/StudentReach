import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { clearDemoSession, getDemoSession } from "../auth/demoSession";
import "./StudentChatPage.css";

const API_URL = "http://localhost:4000";
const REPLIES = [
  { code: 1, text: "I'm okay, just been busy" },
  { code: 2, text: "I'm struggling with the workload" },
  { code: 3, text: "I have personal issues" },
  { code: 4, text: "I need funding help" }
];

type Message = { id: string; sender: string; text: string };

function StudentChatPage() {
  const { studentId = "" } = useParams();
  const session = getDemoSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/students/${studentId}/messages`)
      .then(async response => {
        if (!response.ok) throw new Error("Could not load messages for this student.");
        return response.json();
      })
      .then(loadedMessages => {
        if (active) setMessages(loadedMessages);
      })
      .catch(requestError => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [studentId]);

  async function sendReply(reply: { code: number; text: string }) {
    setSending(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`${API_URL}/students/${studentId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply_code: reply.code, reply_text: reply.text })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not send your reply.");
      setNotice("Your reply was sent to your advisor.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Request failed.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="student-chat-page">
      <header className="student-chat-header">
        <div>
          <p>STUDENTREACH / STUDENT SUPPORT</p>
          <h1>Messages from your advisor</h1>
        </div>
        <nav aria-label="Main navigation">
          {session?.role === "student" ? (
            <>
              <Link to="/messages">My inbox</Link>
              <Link to="/dashboard">Dashboard</Link>
            </>
          ) : (
            <Link to="/advisor">Advisor queue</Link>
          )}
          <button type="button" onClick={() => { clearDemoSession(); window.location.assign("/login"); }}>Sign out</button>
        </nav>
      </header>

      <section className="student-chat-thread" aria-live="polite" aria-label="Advisor messages">
        {loading && <p>Loading messages…</p>}
        {error && <p className="student-chat-error" role="alert">{error}</p>}
        {!loading && !error && messages.length === 0 && (
          <p className="student-chat-empty">No advisor messages yet.</p>
        )}
        {messages.map(message => (
          <article className="student-chat-message" key={message.id}>{message.text}</article>
        ))}
      </section>

      {notice && <p className="student-chat-notice" role="status">{notice}</p>}
      <section className="student-chat-replies" aria-label="Quick replies">
        <h2>Quick reply</h2>
        {REPLIES.map(reply => (
          <button key={reply.code} type="button" disabled={sending} onClick={() => sendReply(reply)}>
            {reply.text}
          </button>
        ))}
      </section>
    </main>
  );
}

export default StudentChatPage;
