from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging
from datetime import datetime, UTC

from app.core.deps import get_db, get_current_active_user
from app.database.models import User, Note, VisibilityStatus
from app.schemas.note import NoteCreate, NoteUpdate, Note as NoteSchema


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=NoteSchema)
def create_note(
    *,
    db: Session = Depends(get_db),
    note_in: NoteCreate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    try:
        logger.info(f"Creating note with data: {note_in.dict()}")
        logger.info(f"Current user ID: {current_user.id}")
        
        visibility = VisibilityStatus(note_in.visibility)
        
        note = Note(
            title=note_in.title,
            content=note_in.content,
            visibility=visibility,
            owner_id=current_user.id,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC)
        )
        
        db.add(note)
        db.commit()
        db.refresh(note)
        
        logger.info(f"Note created with ID: {note.id}, Owner ID: {note.owner_id}")
        
        # Convert visibility back from enum to string for response
        note_dict = {
            **note.__dict__,
            'visibility': note.visibility.value
        }
        
        logger.info(f"Note created successfully with ID: {note.id}")
        return note_dict
        
    except ValueError as e:
        logger.error(f"Invalid visibility value: {note_in.visibility}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid visibility value. Must be one of: {[v.value for v in VisibilityStatus]}"
        )
    except Exception as e:
        logger.error(f"Error creating note: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating note: {str(e)}"
        )

@router.get("/", response_model=List[NoteSchema])
def read_notes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100
) -> Any:
    try:
        logger.info(f"Reading notes for user ID: {current_user.id}")
        all_notes = db.query(Note).all()
        logger.info(f"Total notes in database: {len(all_notes)}")
        notes = db.query(Note).filter(Note.owner_id == current_user.id).all()
        logger.info(f"Notes found for user: {len(notes)}")
        for note in notes:
            logger.info(f"Note ID: {note.id}, Title: {note.title}, Owner ID: {note.owner_id}")
        notes_list = []
        for note in notes:
            note_dict = {
                **note.__dict__,
                'visibility': note.visibility.value
            }
            notes_list.append(note_dict) 
        return notes_list
    except Exception as e:
        logger.error(f"Error retrieving notes: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving notes: {str(e)}"
        )

@router.get("/{note_id}", response_model=NoteSchema)
def read_note(
    *,
    db: Session = Depends(get_db),
    note_id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
   
    try:
        note = db.query(Note).filter(Note.id == note_id).first()
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")
        if note.owner_id != current_user.id and current_user not in note.shared_with:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        return note
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving note: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving note: {str(e)}"
        )

@router.put("/{note_id}", response_model=NoteSchema)
def update_note(
    *,
    db: Session = Depends(get_db),
    note_id: int,
    note_in: NoteUpdate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    try:
        note = db.query(Note).filter(Note.id == note_id).first()
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")
        if note.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        
        update_data = note_in.dict(exclude_unset=True)
        if "visibility" in update_data:
            update_data["visibility"] = VisibilityStatus(update_data["visibility"])
        
        for field, value in update_data.items():
            setattr(note, field, value)
        
        db.add(note)
        db.commit()
        db.refresh(note)
        return note
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid visibility value. Must be one of: {[v.value for v in VisibilityStatus]}"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating note: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating note: {str(e)}"
        )

@router.delete("/{note_id}", response_model=NoteSchema)
def delete_note(
    *,
    db: Session = Depends(get_db),
    note_id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    try:
        note = db.query(Note).filter(Note.id == note_id).first()
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")
        if note.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        
        db.delete(note)
        db.commit()
        return note
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting note: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting note: {str(e)}"
        ) 