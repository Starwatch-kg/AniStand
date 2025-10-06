"""
Расширенная версия FastAPI приложения с парсерами и продвинутыми API
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Import API routers
from app.api.v1.anime import router as anime_router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AniStand API Advanced",
    description="Anime streaming platform API with parsers and advanced features",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(anime_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "AniStand API Advanced is running! 🎌",
        "version": "2.0.0",
        "features": [
            "AniList integration",
            "Advanced anime search",
            "Parser system",
            "Real anime data"
        ]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "AniStand Advanced API is operational",
        "version": "2.0.0",
        "parsers": {
            "anilist": "active",
            "animepahe": "development",
            "gogoanime": "development"
        }
    }

# Basic auth endpoints for compatibility
@app.post("/api/v1/auth/login")
async def login():
    return {
        "access_token": "mock_token_advanced",
        "token_type": "bearer",
        "user": {
            "id": 1,
            "username": "testuser",
            "email": "test@example.com"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
