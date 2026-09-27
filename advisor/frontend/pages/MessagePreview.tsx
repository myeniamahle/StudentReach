// MessagePreview.tsx — draft message before sending

import { useParams, useNavigate } from 'react-router-dom';
import './MessagePreview.css';

export function MessagePreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const draftMessage = `Hi, we noticed you may need some support. Your recent activity shows some changes. Reply 1 for academic help, 2 for funding, 3 for admin, or 4 for other.`;

  const handleOption = (n: number) => {
    // Move forward to FollowUp, storing which option was clicked
    navigate(`/advisor/follow-up/${id}?option=${n}`);
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
              onClick={() => handleOption(n)}
              className="reply-option"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <button onClick={() => navigate(`/advisor/follow-up/${id}`)}>
        Confirm
      </button>
    </div>
  );
}