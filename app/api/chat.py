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
from ..brain.memory_manager import build_memory_context, extract_and_save_facts
from ..brain.memory_filter import needs_extraction, needs_context_resolution
from ..brain.memory_store import get_all_facts, delete_fact, delete_all
from ..utils.jwt_handler import verify_token

router = APIRouter()

# =====================================================================
# ===== AI PROVIDERS =====
# =====================================================================

groq_client = AsyncOpenAI(
    api_key=os.getenv("GROQ_API_KEY", "").strip(),
    base_url="https://api.groq.com/openai/v1"
)
GROQ_MODEL = "openai/gpt-oss-120b"

_gemini_http_client = httpx.AsyncClient(
    timeout=httpx.Timeout(60.0, connect=15.0),
    limits=httpx.Limits(max_keepalive_connections=5, max_connections=10),
)
gemini_client = AsyncOpenAI(
    api_key=os.getenv("GEMINI_API_KEY", "").strip(),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
    http_client=_gemini_http_client,
)
GEMINI_MODEL = "gemini-3.8-flash"

# =====================================================================
# ===== MEMORY CONFIG =====
# =====================================================================
MAX_CONTEXT_MESSAGES = 12
MAX_MESSAGE_CHARS = 1500
MAX_TOTAL_CONTEXT_CHARS = 6000

BASE_SYSTEM_PROMPT = (
    "You are MonsterX AI by Xone AI, a helpful and intelligent AI assistant. "
    "You maintain full conversation context and remember facts about the user. "
    "When the user uses pronouns (vo, woh, uska, he, she) or vague references, "
    "resolve them using known facts and recent conversation. Never ask 'which person?' "
    "if the person is already established in known facts. "
    "Reply in the same language the user is using (English, Hindi, or Hinglish)."
)


# =====================================================================
# ===== HELPERS =====
# =====================================================================

async def get_current_user(request: Request, db: Session = Depends(get_db)):
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
        return db.query(User).filter(User.id == user_id).first()
    except Exception as e:
        print(f"❌ Auth error: {e}")
        return None


def find_chat(db: Session, chat_id, user_id: int):
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
        return db.query(Chat).filter(
            Chat.id == int(chat_id),
            Chat.user_id == user_id
        ).first()
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
    err_str = str(error).lower()
    if "429" in err_str or "rate limit" in err_str or "rate_limit" in err_str:
        return True
    if "quota" in err_str or "exceeded" in err_str:
        return True
    status = getattr(error, "status_code", None)
    if status == 429:
        return True
    response = getattr(error, "response", None)
    if response is not None and getattr(response, "status_code", None) == 429:
        return True
    return False


def build_context_messages(messages_history: list, system_prompt: str) -> list:
    """Token-safe context build with dynamic system prompt"""
    context = [{"role": "system", "content": system_prompt}]

    valid = []
    for msg in messages_history:
        if not isinstance(msg, dict):
            continue
        role = msg.get("role")
        content = msg.get("content", "")
        if role in ("user", "assistant") and content and isinstance(content, str):
            valid.append({"role": role, "content": content})

    recent = valid[-MAX_CONTEXT_MESSAGES:]

    total = len(system_prompt)
    for msg in recent:
        content = msg["content"]
        if len(content) > MAX_MESSAGE_CHARS:
            content = content[:MAX_MESSAGE_CHARS] + "...[truncated]"
        if total + len(content) > MAX_TOTAL_CONTEXT_CHARS:
            break
        context.append({"role": msg["role"], "content": content})
        total += len(content)

    logging.info(f"📚 Context: {len(context) - 1} msgs, ~{total} chars")
    return context


async def get_ai_response(messages_history: list, system_prompt: str) -> tuple:
    """Groq primary → Gemini fallback, both receive same context"""
    context = build_context_messages(messages_history, system_prompt)

    # ===== GROQ =====
    try:
        logging.info("🔄 Trying Groq (primary)...")
        response = await groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=context,
            max_tokens=800,
            temperature=0.7
        )
        text = extract_content(response)
        if text:
            logging.info("✅ Groq responded")
            return (text, "Groq")
    except Exception as e:
        if is_rate_limit_error(e):
            logging.warning(f"🚫 Groq RATE LIMIT → Gemini: {e}")
        else:
            logging.warning(f"⚠️ Groq failed → Gemini: {e}")

    # ===== GEMINI =====
    try:
        logging.info("🔄 Trying Gemini (fallback)...")
        response = await gemini_client.chat.completions.create(
            model=GEMINI_MODEL,
            messages=context,
            max_tokens=800,
            temperature=0.7
        )
        text = extract_content(response)
        if text:
            logging.info("✅ Gemini responded")
            return (text, "Gemini")
    except Exception as e:
        logging.error(f"❌ Gemini failed: {e}")

    return ("Sorry, I'm having trouble connecting. Please try again.", "None")


