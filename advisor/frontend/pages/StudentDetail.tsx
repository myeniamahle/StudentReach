// StudentDetail.tsx — full student history for a lecturer

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentDetail } from '../api';
import './StudentDetail.css';

interface Student {
  id: string;
  student_number: string;
  first_name: string;
  last_name: string;
  email: string;
  programme: string;
  year_level: number;
}

interface StudentDetailData {
  student: Student;
  attendance: { period_start: string; attendance_percent: string }[];
  assignments: { assignment_code: string; due_date: string; submitted: boolean }[];
  engagement: { period_start: string; login_count: number }[];
  funding: { status: string; effective_at: string }[];
  flags: { id: string; rule_code: string; priority: string; reason: string }[];
}

export function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<StudentDetailData | null>(null);

  useEffect(() => {
    if (id) getStudentDetail(id).then(setData);
  }, [id]);

  if (!data) return <p>Loading...</p>;

  const { student, attendance, assignments, engagement, funding, flags } = data;
  const submitted = assignments.filter(a => a.submitted).length;
  const total = assignments.length;

  return (
    <div className="student-detail">
      <button onClick={() => navigate('/lecturer/dashboard')}>← Back</button>

      <h1>{student.first_name} {student.last_name}</h1>
      <p className="student-meta">
        {student.student_number} · {student.programme} · Year {student.year_level}
      </p>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Assignments</span>
          <span className="stat-value">{submitted}/{total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Latest Attendance</span>
          <span className="stat-value">{attendance[attendance.length - 1]?.attendance_percent ?? '—'}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active Flags</span>
          <span className="stat-value">{flags.length}</span>
        </div>
      </div>

      {flags.length > 0 && (
        <div className="flags-section">
          <h2>Active Flags</h2>
          {flags.map(f => (
            <div key={f.id} className="flag-item">
              <strong>{f.rule_code}</strong> — {f.reason}
            </div>
          ))}
        </div>
      )}

      <div className="action-row">
        <button
          className="report-button"
          onClick={() => navigate(`/lecturer/report-concern/${id}`)}
        >
          Report Student Concern
        </button>
      </div>

      <div className="section">
        <h2>Attendance (last 8 periods)</h2>
        <ul className="history-list">
          {attendance.slice(-8).reverse().map((a, i) => (
            <li key={i}>
              {a.period_start}: <strong>{a.attendance_percent}%</strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h2>Assignment Submissions</h2>
        <ul className="history-list">
          {assignments.slice(0, 10).map((a, i) => (
            <li key={i}>
              {a.assignment_code} ({a.due_date}) —{' '}
              <strong style={{ color: a.submitted ? '#047857' : '#b91c1c' }}>
                {a.submitted ? 'Submitted' : 'Missed'}
              </strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h2>Engagement (last 8 periods)</h2>
        <ul className="history-list">
          {engagement.slice(-8).reverse().map((e, i) => (
            <li key={i}>
              {e.period_start}: <strong>{e.login_count} logins</strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h2>Funding History</h2>
        <ul className="history-list">
          {funding.slice(0, 5).map((f, i) => (
            <li key={i}>
              {f.effective_at.slice(0, 10)}: <strong>{f.status}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}