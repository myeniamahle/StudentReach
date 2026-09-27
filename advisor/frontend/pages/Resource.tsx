// Resource.tsx — shows the guidance content based on the student's reply

import { useParams, useNavigate } from 'react-router-dom';
import './Resource.css';

const RESOURCES: Record<string, { title: string; body: string }> = {
  '1': {
    title: 'Academic Support',
    body: 'Connect with the Academic Support office for tutoring, study plans, and assignment extensions.',
  },
  '2': {
    title: 'Funding Support',
    body: 'The Financial Aid office can help with NSFAS queries, allowance delays, and emergency funding.',
  },
  '3': {
    title: 'Admin Support',
    body: 'Admin can assist with registration, documentation, and general campus queries.',
  },
  '4': {
    title: 'Other Support',
    body: 'A counsellor will reach out to help you find the right support channel.',
  },
};

export function Resource() {
  const { id, option } = useParams<{ id: string; option: string }>();
  const navigate = useNavigate();
  const resource = RESOURCES[option ?? ''] ?? { title: 'Support', body: 'Please select an option.' };

  return (
    <div className="resource">
      <button onClick={() => navigate(`/advisor/message-preview/${id}`)}>← Back</button>
      <h1>{resource.title}</h1>
      <p>{resource.body}</p>
    </div>
  );
}