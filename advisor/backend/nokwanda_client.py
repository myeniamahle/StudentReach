# nokwanda_client.py — calls Nokwanda's Node backend on port 4000

import httpx

NOKWANDA_API = "http://localhost:4000/api"

async def fetch_active_flags():
    """Fetch all active flags. Returns list of flag dicts."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{NOKWANDA_API}/flags")
        response.raise_for_status()
        return response.json()

async def fetch_flag(flag_id: str):
    """Fetch one flag with student details."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{NOKWANDA_API}/flags/{flag_id}")
        response.raise_for_status()
        return response.json()

async def update_flag_status(flag_id: str, status: str, advisor_name: str, notes: str = ""):
    """
    Save advisor decision.
    status must be one of: 'approved', 'dismissed', 'resolved'
    """
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.patch(
            f"{NOKWANDA_API}/flags/{flag_id}/status",
            json={
                "status": status,
                "advisorName": advisor_name,
                "notes": notes or None,
            }
        )
        response.raise_for_status()
        return response.json()

async def health_check():
    """Check if her DB is connected."""
    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(f"{NOKWANDA_API}/health")
        return response.json()