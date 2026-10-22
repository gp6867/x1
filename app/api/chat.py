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

# =====================================================================
# ===== AI PROVIDERS SETUP =====
# =====================================================================

# ===== GROQ (PRIMARY) =====
groq_client = AsyncOpenAI(
    api_key=os.getenv("GROQ_API_KEY", "").strip(),
    base_url="https://api.groq.com/openai/v1"
)
GROQ_MODEL = "openai/gpt-oss-120b"

# ===== GEMINI (FALLBACK) =====
# Explicit httpx client — Render par httpx2 ke connection errors fix
_gemini_http_client = httpx.AsyncClient(
    timeout=httpx.Timeout(60.0, connect=15.0),
    limits=httpx.Limits(max_keepalive_connections=5, max_connections=10),
)

gemini_client = AsyncOpenAI(
    api_key=os.getenv("GEMINI_API_KEY", "").strip(),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
    http_client=_gemini_http_client,
)
GEMINI_MODEL = "gemini-3.8-flash"  # ✅ Current GA model (2.0-flash deprecated)


# =====================================================================
# ===== HELPERS =====
# =====================================================================

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


def find_chat(db: Session, chat_id, user_id: int):
    """Chat lookup — UUID first, then integer (backward compat)"""
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


def generate_title(message: str) -> str:
    if not message:
        return "New Chat"
    title = message.strip()[:30]
    if len(message) > 30:
        title += "..."
    return title


def extract_content(response) -> str:
    """Null-safe content extraction from OpenAI-compatible response"""
    try:
        if response and response.choices and len(response.choices) > 0:
            choice = response.choices[0]
            if choice and choice.message:
                content = choice.message.content
                if content and isinstance(content, str):
                    return content.strip()
    except Exception as e:
        logging.warning(f"Content extraction error: {e}")
    return ""


def is_rate_limit_error(error: Exception) -> bool:
    """Detect if error is a rate limit (429)"""
    err_str = str(error).lower()
    if "429" in err_str:
        return True
    if "rate limit" in err_str or "rate_limit" in err_str:
        return True
    if "quota" in err_str or "exceeded" in err_str:
        return True
    # OpenAI SDK status check
    status = getattr(error, "status_code", None)
    if status == 429:
        return True
    response = getattr(error, "response", None)
    if response is not None and getattr(response, "status_code", None) == 429:
        return True
    return False


# =====================================================================
# ===== AI RESPONSE WITH AUTOMATIC FALLBACK =====
# =====================================================================
async def get_ai_response(user_message: str) -> tuple:
    """
    Try Groq first. On any failure (including rate limit 429),
    automatically switch to Gemini.
    Returns: (response_text, provider_name)
    """

    # ===== 1. TRY GROQ (PRIMARY) =====
    try:
        logging.info("🔄 Trying Groq (primary)...")
        response = await groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": user_message}],
            max_tokens=500,
            temperature=0.7
        )
        text = extract_content(response)
        if text:
            logging.info("✅ Groq responded successfully")
            return (text, "Groq")
        logging.warning("⚠️ Groq returned empty content — switching to Gemini")
    except Exception as e:
        if is_rate_limit_error(e):
            logging.warning(f"🚫 Groq RATE LIMIT hit — switching to Gemini. Error: {e}")
        else:
            logging.warning(f"⚠️ Groq failed — switching to Gemini. Error: {e}")

    # ===== 2. TRY GEMINI (FALLBACK) =====
    try:
        logging.info("🔄 Trying Gemini (fallback)...")
        response = await gemini_client.chat.completions.create(
            model=GEMINI_MODEL,
            messages=[{"role": "user", "content": user_message}],
            max_tokens=500,
            temperature=0.7
        )
        text = extract_content(response)
        if text:
            logging.info("✅ Gemini responded successfully")
            return (text, "Gemini")
        logging.warning("⚠️ Gemini returned empty content (possibly filtered)")
    except Exception as e:
        if is_rate_limit_error(e):
            logging.error(f"🚫 Gemini RATE LIMIT hit too: {e}")
        else:
            logging.error(f"❌ Gemini failed: {e}")

    # ===== 3. BOTH FAILED =====
    logging.error("❌ Both Groq and Gemini failed")
    return (
        "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        "None"
    )


# =====================================================================
# ===== ENDPOINTS =====
# =====================================================================

# ============= GET CHAT HISTORY =============
@router.get("/history")
async def get_chat_history(request: Request, db: Session = Depends(get_db)):
    try:
        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})

        chats = db.query(Chat).filter(
            Chat.user_id == user.id
        ).order_by(Chat.updated_at.desc()).limit(20).all()

        return JSONResponse(content={
            "success": True,
            "chats": [{"id": str(chat.uuid_id), "title": chat.title} for chat in chats]
        })
    except Exception as e:
        logging.error(f"History error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})


# ============= CREATE NEW CHAT =============
@router.post("/new")
async def create_chat(request: Request, db: Session = Depends(get_db)):
    try:
        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})

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

        return JSONResponse(content={
            "success": True,
            "chat_id": str(new_chat.uuid_id),
            "title": new_chat.title
        })
    except Exception as e:
        logging.error(f"Create chat error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})


# ============= LIKE/DISLIKE FEEDBACK (SAVE) =============
@router.post("/feedback")
async def submit_feedback(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
        chat_id = data.get("chat_id")
        message_index = data.get("message_index")
        feedback = data.get("feedback")

        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})

        if chat_id is None or message_index is None:
            return JSONResponse(status_code=400, content={"success": False, "message": "chat_id and message_index required"})

        try:
            chat_uuid = PyUUID(str(chat_id))
        except (ValueError, AttributeError):
            return JSONResponse(status_code=400, content={"success": False, "message": "Invalid chat_id format"})

        db.query(MessageFeedback).filter(
            MessageFeedback.chat_id == chat_uuid,
            MessageFeedback.message_index == int(message_index),
            MessageFeedback.user_id == user.id
        ).delete()

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
        return JSONResponse(status_code=500, content={"success": False, "message": f"Server error: {str(e)}"})


