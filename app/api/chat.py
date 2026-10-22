from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from uuid import UUID as PyUUID
import aiohttp
import logging
import json
import os
import httpx
from openai import AsyncOpenAI

from ..database.db import get_db
from ..models.user import User
from ..models.chat import Chat
from ..models.message_feedback import MessageFeedback
from ..utils.jwt_handler import verify_token

router = APIRouter()

# ===== GROQ SETUP (PRIMARY) =====
groq_client = AsyncOpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)
GROQ_MODEL = "openai/gpt-oss-120b"

# ===== GEMINI SETUP (FALLBACK) — WITH EXPLICIT HTTPX CLIENT =====
# Render par httpx2 ke saath connection error fix
_gemini_http_client = httpx.AsyncClient(
    timeout=httpx.Timeout(60.0, connect=15.0),
    limits=httpx.Limits(max_keepalive_connections=5, max_connections=10),
)

gemini_client = AsyncOpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
    http_client=_gemini_http_client,
)
GEMINI_MODEL = "gemini-2.0-flash"

# ============= HELPER: Get Current User =============
async def get_current_user(request: Request, db: Session = Depends(get_db)):
    """Extract user from JWT token"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    try:
        token = auth_header.replace("Bearer ", "")
        payload = verify_token(token)
        if not payload:
            return None
        user_id = payload.get("id")
        if not user_id:
            return None
        user = db.query(User).filter(User.id == user_id).first()
        return user
    except Exception as e:
        print(f"❌ Auth error: {e}")
        return None

# ============= HELPER: Find chat by UUID OR integer ID =============
def find_chat(db: Session, chat_id, user_id: int):
    """
    Chat lookup — pehle UUID try karega, phir integer (backward compat).
    """
    if not chat_id:
        return None

    try:
        chat = db.query(Chat).filter(
            Chat.uuid_id == str(chat_id),
            Chat.user_id == user_id
        ).first()
        if chat:
            return chat
    except Exception:
        pass

    try:
        chat = db.query(Chat).filter(
            Chat.id == int(chat_id),
            Chat.user_id == user_id
        ).first()
        return chat
    except (ValueError, TypeError):
        return None

# ============= GENERATE TITLE =============
def generate_title(message: str) -> str:
    if not message:
        return "New Chat"
    title = message.strip()[:30]
    if len(message) > 30:
        title += "..."
    return title

# ============= AI HELPER: Get response with fallback =============
async def get_ai_response(user_message: str) -> tuple:
    """
    Try Groq first, fallback to Gemini.
    Returns: (response_text, provider_name)
    """
    # ===== TRY GROQ (PRIMARY) =====
    try:
        logging.info("🔄 Trying Groq (primary)...")
        response = await groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": user_message}],
            max_tokens=500,
            temperature=0.7
        )
        text = response.choices[0].message.content
        if text:
            logging.info("✅ Groq responded successfully")
            return (text, "Groq")
    except Exception as e:
        logging.warning(f"⚠️ Groq failed: {e}")

    # ===== TRY GEMINI (FALLBACK) =====
    try:
        logging.info("🔄 Trying Gemini (fallback)...")
        response = await gemini_client.chat.completions.create(
            model=GEMINI_MODEL,
            messages=[{"role": "user", "content": user_message}],
            max_tokens=500,
            temperature=0.7
        )
        text = response.choices[0].message.content
        if text:
            logging.info("✅ Gemini responded successfully")
            return (text, "Gemini")
    except Exception as e:
        logging.error(f"❌ Gemini failed: {e}")

    # ===== BOTH FAILED =====
    logging.error("❌ Both Groq and Gemini failed")
    return ("Sorry, I'm having trouble connecting right now. Please try again in a moment.", "None")

# ============= GET CHAT HISTORY =============
@router.get("/history")
async def get_chat_history(
    request: Request, 
    db: Session = Depends(get_db)
):
    """Get user's chat history"""
    try:
        user = await get_current_user(request, db)
        
        if not user:
            return JSONResponse(
                status_code=401,
                content={"success": False, "message": "Not authenticated"}
            )
        
        chats = db.query(Chat).filter(
            Chat.user_id == user.id
        ).order_by(Chat.updated_at.desc()).limit(20).all()
        
        return JSONResponse(
            content={
                "success": True,
                "chats": [{
                    "id": str(chat.uuid_id),
                    "title": chat.title
                } for chat in chats]
            }
        )
    except Exception as e:
        logging.error(f"History error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Server error"}
        )

