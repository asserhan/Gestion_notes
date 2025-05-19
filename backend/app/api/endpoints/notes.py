from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_active_user
from app.database.models import User, Note, Tag
from app.schemas.note import NoteCreate, NoteUpdate, Note as NoteSchema

router = APIRouter()

@router.post("/", response_model=NoteSchema)
def create_note(
    *,
    db: Session = Depends(get_db),
    note_in: NoteCreate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create new note.
    """
    note = Note(
        title=note_in.title,
        content=note_in.content,
        visibility=note_in.visibility,
        owner_id=current_user.id
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@router.get("/", response_model=List[NoteSchema])
def read_notes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Retrieve notes.
    """
    notes = db.query(Note).filter(
        (Note.owner_id == current_user.id) | 
        (Note.shared_with.contains(current_user))
    ).offset(skip).limit(limit).all()
    return notes

@router.get("/{note_id}", response_model=NoteSchema)
def read_note(
    *,
    db: Session = Depends(get_db),
    note_id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get note by ID.
    """
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    if note.owner_id != current_user.id and current_user not in note.shared_with:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return note

@router.put("/{note_id}", response_model=NoteSchema)
def update_note(
    *,
    db: Session = Depends(get_db),
    note_id: int,
    note_in: NoteUpdate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update a note.
    """
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    if note.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    for field, value in note_in.dict(exclude_unset=True).items():
        setattr(note, field, value)
    
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@router.delete("/{note_id}", response_model=NoteSchema)
def delete_note(
    *,
    db: Session = Depends(get_db),
    note_id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Delete a note.
    """
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    if note.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(note)
    db.commit()
    return note 