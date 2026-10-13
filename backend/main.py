from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse

from api.v1 import router as api_v1_router
from core.config import get_settings

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router)


@app.get("/api/health", tags=["health"])
async def health_check():
    return {"status": "ok", "version": "0.1.0"}


def _redact(message: str) -> str:
    """Strip the database password from a driver error message."""
    password = settings.DATABASE_URL.split("://", 1)[-1]
    password = password.split("@")[0].split(":", 1)[-1]
    if password:
        message = message.replace(password, "***")
        import urllib.parse

        message = message.replace(urllib.parse.unquote(password), "***")
    return message


@app.get("/api/health/db", tags=["health"])
async def health_db():
    """Reports whether the API can reach PostgreSQL. Never returns credentials."""
    from sqlalchemy import text

    from core.database import AsyncSessionLocal

    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
    except Exception as exc:  # noqa: BLE001 - this endpoint exists to report it
        return JSONResponse(
            status_code=503,
            content={
                "database": "unreachable",
                "error": type(exc).__name__,
                "detail": _redact(str(exc))[:300],
            },
        )
    return {"database": "ok"}
