from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.database.models import Base, User, Note, Tag, VisibilityStatus
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
import time

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def test_create_user():
    try:
        timestamp = int(time.time())
        test_user = User(
            email=f"test{timestamp}@example.com",
            hashed_password=pwd_context.hash("testpassword123")
        )
        db.add(test_user)
        db.commit()
        print("User created successfully")
        return test_user
    except Exception as e:
        db.rollback()
        print(f"Error creating user: {str(e)}")
        return None

def test_create_note(user):
    try:
        test_note = Note(
            title="Test Note",
            content="# This is a test note",
            visibility=VisibilityStatus.PRIVATE,
            owner_id=user.id
        )
        db.add(test_note)
        db.commit()
        print("Note created successfully")
        return test_note
    except Exception as e:
        db.rollback()
        print(f"Error creating note: {str(e)}")
        return None

def test_create_tag():
    try:
        test_tag = Tag(name="test1")
        db.add(test_tag)
        db.commit()
        print("Tag created successfully")
        return test_tag
    except Exception as e:
        db.rollback()
        print(f"Error creating tag: {str(e)}")
        return None

def test_share_note(note, user):
    try:
        note.shared_with.append(user)
        db.commit()
        print("Note shared successfully")
    except Exception as e:
        db.rollback()
        print(f"Error sharing note: {str(e)}")

def test_add_tag_to_note(note, tag):
    try:
        note.tags.append(tag)
        db.commit()
        print("Tag added to note successfully")
    except Exception as e:
        db.rollback()
        print(f"Error adding tag to note: {str(e)}")

def run_tests():
    user = test_create_user()
    if not user:
        return
    note = test_create_note(user)
    if not note:
        return
    tag = test_create_tag()
    if not tag:
        return
    test_share_note(note, user)
    test_add_tag_to_note(note, tag)
    
    print("\nTest Results:")
    print("\nUsers:")
    users = db.query(User).all()
    for u in users:
        print(f"- {u.email}")
    
    print("\nNotes:")
    notes = db.query(Note).all()
    for n in notes:
        print(f"- {n.title} (Owner: {n.owner.email})")
        print(f"  Tags: {[tag.name for tag in n.tags]}")
        print(f"  Shared with: {[user.email for user in n.shared_with]}")
    
    print("\nTags:")
    tags = db.query(Tag).all()
    for t in tags:
        print(f"- {t.name}")

if __name__ == "__main__":
    run_tests()
    db.close() 