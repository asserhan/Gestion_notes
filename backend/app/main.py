from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.database.session import engine
from app.database.models import Base


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Notes API",
    description="API for collaborative notes management",

)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to Notes API"} 