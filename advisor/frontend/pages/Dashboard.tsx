// Dashboard.tsx — flag list sorted by priority
import './Dashboard.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFlags } from '../api';

interface Flag {
  id: string;
  student_id: string;
  student_number: string;
  first_name: string;
  last_name: string;
  programme: string;
  year_level?: number;
  rule_code: string;
  reason: string;
  priority: string;
  threshold_value: string | null;
  observed_value: string | null;
  detected_at: string;
  status: string;
}

export function Dashboard() {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getFlags().then((data) => {
      const order: Record<string, number> = { high: 1, medium: 2 };
      const sorted = data.sort((a: Flag, b: Flag) =>
        (order[a.priority] || 99) - (order[b.priority] || 99)
      );
      setFlags(sorted);
      setLoading(false);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) return <p>Loading flags...</p>;

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Active Flags</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Priority</th>
            <th>Student</th>
            <th>Programme</th>
            <th>Rule</th>
            <th>Reason</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {flags.map((flag) => (
            <tr key={flag.id} className={`priority-${flag.priority}`}>
              <td>{flag.priority.toUpperCase()}</td>
              <td>
                {flag.first_name} {flag.last_name}
                <br />
                <small>{flag.student_number}</small>
              </td>
              <td>{flag.programme}</td>
              <td>{flag.rule_code}</td>
              <td>{flag.reason}</td>
              <td>
                <button onClick={() => navigate(`/advisor/flag/${flag.id}`)}>
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}