// FollowUp.tsx — mark resolved or not resolved
import './FollowUp.css';
import { useParams, useNavigate } from 'react-router-dom';
import { resolveFlag } from '../api';

export function FollowUp() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleOutcome = async () => {
    await resolveFlag(id!);
    navigate('/advisor/dashboard');
  };

  return (
    <div className="follow-up">
      <h1>Follow-Up</h1>
      <p>Was this issue resolved?</p>
      <select onChange={handleOutcome} defaultValue="">
        <option value="" disabled>Select outcome</option>
        <option value="resolved">Resolved</option>
        <option value="not_resolved">Not Resolved</option>
      </select>
    </div>
  );
}