// ReportConcern.tsx — lecturer submits a concern about a student

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportConcern } from '../api';
import './ReportConcern.css';

const CATEGORIES = [
  'Wellness Concerns',
  'Academic Concerns',
  'Funding Aid',
];

const INDICATORS = [
  'Missed Deadlines',
  'Low Attendance',
  'Disengagement',
  'Grade Drop',
  'Financial Hardship',
  'Social Withdrawal',
];

export function ReportConcern() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [indicators, setIndicators] = useState<string[]>([]);
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);

  const toggleIndicator = (i: string) => {
    setIndicators(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setBusy(true);
    try {
      await reportConcern({
        student_id: id,
        category,
        indicators,
        urgency,
        notes,
      });
      navigate(`/lecturer/student/${id}`);
    } catch (err) {
      console.error(err);
      setBusy(false);
    }
  };

  return (
    <div className="report-concern">
      <button onClick={() => navigate(`/lecturer/student/${id}`)}>← Back</button>
      <h1>Report Student Concern</h1>
      <p className="subtitle">
        Raise a concern about a student. It will appear in the advisor's queue.
      </p>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>1. Select Concern Category</legend>
          <div className="chip-row">
            {CATEGORIES.map(c => (
              <button
                type="button"
                key={c}
                className={category === c ? 'chip chip--active' : 'chip'}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>2. Observable Indicators</legend>
          <div className="chip-row">
            {INDICATORS.map(i => (
              <button
                type="button"
                key={i}
                className={indicators.includes(i) ? 'chip chip--active' : 'chip'}
                onClick={() => toggleIndicator(i)}
              >
                {i}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>3. Urgency Level</legend>
          <div className="chip-row">
            {(['low', 'medium', 'high'] as const).map(u => (
              <button
                type="button"
                key={u}
                className={urgency === u ? 'chip chip--active' : 'chip'}
                onClick={() => setUrgency(u)}
              >
                {u.toUpperCase()}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>4. Notes (optional)</legend>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Any additional context for the advisor..."
          />
        </fieldset>

        <button type="submit" className="submit-button" disabled={busy}>
          {busy ? 'Submitting...' : 'Submit Concern'}
        </button>
      </form>
    </div>
  );
}