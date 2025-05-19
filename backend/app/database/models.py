from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Table, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum

class VisibilityStatus(enum.Enum):
    PRIVATE = "private"
    SHARED = "shared"
    PUBLIC = "public"


note_shares = Table(
    'note_shares',
    Base.metadata,
    Column('note_id', Integer, ForeignKey('notes.id'), primary_key=True),
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
)

note_tags = Table(
    'note_tags',
    Base.metadata,
    Column('note_id', Integer, ForeignKey('notes.id'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
) 

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
 
    notes = relationship("Note", back_populates="owner")
    shared_notes = relationship("Note", secondary=note_shares, back_populates="shared_with")

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)  # Markdown content
    visibility = Column(Enum(VisibilityStatus), default=VisibilityStatus.PRIVATE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    owner_id = Column(Integer, ForeignKey("users.id"))


    owner = relationship("User", back_populates="notes")
    shared_with = relationship("User", secondary=note_shares, back_populates="shared_notes")
    tags = relationship("Tag", secondary="note_tags", back_populates="notes")

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    notes = relationship("Note", secondary="note_tags", back_populates="tags")

