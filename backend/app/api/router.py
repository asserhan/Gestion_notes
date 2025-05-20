from fastapi import APIRouter
from app.api.endpoints import auth, notes

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(notes.router, prefix="/notes", tags=["notes"])
