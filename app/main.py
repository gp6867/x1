import sys
import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
import logging
from datetime import datetime
import secrets

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Load environment variables
load_dotenv()

# ============= INITIALIZE FASTAPI APP =============
app = FastAPI(
    title="XONE AI API",
    description="Complete AI Platform with Chat, Images, Video & Payment",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# ============= CORS CONFIGURATION =============
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://xoneai.in",
        "http://xoneai.in",
        "http://127.0.0.1:5173",
        "https://x1-2j5f.onrender.com",
        "https://xoneai.in",  # Production
        "https://www.xoneai.in",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# ============= SESSION MIDDLEWARE (FOR OAUTH) =============
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv('SESSION_SECRET', secrets.token_urlsafe(32)),
    session_cookie="xone_ai_session",
    max_age=3600
)
logger.info("✅ Session middleware configured for OAuth")

# ============= IMPORT ALL ROUTERS =============
# Auth & User
from app.api import auth
from app.api import user
from app.api import payment  # ✅ Payment router

# File Upload
from app.api import upload

# Chat (with streaming)
try:
    from app.api import chat
    HAS_CHAT = True
    logger.info("✅ Chat router loaded")
except Exception as e:
    HAS_CHAT = False
    logger.warning(f"⚠️ Chat router not loaded: {e}")

# AI Images
try:
    from app.api import ai_images
    HAS_AI_IMAGES = True
    logger.info("✅ AI Images router loaded")
except Exception as e:
    HAS_AI_IMAGES = False
    logger.warning(f"⚠️ AI Images router not loaded: {e}")

# AI Characters
try:
    from app.api import ai_characters
    HAS_AI_CHARACTERS = True
    logger.info("✅ AI Characters router loaded")
except Exception as e:
    HAS_AI_CHARACTERS = False
    logger.warning(f"⚠️ AI Characters router not loaded: {e}")

# AI Video
try:
    from app.api import ai_video
    HAS_AI_VIDEO = True
    logger.info("✅ AI Video router loaded")
except Exception as e:
    HAS_AI_VIDEO = False
    logger.warning(f"⚠️ AI Video router not loaded: {e}")

# Brain (AI Processing)
try:
    from app.api import brain
    HAS_BRAIN = True
    logger.info("✅ Brain router loaded")
except Exception as e:
    HAS_BRAIN = False
    logger.warning(f"⚠️ Brain router not loaded: {e}")

# ============= INCLUDE ALL ROUTERS =============
# Authentication & Users
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(user.router, prefix="/api/user", tags=["User"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(payment.router)  # ✅ Payment router

# Chat
if HAS_CHAT:
    app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])

# AI Features
if HAS_AI_IMAGES:
    app.include_router(ai_images.router, prefix="/api/ai/images", tags=["AI Images"])

if HAS_AI_CHARACTERS:
    app.include_router(ai_characters.router, prefix="/api/ai/characters", tags=["AI Characters"])

if HAS_AI_VIDEO:
    app.include_router(ai_video.router, prefix="/api/ai/video", tags=["AI Video"])

# Brain (Advanced AI)
if HAS_BRAIN:
    app.include_router(brain.router, prefix="/api/brain", tags=["Brain"])

# ============= ROOT ENDPOINTS =============
@app.get("/")
async def root():
    """Root endpoint - API Status"""
    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "message": "XONE AI API is running",
            "version": "2.0.0",
            "status": "operational",
            "features": {
                "auth": True,
                "chat": HAS_CHAT,
                "images": HAS_AI_IMAGES,
                "characters": HAS_AI_CHARACTERS,
                "video": HAS_AI_VIDEO,
                "payment": True,
                "brain": HAS_BRAIN
            }
        }
    )

@app.get("/health")
async def health():
    """Health check endpoint"""
    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "services": {
                "database": await check_database(),
                "ollama": await check_ollama()
            }
        }
    )

@app.get("/api/test")
async def test():
    """Test endpoint - List all available endpoints"""
    routes = []
    for route in app.routes:
        if hasattr(route, "methods"):
            routes.append({
                "path": route.path,
                "methods": list(route.methods)
            })
    
    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "message": "API is working",
            "total_routes": len(routes),
            "routes": routes[:30]
        }
    )

