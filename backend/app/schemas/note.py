from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .user import User
from .tag import Tag

class NoteBase(BaseModel):
    title: str
    content: str
    visibility: str  

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    visibility: Optional[str] = None

class NoteInDBBase(NoteBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Note(NoteInDBBase):
    owner: User
    tags: List[Tag] = []
    shared_with: List[User] = []

class NoteInDB(NoteInDBBase):
    pass 