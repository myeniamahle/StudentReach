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
    Return a fake token + role if valid.
    The frontend will save this token in localStorage.
    """
    # Find the advisor by email
    advisor = next((a for a in ADVISORS if a["email"] == data.email), None)

    if not advisor:
        raise HTTPException(status_code=401, detail="Email not found")

    if advisor["password"] != data.password:
        raise HTTPException(status_code=401, detail="Wrong password")

    # Return token (fake for demo — real JWT comes later)
    return {
        "token": f"fake-token-{advisor['id']}-{advisor['role']}",
        "role": advisor["role"],
        "email": advisor["email"]
    }