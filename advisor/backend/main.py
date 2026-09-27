# main.py — FastAPI app entry point

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from flags import router as flags_router

app = FastAPI(title="Advisor Backend")

# Allow React (localhost:5173) to call this API (localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port [citation:3]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth_router)
app.include_router(flags_router)

@app.get("/")
def root():
    return {"status": "Advisor backend running"}