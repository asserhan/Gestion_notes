from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.database.models import VisibilityStatus
from .user import User

class NoteBase(BaseModel):
    title: str
    content: str
    visibility: str  # Will be validated against VisibilityStatus enum

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    visibility: Optional[str] = None

class Note(NoteBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    public_token: Optional[str] = None

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None,
            VisibilityStatus: lambda v: v.value
        }

class NoteInDB(Note):
    owner: User
    shared_with: List[User] = []

class NoteShare(BaseModel):
    email: str 