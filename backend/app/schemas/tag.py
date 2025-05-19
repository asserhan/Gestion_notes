from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class TagInDBBase(TagBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Tag(TagInDBBase):
    pass

class TagInDB(TagInDBBase):
    pass 