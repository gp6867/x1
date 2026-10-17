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
from ..utils.jwt_handler import verify_token

router = APIRouter()

# ===== PURANA OLLAMA SETUP (COMMENTED) =====
# OLLAMA_URL = "http://localhost:11434/api/generate"
# MODEL_NAME = "deepseek-r1:7b"

# ===== NAYA GROQ SETUP =====
client = AsyncOpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)
MODEL_NAME = "openai/gpt-oss-120b"

# ============= HELPER: Get Current User =============
async def get_current_user(request: Request, db: Session = Depends(get_db)):
    """Extract user from JWT token"""
    auth_header = request.headers.get("Authorization")
    print(f"🔍 Auth header: {auth_header}")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        print("❌ No valid auth header")
        return None
    
    try:
        token = auth_header.replace("Bearer ", "")
        print(f"🔑 Token: {token[:20]}...")
        
        payload = verify_token(token)
        print(f"📦 Payload: {payload}")
        
        if not payload:
            print("❌ Invalid token")
            return None
        
        user_id = payload.get("id")
        if not user_id:
            print("❌ No user id in token")
            return None
        
        user = db.query(User).filter(User.id == user_id).first()
        print(f"👤 User found: {user.id if user else 'None'}")
        
        return user
    except Exception as e:
        print(f"❌ Error: {e}")
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
        print("\n📋 ===== HISTORY =====")
        user = await get_current_user(request, db)
        
        if not user:
            print("❌ Not authenticated")
            return JSONResponse(
                status_code=401,
                content={"success": False, "message": "Not authenticated"}
            )
        
        chats = db.query(Chat).filter(
            Chat.user_id == user.id
        ).order_by(Chat.updated_at.desc()).limit(20).all()
        
        print(f"✅ Found {len(chats)} chats")
        
        return JSONResponse(
            content={
                "success": True,
                "chats": [{
                    "id": chat.id,
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
        print("\n🆕 ===== NEW CHAT =====")
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
                "chat_id": new_chat.id,
                "title": new_chat.title
            }
        )
    except Exception as e:
        logging.error(f"Create chat error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Server error"}
        )

# ============= GET SINGLE CHAT =============
@router.get("/{chat_id}")
async def get_chat(
    chat_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    """Get specific chat"""
    try:
        print(f"\n📖 ===== GET CHAT {chat_id} =====")
        user = await get_current_user(request, db)
        
        if not user:
            return JSONResponse(
                status_code=401,
                content={"success": False, "message": "Not authenticated"}
            )
        
        chat = db.query(Chat).filter(
            Chat.id == chat_id,
            Chat.user_id == user.id
        ).first()
        
        if not chat:
            return JSONResponse(
                status_code=404,
                content={"success": False, "message": "Chat not found"}
            )
        
        return JSONResponse(
            content={
                "success": True,
                "chat": {
                    "id": chat.id,
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

# ============= SEND MESSAGE (GROQ) =============
@router.post("/send")
async def send_message(
    request: Request,
    db: Session = Depends(get_db)
):
    """Send message - GROQ API"""
    try:
        print("\n📨 ===== SEND MESSAGE (GROQ) =====")
        data = await request.json()
        user_message = data.get("message", "")
        chat_id = data.get("chat_id")
        
        user = await get_current_user(request, db)
        if not user:
            print("❌ Not authenticated")
            return JSONResponse(
                status_code=401,
                content={"success": False, "message": "Not authenticated"}
            )
        
        print(f"👤 User: {user.id}")
        print(f"💬 Message: {user_message[:50]}")
        
        if not user_message:
            return JSONResponse(
                content={"success": True, "message": "Hello!"}
            )
        
        chat = None
        if chat_id:
            chat = db.query(Chat).filter(
                Chat.id == chat_id,
                Chat.user_id == user.id
            ).first()
        
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
            print(f"✅ Created chat: {chat.id}")
        
        messages = chat.messages or []
        messages.append({
            "role": "user",
            "content": user_message
        })
        chat.messages = messages
        chat.updated_at = datetime.utcnow()
        db.commit()
        
        # ===== PURANA OLLAMA CODE (COMMENTED) =====
        # async with aiohttp.ClientSession() as session:
        #     payload = {
        #         "model": MODEL_NAME,
        #         "prompt": user_message,
        #         "stream": False
        #     }
        #     async with session.post(OLLAMA_URL, json=payload) as response:
        #         if response.status == 200:
        #             result = await response.json()
        #             ai_response = result.get("response", "Hello!")
        #         else:
        #             ai_response = "Hello! I'm here to help."
        # ===== PURANA OLLAMA CODE (COMMENTED) =====
        
        # ===== NAYA GROQ API CALL =====
        try:
            response = await client.chat.completions.create(
                model=MODEL_NAME,
                messages=[{"role": "user", "content": user_message}],
                max_tokens=500,
                temperature=0.7
            )
            ai_response = response.choices[0].message.content
            print(f"✅ Groq response received")
        except Exception as e:
            logging.error(f"Groq API error: {e}")
            print(f"❌ Groq error: {e}")
            ai_response = "Sorry, I'm having trouble connecting. Please try again."
        # ===== NAYA GROQ API CALL =====
        
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
                "chat_id": chat.id
            }
        )
                
    except Exception as e:
        logging.error(f"Chat error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Server error"}
        )

# ============= DELETE CHAT =============
@router.delete("/{chat_id}")
async def delete_chat(
    chat_id: int,
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
        
        chat = db.query(Chat).filter(
            Chat.id == chat_id,
            Chat.user_id == user.id
        ).first()
        
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

# ============= TEST ENDPOINT =============
@router.get("/test")
async def test():
    return JSONResponse(
        content={"success": True, "message": "Chat API with Groq is working"}
    )