# ============= LIKE/DISLIKE FEEDBACK (FETCH) =============
@router.get("/feedback/{chat_id}")
async def get_feedback(chat_id: str, request: Request, db: Session = Depends(get_db)):
    try:
        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})

        try:
            chat_uuid = PyUUID(str(chat_id))
        except (ValueError, AttributeError):
            return JSONResponse(status_code=400, content={"success": False, "message": "Invalid chat_id"})

        rows = db.query(MessageFeedback).filter(
            MessageFeedback.chat_id == chat_uuid,
            MessageFeedback.user_id == user.id
        ).all()

        feedback_map = {row.message_index: row.feedback for row in rows}
        return JSONResponse(content={"success": True, "feedback": feedback_map})
    except Exception as e:
        logging.error(f"Get feedback error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})


# ============= SEND MESSAGE (GROQ + GEMINI AUTO-FALLBACK) =============
@router.post("/send")
async def send_message(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
        user_message = data.get("message", "")
        chat_id = data.get("chat_id")

        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})

        if not user_message:
            return JSONResponse(content={"success": True, "message": "Hello!"})

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
        messages.append({"role": "user", "content": user_message})
        chat.messages = messages
        chat.updated_at = datetime.utcnow()
        db.commit()

        # ===== AI RESPONSE WITH AUTO-FALLBACK =====
        ai_response, provider = await get_ai_response(user_message)
        logging.info(f"🤖 Response from: {provider}")

        messages.append({"role": "assistant", "content": ai_response})
        chat.messages = messages
        chat.updated_at = datetime.utcnow()
        db.commit()

        return JSONResponse(content={
            "success": True,
            "message": ai_response,
            "chat_id": str(chat.uuid_id),
            "provider": provider
        })
    except Exception as e:
        logging.error(f"Chat error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})


# ============= TEST: GROQ =============
@router.get("/test-groq")
async def test_groq():
    try:
        if not os.getenv("GROQ_API_KEY", "").strip():
            return JSONResponse(status_code=500, content={"success": False, "provider": "Groq", "error": "GROQ_API_KEY not set"})

        response = await groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": "Say 'Groq working' in 3 words"}],
            max_tokens=20,
            temperature=0.5
        )
        text = extract_content(response)
        return JSONResponse(content={
            "success": True,
            "provider": "Groq",
            "model": GROQ_MODEL,
            "response": text
        })
    except Exception as e:
        logging.error(f"Groq test error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "provider": "Groq", "error": str(e)})


# ============= TEST: GEMINI (DEBUG VERSION) =============
@router.get("/test-gemini")
async def test_gemini():
    try:
        api_key = os.getenv("GEMINI_API_KEY", "").strip()
        if not api_key:
            return JSONResponse(status_code=500, content={"success": False, "provider": "Gemini", "error": "GEMINI_API_KEY not set"})

        logging.info(f"🔍 Gemini Test — key_len={len(api_key)}, prefix={api_key[:10]}..., model={GEMINI_MODEL}")

        response = await gemini_client.chat.completions.create(
            model=GEMINI_MODEL,
            messages=[{"role": "user", "content": "Say 'Gemini working' in 3 words"}],
            max_tokens=20,
            temperature=0.5
        )

        # Raw response log (debug ke liye)
        try:
            raw = response.model_dump()
            logging.info(f"📦 Raw Gemini response: {json.dumps(raw)[:500]}")
        except Exception:
            pass

        text = extract_content(response)
        finish_reason = None
        choices_count = 0
        if response.choices:
            choices_count = len(response.choices)
            finish_reason = getattr(response.choices[0], "finish_reason", None)

        return JSONResponse(content={
            "success": True,
            "provider": "Gemini",
            "model": GEMINI_MODEL,
            "response": text,
            "finish_reason": finish_reason,
            "debug": {
                "choices_count": choices_count,
                "content_is_null": not text
            }
        })
    except Exception as e:
        logging.error(f"Gemini test error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={
            "success": False,
            "provider": "Gemini",
            "error": f"{type(e).__name__}: {str(e)}"
        })


# ============= TEST: BASIC =============
@router.get("/test")
async def test():
    return JSONResponse(content={
        "success": True,
        "message": "Chat API with Groq + Gemini auto-fallback is working"
    })


# ============= GET SINGLE CHAT (CATCH-ALL — LAST) =============
@router.get("/{chat_id}")
async def get_chat(chat_id: str, request: Request, db: Session = Depends(get_db)):
    try:
        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})

        chat = find_chat(db, chat_id, user.id)
        if not chat:
            return JSONResponse(status_code=404, content={"success": False, "message": "Chat not found"})

        return JSONResponse(content={
            "success": True,
            "chat": {
                "id": str(chat.uuid_id),
                "title": chat.title,
                "messages": chat.messages or []
            }
        })
    except Exception as e:
        logging.error(f"Get chat error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})


# ============= DELETE CHAT =============
@router.delete("/{chat_id}")
async def delete_chat(chat_id: str, request: Request, db: Session = Depends(get_db)):
    try:
        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})

        chat = find_chat(db, chat_id, user.id)
        if not chat:
            return JSONResponse(status_code=404, content={"success": False, "message": "Chat not found"})

        db.delete(chat)
        db.commit()
        return JSONResponse(content={"success": True, "message": "Chat deleted"})
    except Exception as e:
        logging.error(f"Delete chat error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})
