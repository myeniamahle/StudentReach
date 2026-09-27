# flags.py — serves flag data to the React frontend
# Backed by Nokwanda's Node API on port 4000, with fake_data fallback

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from nokwanda_client import fetch_active_flags, fetch_flag, update_flag_status
from fake_data import FLAGS as FALLBACK_FLAGS

router = APIRouter()

class DecisionRequest(BaseModel):
    decision: str  # "approved" or "dismissed"
    notes: str = ""

@router.get("/flags")
async def get_flags():
    """List all active flags. Falls back to fake data if her service is down."""
    try:
        return await fetch_active_flags()
    except Exception as e:
        print(f"[WARN] Nokwanda API unavailable, using fallback: {e}")
        return [f for f in FALLBACK_FLAGS if f["status"] == "active"]

@router.get("/flags/{flag_id}")
async def get_flag(flag_id: str):
    """Get one flag with full details."""
    try:
        return await fetch_flag(flag_id)
    except Exception as e:
        print(f"[WARN] Nokwanda API unavailable, using fallback: {e}")
        flag = next((f for f in FALLBACK_FLAGS if str(f["id"]) == flag_id), None)
        if not flag:
            raise HTTPException(status_code=404, detail="Flag not found")
        return flag

@router.post("/flags/{flag_id}/decide")
async def decide_flag(flag_id: str, data: DecisionRequest):
    """Save advisor decision (approve or dismiss)."""
    try:
        result = await update_flag_status(
            flag_id=flag_id,
            status=data.decision,
            advisor_name="Amahle",
            notes=data.notes,
        )
        return {"ok": True, "flag": result}
    except Exception as e:
        print(f"[WARN] Nokwanda API unavailable, decision not saved: {e}")
        return {"ok": True, "note": "Fallback mode — decision not persisted"}

@router.post("/flags/{flag_id}/resolve")
async def resolve_flag(flag_id: str, notes: str = ""):
    """Mark a flag as resolved (follow-up page)."""
    try:
        result = await update_flag_status(
            flag_id=flag_id,
            status="resolved",
            advisor_name="Amahle",
            notes=notes,
        )
        return {"ok": True, "flag": result}
    except Exception as e:
        return {"ok": True, "note": "Fallback mode"}