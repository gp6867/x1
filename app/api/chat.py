from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import aiohttp
import logging
import json
import os
from openai import AsyncOpenAI

from ..database.db import get_db
from ..models.user import User
from ..models.chat import Chat
from ..models.message_feedback import MessageFeedback
from ..utils.jwt_handler import verify_token

router = APIRouter()

# ===== GROQ SETUP =====
client = AsyncOpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)
MODEL_NAME = "openai/gpt-oss-120b"

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
    Isse purane links /chat/29 bhi kaam karenge, naye /chat/<uuid> bhi.
    """
    if not chat_id:
        return None

    # Try UUID first
    try:
        chat = db.query(Chat).filter(
            Chat.uuid_id == str(chat_id),
            Chat.user_id == user_id
        ).first()
        if chat:
            return chat
    except Exception:
        pass

    # Fallback to integer ID
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
# ⚠️ IMPORTANT: Ye route /{chat_id} se PEHLE hona chahiye
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
        feedback = data.get("feedback")  # 'like' | 'dislike' | None

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

        # Purana feedback delete (toggle ke liye)
        db.query(MessageFeedback).filter(
            MessageFeedback.chat_id == str(chat_id),
            MessageFeedback.message_index == int(message_index),
            MessageFeedback.user_id == user.id
        ).delete()

        # Naya feedback add (agar valid hai)
        if feedback in ("like", "dislike"):
            db.add(MessageFeedback(
                chat_id=str(chat_id),
                message_index=int(message_index),
                user_id=user.id,
                feedback=feedback
            ))

        db.commit()
        return JSONResponse(content={"success": True, "feedback": feedback})

    except Exception as e:
        logging.error(f"Feedback error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Server error"}
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

        rows = db.query(MessageFeedback).filter(
            MessageFeedback.chat_id == str(chat_id),
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

# ============= SEND MESSAGE (GROQ) =============
@router.post("/send")
async def send_message(
    request: Request,
    db: Session = Depends(get_db)
):
    """Send message - GROQ API"""
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
        
        # ===== GROQ API CALL =====
        try:
            response = await client.chat.completions.create(
                model=MODEL_NAME,
                messages=[{"role": "user", "content": user_message}],
                max_tokens=500,
                temperature=0.7
            )
            ai_response = response.choices[0].message.content
        except Exception as e:
            logging.error(f"Groq API error: {e}")
            ai_response = "Sorry, I'm having trouble connecting. Please try again."
        
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
                "chat_id": str(chat.uuid_id)
            }
        )
                
    except Exception as e:
        logging.error(f"Chat error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Server error"}
        )

# ============= TEST ENDPOINT =============
# ⚠️ /{chat_id} se PEHLE hona chahiye
@router.get("/test")
async def test():
    return JSONResponse(
        content={"success": True, "message": "Chat API with Groq is working"}
    )

# ============= GET SINGLE CHAT =============
# ⚠️ CATCH-ALL — ise LAST mein rakhein (specific routes pehle match ho)
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
