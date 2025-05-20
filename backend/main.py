from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import engine
from app.database.models import Base
from app.api.endpoints import auth, notes

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(notes.router, prefix="/api/notes", tags=["notes"])

@app.get("/")
async def root():
    return {"message": "Welcome to Notes API"} 