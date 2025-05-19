from fastapi import FastAPI
from app.api.router import api_router
from app.database.session import engine
from app.database.models import Base
from app.core.middleware import setup_middleware


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Notes API",
    description="A secure API for managing notes",
)

setup_middleware(app)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Notes API"} 