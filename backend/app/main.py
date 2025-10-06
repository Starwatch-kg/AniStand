from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn

from app.config import settings
from app.database import create_tables
from app.api.routes import anime, episodes, users, auth, comments


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting AniStand API...")
    await create_tables()
    print("✅ Database tables created")
    yield
    # Shutdown
    print("🛑 Shutting down AniStand API...")


# Создание FastAPI приложения
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="API для платформы просмотра аниме AniStand",
    lifespan=lifespan
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# Обработчик исключений
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status_code": exc.status_code}
    )


# Главный роут
@app.get("/")
async def root():
    return {
        "message": "Welcome to AniStand API",
        "version": settings.VERSION,
        "docs": "/docs"
    }


# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "anistand-api"}


# Подключение роутеров
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(anime.router, prefix="/api/v1/anime", tags=["Anime"])
app.include_router(episodes.router, prefix="/api/v1/episodes", tags=["Episodes"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(comments.router, prefix="/api/v1/comments", tags=["Comments"])


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )
