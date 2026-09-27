# auth.py — login and session logic

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fake_data import ADVISORS

router = APIRouter()


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
async def login(data: LoginRequest):
    """
    Check email and password.
    Return a fake token + role + programme (for lecturers).
    """
    advisor = next((a for a in ADVISORS if a["email"] == data.email), None)

    if not advisor:
        raise HTTPException(status_code=401, detail="Email not found")

    if advisor["password"] != data.password:
        raise HTTPException(status_code=401, detail="Wrong password")

    return {
        "token": f"fake-token-{advisor['id']}-{advisor['role']}",
        "role": advisor["role"],
        "email": advisor["email"],
        "programme": advisor.get("programme"),  # None for advisor/admin
    }