CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS advisor_reviews, message_log, detection_flags, engagement_records,
  funding_status_history, assignments, attendance_records, students CASCADE;

CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_number VARCHAR(30) UNIQUE NOT NULL,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  programme VARCHAR(120) NOT NULL,
  year_level SMALLINT NOT NULL CHECK (year_level BETWEEN 1 AND 6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE attendance_records (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  attendance_percent NUMERIC(5,2) NOT NULL CHECK (attendance_percent BETWEEN 0 AND 100),
  UNIQUE(student_id, period_start)
);

CREATE TABLE assignments (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  assignment_code VARCHAR(50) NOT NULL,
  due_date DATE NOT NULL,
  submitted BOOLEAN NOT NULL,
  submitted_at TIMESTAMPTZ,
  UNIQUE(student_id, assignment_code)
);

CREATE TABLE funding_status_history (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active','approved','pending','unresolved')),
  effective_at TIMESTAMPTZ NOT NULL,
  UNIQUE(student_id, effective_at)
);

CREATE TABLE engagement_records (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  login_count INTEGER NOT NULL CHECK (login_count >= 0),
  UNIQUE(student_id, period_start)
);

CREATE TABLE detection_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  rule_code VARCHAR(50) NOT NULL,
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('medium','high')),
  reason TEXT NOT NULL,
  threshold_value NUMERIC,
  observed_value NUMERIC,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','approved','dismissed','resolved')),
  UNIQUE(student_id, rule_code, detected_at)
);

CREATE TABLE message_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  flag_id UUID REFERENCES detection_flags(id) ON DELETE SET NULL,
  message_text TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reply_text TEXT
);

CREATE TABLE advisor_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_id UUID NOT NULL REFERENCES detection_flags(id) ON DELETE CASCADE,
  advisor_name VARCHAR(120) NOT NULL,
  decision VARCHAR(20) NOT NULL CHECK (decision IN ('approved','dismissed','resolved')),
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX idx_attendance_student_period ON attendance_records(student_id, period_start DESC);
CREATE INDEX idx_assignments_student_due ON assignments(student_id, due_date DESC);
CREATE INDEX idx_funding_student_effective ON funding_status_history(student_id, effective_at DESC);
CREATE INDEX idx_engagement_student_period ON engagement_records(student_id, period_start DESC);
CREATE INDEX idx_flags_status_detected ON detection_flags(status, detected_at DESC);