# ============= CREATE NEW CHAT =============
@router.post("/new")
async def create_chat(
    request: Request,
    db: Session = Depends(get_db)
):
    """Create new chat"""
    try:
        user = await get_current_user(request, db)
        
        if not user:
            return JSONResponse(
                status_code=401,
                content={"success": False, "message": "Not authenticated"}
            )
        
        data = await request.json()
        message = data.get("message", "New chat")
        title = generate_title(message)
        
        new_chat = Chat(
            user_id=user.id,
            title=title,
            messages=[],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(new_chat)
        db.commit()
        db.refresh(new_chat)
        
        return JSONResponse(
            content={
                "success": True,
                "chat_id": str(new_chat.uuid_id),
                "title": new_chat.title
            }
        )
    except Exception as e:
        logging.error(f"Create chat error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Server error"}
        )

# ============= LIKE/DISLIKE FEEDBACK (SAVE) =============
@router.post("/feedback")
async def submit_feedback(
    request: Request,
    db: Session = Depends(get_db)
):
    """Save or update user's like/dislike for a message"""
    try:
        data = await request.json()
        chat_id = data.get("chat_id")
        message_index = data.get("message_index")
        feedback = data.get("feedback")

        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(
                status_code=401,
                content={"success": False, "message": "Not authenticated"}
            )

        if chat_id is None or message_index is None:
            return JSONResponse(
                status_code=400,
                content={"success": False, "message": "chat_id and message_index required"}
            )

        # UUID conversion
        try:
            chat_uuid = PyUUID(str(chat_id))
        except (ValueError, AttributeError):
            return JSONResponse(
                status_code=400,
                content={"success": False, "message": "Invalid chat_id format"}
            )

        # Purana feedback delete
        db.query(MessageFeedback).filter(
            MessageFeedback.chat_id == chat_uuid,
            MessageFeedback.message_index == int(message_index),
            MessageFeedback.user_id == user.id
        ).delete()

        # Naya feedback add
        if feedback in ("like", "dislike"):
            db.add(MessageFeedback(
                chat_id=chat_uuid,
                message_index=int(message_index),
                user_id=user.id,
                feedback=feedback
            ))

        db.commit()
        return JSONResponse(content={"success": True, "feedback": feedback})

    except Exception as e:
        logging.error(f"Feedback error: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Server error: {str(e)}"}
        )

# ============= LIKE/DISLIKE FEEDBACK (FETCH) =============
@router.get("/feedback/{chat_id}")
async def get_feedback(
    chat_id: str,
    request: Request,
    db: Session = Depends(get_db)
):
    """Get current user's feedback for all messages in a chat"""
    try:
        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(
                status_code=401,
                content={"success": False, "message": "Not authenticated"}
            )

        try:
            chat_uuid = PyUUID(str(chat_id))
        except (ValueError, AttributeError):
            return JSONResponse(
                status_code=400,
                content={"success": False, "message": "Invalid chat_id"}
            )

        rows = db.query(MessageFeedback).filter(
            MessageFeedback.chat_id == chat_uuid,
            MessageFeedback.user_id == user.id
        ).all()

        feedback_map = {row.message_index: row.feedback for row in rows}

        return JSONResponse(content={
            "success": True,
            "feedback": feedback_map
        })

    except Exception as e:
        logging.error(f"Get feedback error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Server error"}
        )

# ============= SEND MESSAGE (GROQ + GEMINI FALLBACK) =============
@router.post("/send")
async def send_message(
    request: Request,
    db: Session = Depends(get_db)
):
    """Send message - Groq primary, Gemini fallback"""
    try:
        data = await request.json()
        user_message = data.get("message", "")
        chat_id = data.get("chat_id")
        
        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(
                status_code=401,
                content={"success": False, "message": "Not authenticated"}
            )
        
        if not user_message:
            return JSONResponse(
                content={"success": True, "message": "Hello!"}
            )
        
        chat = find_chat(db, chat_id, user.id) if chat_id else None
        
        if not chat:
            title = generate_title(user_message)
            chat = Chat(
                user_id=user.id,
                title=title,
                messages=[],
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.add(chat)
            db.commit()
            db.refresh(chat)
        
        messages = chat.messages or []
        messages.append({
            "role": "user",
            "content": user_message
        })
        chat.messages = messages
        chat.updated_at = datetime.utcnow()
        db.commit()
        
        # ===== GET AI RESPONSE (with fallback) =====
        ai_response, provider = await get_ai_response(user_message)
        logging.info(f"🤖 Response from: {provider}")
        
        messages.append({
            "role": "assistant",
            "content": ai_response
        })
        chat.messages = messages
        chat.updated_at = datetime.utcnow()
        db.commit()
        
        return JSONResponse(
            content={
                "success": True,
                "message": ai_response,
                "chat_id": str(chat.uuid_id),
                "provider": provider
            }
        )
                
    except Exception as e:
        logging.error(f"Chat error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Server error"}
        )

