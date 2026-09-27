// LecturerDashboard.tsx — students in the lecturer's programme

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentsInProgramme } from '../api';
import './LecturerDashboard.css';

interface Student {
  id: string;
  student_number: string;
  first_name: string;
  last_name: string;
  email: string;
  programme: string;
  year_level: number;
  latest_attendance: string | null;
  missed_assignments: number;
  latest_engagement: number | null;
  active_flags: number;
}

export function LecturerDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const programme = localStorage.getItem('programme') || 'Computer Science';

  useEffect(() => {
    getStudentsInProgramme(programme).then((data) => {
      setStudents(data);
      setLoading(false);
    });
  }, [programme]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('programme');
    navigate('/login');
  };

  if (loading) return <p>Loading students...</p>;

  return (
    <div className="lecturer-dashboard">
      <div className="header">
        <div>
          <h1>My Students</h1>
          <p className="subtitle">{programme} — {students.length} students</p>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Year</th>
            <th>Attendance</th>
            <th>Missed</th>
            <th>Engagement</th>
            <th>Flags</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>
                {s.first_name} {s.last_name}
                <br />
                <small>{s.student_number}</small>
              </td>
              <td>{s.year_level}</td>
              <td>{s.latest_attendance ? `${s.latest_attendance}%` : '—'}</td>
              <td>{s.missed_assignments}</td>
              <td>{s.latest_engagement ?? '—'}</td>
              <td>
                {s.active_flags > 0 ? (
                  <span className="flag-badge">{s.active_flags}</span>
                ) : '—'}
              </td>
              <td>
                <button onClick={() => navigate(`/lecturer/student/${s.id}`)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}