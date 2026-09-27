// FlagDetail.tsx — single flag with action buttons
import './FlagDetail.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFlag, decideFlag } from '../api';

interface Flag {
  id: string;
  student_id: string;
  student_number: string;
  first_name: string;
  last_name: string;
  programme: string;
  year_level: number;
  rule_code: string;
  reason: string;
  priority: string;
  threshold_value: string | null;
  observed_value: string | null;
  detected_at: string;
  status: string;
}

export function FlagDetail() {
  const { id } = useParams();
  const [flag, setFlag] = useState<Flag | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) getFlag(id).then(setFlag);
  }, [id]);

  const handleDecision = async (decision: 'approved' | 'dismissed') => {
    if (!id) return;
    setBusy(true);
    try {
      await decideFlag(id, decision);
      if (decision === 'approved') {
        navigate(`/advisor/message-preview/${id}`);
      } else {
        navigate('/advisor/dashboard');
      }
    } catch (err) {
      console.error(err);
      setBusy(false);
    }
  };

  if (!flag) return <p>Loading...</p>;

  return (
    <div className="flag-detail">
      <button onClick={() => navigate('/advisor/dashboard')}>← Back</button>

      <h1>{flag.first_name} {flag.last_name}</h1>
      <p><strong>Student #:</strong> {flag.student_number}</p>
      <p><strong>Programme:</strong> {flag.programme} (Year {flag.year_level})</p>
      <p><strong>Rule:</strong> {flag.rule_code}</p>
      <p><strong>Reason:</strong> {flag.reason}</p>
      <p><strong>Priority:</strong> {flag.priority.toUpperCase()}</p>
      {flag.rule_code === 'LECTURER_REPORT' && (
  <p><strong>Source:</strong> Reported by a lecturer</p>
)}
      {flag.observed_value && (
        <p><strong>Observed:</strong> {flag.observed_value} (threshold {flag.threshold_value})</p>
      )}

      <div className="actions">
        <button
          onClick={() => handleDecision('approved')}
          className="approve"
          disabled={busy}
        >
          {busy ? 'Saving...' : 'Approve'}
        </button>
        <button
          onClick={() => handleDecision('dismissed')}
          className="dismiss"
          disabled={busy}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}