# ============= TEST: GROQ =============
@router.get("/test-groq")
async def test_groq():
    """Test Groq API key"""
    try:
        if not os.getenv("GROQ_API_KEY"):
            return JSONResponse(
                status_code=500,
                content={"success": False, "provider": "Groq", "error": "GROQ_API_KEY not set"}
            )
        
        response = await groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": "Say 'Groq working' in 3 words"}],
            max_tokens=20,
            temperature=0.5
        )
        return JSONResponse(content={
            "success": True,
            "provider": "Groq",
            "model": GROQ_MODEL,
            "response": response.choices[0].message.content
        })
    except Exception as e:
        logging.error(f"Groq test error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "provider": "Groq", "error": str(e)}
        )

# ============= TEST: GEMINI =============
@router.get("/test-gemini")
async def test_gemini():
    """Test Gemini API key with detailed error reporting"""
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return JSONResponse(
                status_code=500,
                content={"success": False, "provider": "Gemini", "error": "GEMINI_API_KEY not set in environment"}
            )
        
        logging.info(f"Testing Gemini — key length: {len(api_key)}, prefix: {api_key[:8]}...")
        
        response = await gemini_client.chat.completions.create(
            model=GEMINI_MODEL,
            messages=[{"role": "user", "content": "Say 'Gemini working' in 3 words"}],
            max_tokens=20,
            temperature=0.5
        )
        return JSONResponse(content={
            "success": True,
            "provider": "Gemini",
            "model": GEMINI_MODEL,
            "response": response.choices[0].message.content
        })
    except Exception as e:
        logging.error(f"Gemini test error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "provider": "Gemini",
                "error": f"{type(e).__name__}: {str(e)}"
            }
        )

# ============= TEST: BASIC =============
@router.get("/test")
async def test():
    return JSONResponse(
        content={"success": True, "message": "Chat API with Groq + Gemini fallback is working"}
    )

# ============= GET SINGLE CHAT (CATCH-ALL — LAST) =============
@router.get("/{chat_id}")
async def get_chat(
    chat_id: str,
    request: Request,
    db: Session = Depends(get_db)
):
    """Get specific chat by UUID or integer ID"""
    try:
        user = await get_current_user(request, db)
        
        if not user:
            return JSONResponse(
                status_code=401,
                content={"success": False, "message": "Not authenticated"}
            )
        
        chat = find_chat(db, chat_id, user.id)
        
        if not chat:
            return JSONResponse(
                status_code=404,
                content={"success": False, "message": "Chat not found"}
            )
        
        return JSONResponse(
            content={
                "success": True,
                "chat": {
                    "id": str(chat.uuid_id),
                    "title": chat.title,
                    "messages": chat.messages or []
                }
            }
        )
    except Exception as e:
        logging.error(f"Get chat error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Server error"}
        )

# ============= DELETE CHAT =============
@router.delete("/{chat_id}")
async def delete_chat(
    chat_id: str,
    request: Request,
    db: Session = Depends(get_db)
):
    """Delete chat"""
    try:
        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(
                status_code=401,
                content={"success": False, "message": "Not authenticated"}
            )
        
        chat = find_chat(db, chat_id, user.id)
        
        if not chat:
            return JSONResponse(
                status_code=404,
                content={"success": False, "message": "Chat not found"}
            )
        
        db.delete(chat)
        db.commit()
        
        return JSONResponse(
            content={"success": True, "message": "Chat deleted"}
        )
    except Exception as e:
        logging.error(f"Delete chat error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Server error"}
        )
