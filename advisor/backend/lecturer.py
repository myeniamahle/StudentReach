# lecturer.py — lecturer-facing endpoints

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db import query, execute

router = APIRouter()


@router.get("/lecturer/students/{programme}")
async def get_students_in_programme(programme: str):
    """
    Return all students in a programme with their latest stats.
    """
    rows = query(
        """
        SELECT
            s.id,
            s.student_number,
            s.first_name,
            s.last_name,
            s.email,
            s.programme,
            s.year_level,
            (SELECT attendance_percent
               FROM attendance_records ar
              WHERE ar.student_id = s.id
              ORDER BY period_start DESC LIMIT 1) AS latest_attendance,
            (SELECT COUNT(*) FROM assignments a
              WHERE a.student_id = s.id AND a.submitted = false) AS missed_assignments,
            (SELECT login_count
               FROM engagement_records er
              WHERE er.student_id = s.id
              ORDER BY period_start DESC LIMIT 1) AS latest_engagement,
            (SELECT COUNT(*) FROM detection_flags f
              WHERE f.student_id = s.id AND f.status = 'active') AS active_flags
        FROM students s
        WHERE s.programme = %s
        ORDER BY s.last_name, s.first_name
        """,
        (programme,)
    )
    return rows


@router.get("/lecturer/student/{student_id}")
async def get_student_detail(student_id: str):
    """
    Return full history for one student:
    attendance, assignments, engagement, funding, active flags.
    """
    student = query(
        "SELECT * FROM students WHERE id = %s",
        (student_id,)
    )
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    attendance = query(
        """SELECT period_start, attendance_percent
             FROM attendance_records
            WHERE student_id = %s
            ORDER BY period_start ASC""",
        (student_id,)
    )

    assignments = query(
        """SELECT assignment_code, due_date, submitted, submitted_at
             FROM assignments
            WHERE student_id = %s
            ORDER BY due_date DESC""",
        (student_id,)
    )

    engagement = query(
        """SELECT period_start, login_count
             FROM engagement_records
            WHERE student_id = %s
            ORDER BY period_start ASC""",
        (student_id,)
    )

    funding = query(
        """SELECT status, effective_at
             FROM funding_status_history
            WHERE student_id = %s
            ORDER BY effective_at DESC""",
        (student_id,)
    )

    flags = query(
        """SELECT id, rule_code, priority, reason, detected_at, status
             FROM detection_flags
            WHERE student_id = %s AND status = 'active'
            ORDER BY detected_at DESC""",
        (student_id,)
    )

    return {
        "student": student[0],
        "attendance": attendance,
        "assignments": assignments,
        "engagement": engagement,
        "funding": funding,
        "flags": flags,
    }


class ConcernRequest(BaseModel):
    student_id: str
    category: str           # e.g., "Wellness Concerns"
    indicators: list[str]   # e.g., ["Missed Deadlines", "Low Attendance"]
    urgency: str            # "low", "medium", "high"
    notes: str = ""


@router.post("/lecturer/report-concern")
async def report_concern(data: ConcernRequest):
    """
    Create a new detection_flag from a lecturer's concern.
    rule_code is LECTURER_REPORT.
    """
    # Map urgency to priority (her schema only allows medium/high)
    priority = "high" if data.urgency == "high" else "medium"

    reason_parts = [f"Lecturer report ({data.category})"]
    if data.indicators:
        reason_parts.append(f"Indicators: {', '.join(data.indicators)}")
    if data.notes:
        reason_parts.append(f"Notes: {data.notes}")
    reason = ". ".join(reason_parts)

    result = execute(
        """
        INSERT INTO detection_flags
            (student_id, rule_code, priority, reason, status)
        VALUES (%s, 'LECTURER_REPORT', %s, %s, 'active')
        RETURNING id
        """,
        (data.student_id, priority, reason)
    )

    return {"ok": True, "flag_id": str(result[0]["id"])}