# ============= FEATURE-SPECIFIC ENDPOINTS =============
@app.get("/api/features")
async def get_features():
    """Get all available features"""
    return JSONResponse(
        content={
            "success": True,
            "features": {
                "authentication": {
                    "register": "/api/auth/register",
                    "login": "/api/auth/login",
                    "verify": "/api/auth/verify-otp"
                },
                "payment": {
                    "create_order": "/api/payment/create-order",
                    "verify": "/api/payment/verify",
                    "test": "/api/payment/test"
                },
                "chat": {
                    "available": HAS_CHAT,
                    "endpoints": {
                        "send": "/api/chat/send",
                        "history": "/api/chat/history"
                    } if HAS_CHAT else {}
                },
                "ai_images": {
                    "available": HAS_AI_IMAGES,
                    "endpoints": {
                        "generate": "/api/ai/images/generate",
                        "download": "/api/ai/images/download/{filename}"
                    } if HAS_AI_IMAGES else {}
                },
                "ai_video": {
                    "available": HAS_AI_VIDEO,
                    "endpoints": {
                        "generate": "/api/ai/video/generate",
                        "status": "/api/ai/video/status"
                    } if HAS_AI_VIDEO else {}
                }
            }
        }
    )

# ============= DATABASE CHECK =============
async def check_database():
    """Check database connection"""
    try:
        from app.database.db import engine
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            return "connected"
    except:
        return "disconnected"

# ============= OLLAMA CHECK =============
async def check_ollama():
    """Check Ollama connection"""
    try:
        import aiohttp
        async with aiohttp.ClientSession() as session:
            async with session.get("http://localhost:11434/api/tags", timeout=2) as resp:
                if resp.status == 200:
                    return "connected"
                return "error"
    except:
        return "disconnected"

# ============= DATABASE TEST ENDPOINT =============
@app.get("/api/db-test")
async def db_test():
    """Test database connection"""
    try:
        from app.database.db import engine
        from sqlalchemy import text
        
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            return JSONResponse(
                status_code=200,
                content={
                    "success": True,
                    "message": "Database connected",
                    "result": result.scalar()
                }
            )
    except Exception as e:
        logger.error(f"Database error: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": f"Database error: {str(e)}"
            }
        )

# ============= ERROR HANDLERS =============
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "message": "Endpoint not found",
            "path": str(request.url.path)
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f"500 Internal Error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error"
        }
    )

# ============= STARTUP EVENT =============
@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info("=" * 60)
    logger.info("🚀 XONE AI API v2.0 Starting...")
    logger.info("=" * 60)
    
    # Count routes
    route_count = sum(1 for route in app.routes if hasattr(route, "methods"))
    
    # Show loaded features
    features = []
    if HAS_CHAT: features.append("✅ Chat")
    if HAS_AI_IMAGES: features.append("✅ Images")
    if HAS_AI_CHARACTERS: features.append("✅ Characters")
    if HAS_AI_VIDEO: features.append("✅ Video")
    if HAS_BRAIN: features.append("✅ Brain")
    features.append("✅ Payment")
    
    logger.info(f"\n📊 Loaded Features:")
    for feature in features:
        logger.info(f"   {feature}")
    
    logger.info(f"\n📝 Total Routes: {route_count}")
    
    # Check services
    db_status = await check_database()
    ollama_status = await check_ollama()
    
    logger.info(f"\n🔌 Services:")
    logger.info(f"   Database: {db_status}")
    logger.info(f"   Ollama: {ollama_status}")
    
    logger.info("\n" + "=" * 60)
    logger.info("✅ API Ready!")
    logger.info("📍 Base URL: http://localhost:5000")
    logger.info("📚 Docs: http://localhost:5000/api/docs")
    logger.info("=" * 60)

# ============= SHUTDOWN EVENT =============
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🛑 XONE AI API shutting down...")

# ============= DIRECT RUN =============
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
