// MessagePreview.tsx — shows draft message before sending
import './MessagePreview.css';
import { useParams, useNavigate } from 'react-router-dom';

export function MessagePreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Placeholder — Mmanga's AI layer will replace this
  const draftMessage = `Hi, we noticed you may need some support. Your recent activity shows some changes. Reply 1 for academic help, 2 for funding, 3 for admin, or 4 for other.`;

  const handleConfirm = () => {
    // In the full flow, this would trigger the message sending
    navigate(`/advisor/follow-up/${id}`);
  };

  return (
    <div className="message-preview">
      <h1>Message Preview</h1>
      <div className="chat-bubble">
        <p>{draftMessage}</p>
        <div className="reply-options">
  {[1, 2, 3, 4].map((n) => (
    <button
      key={n}
      onClick={() => navigate(`/advisor/resource/${id}/${n}`)}
      className="reply-option"
    >
      {n}
    </button>
  ))}
</div>
      </div>
      <button onClick={handleConfirm}>Confirm</button>
    </div>
  );
}