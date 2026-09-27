# fake_data.py — temporary data store for hackathon demo

ADVISORS = [
    {"id": 1, "email": "amahle@demo.com", "password": "demo123", "role": "advisor"},
    {"id": 2, "email": "admin@demo.com", "password": "admin123", "role": "admin"},
]

# Temporary flags — Nokwanda's detection module will replace this later
FLAGS = [
    {
        "id": 1,
        "student_id": 101,
        "student_name": "Sawubona Khumalo",
        "rule_triggered": "attendance_drop",
        "reason": "Attendance dropped from 85% to 52% in the last 2 weeks",
        "priority": "high",
        "created_at": "2026-03-01T10:00:00",
        "status": "active"
    },
    {
        "id": 2,
        "student_id": 102,
        "student_name": "Nkosi Dlamini",
        "rule_triggered": "missed_assignments",
        "reason": "Missed 3 consecutive assignment submissions",
        "priority": "medium",
        "created_at": "2026-03-05T14:30:00",
        "status": "active"
    },
    {
        "id": 3,
        "student_id": 103,
        "student_name": "Thandi Mokoena",
        "rule_triggered": "engagement_drop",
        "reason": "Login frequency dropped by 60% compared to last month",
        "priority": "low",
        "created_at": "2026-03-10T09:15:00",
        "status": "active"
    },
]

# Decisions made by advisors — this is the audit trail
DECISIONS = []