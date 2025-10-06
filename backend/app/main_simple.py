from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AniStand API",
    description="Anime streaming platform API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AniStand API is running! 🎌"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "AniStand API is operational",
        "version": "1.0.0"
    }

# Basic anime endpoints for frontend testing
@app.get("/api/v1/anime/")
async def get_anime_list():
    # Mock data for testing
    return {
        "data": [
            {
                "id": 1,
                "title_romaji": "Attack on Titan",
                "title_english": "Attack on Titan",
                "cover_image": "https://via.placeholder.com/300x400",
                "rating": 9.0,
                "episodes": 25,
                "status": "FINISHED",
                "genres": ["Action", "Drama", "Fantasy"]
            },
            {
                "id": 2,
                "title_romaji": "Demon Slayer",
                "title_english": "Demon Slayer",
                "cover_image": "https://via.placeholder.com/300x400",
                "rating": 8.7,
                "episodes": 26,
                "status": "FINISHED",
                "genres": ["Action", "Supernatural"]
            }
        ],
        "total": 2,
        "page": 1,
        "pages": 1
    }

@app.get("/api/v1/anime/{anime_id}")
async def get_anime_detail(anime_id: int):
    # Mock data for testing
    return {
        "id": anime_id,
        "title_romaji": "Attack on Titan",
        "title_english": "Attack on Titan",
        "description": "Humanity fights for survival against giant humanoid Titans.",
        "cover_image": "https://via.placeholder.com/300x400",
        "banner_image": "https://via.placeholder.com/800x300",
        "rating": 9.0,
        "episodes": 25,
        "status": "FINISHED",
        "genres": ["Action", "Drama", "Fantasy"],
        "year": 2013
    }

@app.get("/api/v1/anime/genres")
async def get_genres():
    return [
        {"id": 1, "name": "Action"},
        {"id": 2, "name": "Adventure"},
        {"id": 3, "name": "Comedy"},
        {"id": 4, "name": "Drama"},
        {"id": 5, "name": "Fantasy"},
        {"id": 6, "name": "Romance"},
        {"id": 7, "name": "Supernatural"}
    ]

@app.post("/api/v1/auth/login")
async def login():
    return {
        "access_token": "mock_token",
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
