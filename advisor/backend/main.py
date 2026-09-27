# main.py — FastAPI app entry point

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from flags import router as flags_router
from lecturer import router as lecturer_router

app = FastAPI(title="Advisor Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(flags_router)
app.include_router(lecturer_router)


@app.get("/")
def root():
    return {"status": "Advisor backend running"}