# =====================================================================
# ===== CHAT ENDPOINTS =====
# =====================================================================

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
            "chats": [{"id": str(c.uuid_id), "title": c.title} for c in chats]
        })
    except Exception as e:
        logging.error(f"History error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})


@router.post("/new")
async def create_chat(request: Request, db: Session = Depends(get_db)):
    try:
        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})
        data = await request.json()
        message = data.get("message", "New chat")
        new_chat = Chat(
            user_id=user.id,
            title=generate_title(message),
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
            return JSONResponse(status_code=400, content={"success": False, "message": "Invalid chat_id"})
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
        return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})


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
        return JSONResponse(content={
            "success": True,
            "feedback": {r.message_index: r.feedback for r in rows}
        })
    except Exception as e:
        logging.error(f"Get feedback error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})


# ============= SEND MESSAGE (WITH MEMORY) =============
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
            chat = Chat(
                user_id=user.id,
                title=generate_title(user_message),
                messages=[],
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.add(chat)
            db.commit()
            db.refresh(chat)

        messages = chat.messages or []

        # ===== MEMORY EXTRACTION (before response) =====
        try:
            recent = messages[-5:] if messages else []
            should_extract = needs_extraction(user_message)
            should_resolve = needs_context_resolution(user_message)

            if should_extract or should_resolve:
                logging.info(f"🧠 Memory extraction triggered (extract={should_extract}, resolve={should_resolve})")
                # Gemini primary for extraction (saves Groq quota), Groq fallback
                await extract_and_save_facts(
                    db=db,
                    user_id=user.id,
                    user_message=user_message,
                    recent_context=recent,
                    primary_client=gemini_client,
                    primary_model=GEMINI_MODEL,
                    fallback_client=groq_client,
                    fallback_model=GROQ_MODEL,
                )
        except Exception as e:
            logging.warning(f"Memory extraction skipped: {e}")

        # ===== BUILD SYSTEM PROMPT WITH MEMORY =====
        memory_ctx = build_memory_context(db, user.id)
        system_prompt = BASE_SYSTEM_PROMPT
        if memory_ctx:
            system_prompt = BASE_SYSTEM_PROMPT + "\n\n" + memory_ctx

        # ===== SAVE USER MESSAGE =====
        messages.append({"role": "user", "content": user_message})
        chat.messages = messages
        chat.updated_at = datetime.utcnow()
        db.commit()

        # ===== GET AI RESPONSE =====
        ai_response, provider = await get_ai_response(messages, system_prompt)
        logging.info(f"🤖 Response from: {provider}")

        # ===== SAVE ASSISTANT MESSAGE =====
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
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})


# =====================================================================
# ===== MEMORY MANAGEMENT ENDPOINTS =====
# =====================================================================

@router.get("/memory")
async def get_memory(request: Request, db: Session = Depends(get_db)):
    """User ki saari saved memory dekhne ke liye"""
    try:
        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})
        facts = get_all_facts(db, user.id)
        return JSONResponse(content={
            "success": True,
            "count": len(facts),
            "facts": [
                {
                    "category": f.category,
                    "key": f.mem_key,
                    "value": f.mem_value,
                    "context": f.context,
                    "updated_at": f.updated_at.isoformat() if f.updated_at else None
                }
                for f in facts
            ]
        })
    except Exception as e:
        logging.error(f"Get memory error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})


@router.delete("/memory/{key}")
async def remove_memory_key(key: str, request: Request, db: Session = Depends(get_db)):
    """Ek specific fact delete"""
    try:
        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})
        count = delete_fact(db, user.id, key)
        return JSONResponse(content={"success": True, "deleted": count})
    except Exception as e:
        logging.error(f"Delete memory error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})


@router.delete("/memory")
async def clear_memory(request: Request, db: Session = Depends(get_db)):
    """Poori memory clear (forget me)"""
    try:
        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})
        count = delete_all(db, user.id)
        return JSONResponse(content={"success": True, "deleted": count})
    except Exception as e:
        logging.error(f"Clear memory error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})


# =====================================================================
# ===== TEST ENDPOINTS =====
# =====================================================================

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
        return JSONResponse(content={"success": True, "provider": "Groq", "response": extract_content(response)})
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "provider": "Groq", "error": str(e)})


@router.get("/test-gemini")
async def test_gemini():
    try:
        if not os.getenv("GEMINI_API_KEY", "").strip():
            return JSONResponse(status_code=500, content={"success": False, "provider": "Gemini", "error": "GEMINI_API_KEY not set"})
        response = await gemini_client.chat.completions.create(
            model=GEMINI_MODEL,
            messages=[{"role": "user", "content": "Say 'Gemini working' in 3 words"}],
            max_tokens=20,
            temperature=0.5
        )
        return JSONResponse(content={"success": True, "provider": "Gemini", "response": extract_content(response)})
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "provider": "Gemini", "error": str(e)})


@router.get("/test")
async def test():
    return JSONResponse(content={
        "success": True,
        "message": "Chat API with Groq + Gemini + Advanced Memory is working"
    })


# =====================================================================
# ===== CATCH-ALL ROUTES (LAST) =====
# =====================================================================

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
