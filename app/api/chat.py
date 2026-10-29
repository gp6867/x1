from fastapi import APIRouter, Depends, Request, BackgroundTasks
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime
from uuid import UUID as PyUUID
import asyncio
import logging
import os
import re
import httpx
from openai import AsyncOpenAI

from ..database.db import get_db
from ..models.user import User
from ..models.chat import Chat
from ..models.message_feedback import MessageFeedback
from ..brain.memory_manager import build_memory_context, extract_and_save
from ..brain.memory_filter import should_extract, has_pronoun
from ..brain.memory_store import get_all_facts, delete_fact, delete_all, get_summary, delete_chat_summary
from ..utils.jwt_handler import verify_token
from ..utils.rate_limit import (
    get_user_plan, check_daily_limit, check_hourly_limit,
    increment_usage, get_usage_stats, PLAN_LIMITS,
)

router = APIRouter()

# ===== PROVIDERS =====
groq_client = AsyncOpenAI(
    api_key=os.getenv("GROQ_API_KEY", "").strip(),
    base_url="https://api.groq.com/openai/v1"
)
GROQ_MODEL = "openai/gpt-oss-120b"

_gemini_http_client = httpx.AsyncClient(
    timeout=httpx.Timeout(90.0, connect=15.0),
    limits=httpx.Limits(max_keepalive_connections=5, max_connections=10),
)
gemini_client = AsyncOpenAI(
    api_key=os.getenv("GEMINI_API_KEY", "").strip(),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
    http_client=_gemini_http_client,
)
GEMINI_MODEL = "gemini-3.8-flash"

# ===== MEMORY CONFIG =====
MAX_CONTEXT_MESSAGES = 12
MAX_MESSAGE_CHARS = 3000
MAX_TOTAL_CONTEXT_CHARS = 12000

BASE_SYSTEM_PROMPT = """You are MonsterX AI, an elite AI assistant built by Xone AI.

=== CRITICAL RULES (NEVER BREAK THESE) ===
1. **LANGUAGE MATCHING**: You must reply in the EXACT script the user uses. 
   - If the user types in English or Hinglish (using English letters like "kya kar raha hai"), you MUST reply in English/Hinglish.
   - NEVER use Devanagari script (हिंदी) unless the user explicitly types in Hindi (हिंदी).
   - NEVER use robotic, overly formal Hindi. Be casual and direct.

2. **CURRENT TOPIC IS KING**: 
   - The user's LATEST message is your only priority. 
   - You have "BACKGROUND MEMORY" below, but it is from PAST conversations.
   - IGNORE background memory unless it directly helps answer the current question.

3. **NO ROBOTIC ANSWERS**:
   - Do not give generic "ratings" or "breakdowns" unless explicitly asked.
   - Answer the user's question directly in the first sentence.

4. **TRUTHFULNESS**:
   - If you don't know something, say "I'm not sure". Do not hallucinate.
"""

_CODE_KEYWORDS = [
    "code", "script", "program", "file", "function", "class",
    "component", "endpoint", "route", "api", "backend", "frontend",
    "full code", "complete code", "pura code", "poora code", "code do",
    "code likho", "code banao", "code chahiye", "code de",
    "build a", "build the", "create a", "create the", "banao", "bana do",
    "banana hai", "likho", "likh do", "implement", "develop",
    "project", "website", "app banao", "site banao",
    "next", "aage", "aage ka", "continue",
]

def is_code_request(msg: str) -> bool:
    if not msg: return False
    m = msg.lower()
    return any(kw in m for kw in _CODE_KEYWORDS)

_FILE_HEADER_PATTERN = re.compile(
    r"^\s*(?:#+\s*)?File\s+(\d+)\s*[—–\-:]\s*([A-Za-z0-9_\-./]+\.(?:js|jsx|ts|tsx|py|html|css|json|md|yml|yaml|sql|env|sh|txt|toml|ini|xml|vue|svelte))\s*$",
    re.IGNORECASE | re.MULTILINE,
)

def extract_sent_files(messages_history: list) -> list:
    sent = []
    for msg in messages_history:
        if not isinstance(msg, dict) or msg.get("role") != "assistant": continue
        content = msg.get("content", "")
        if not isinstance(content, str): continue
        for m in _FILE_HEADER_PATTERN.finditer(content):
            path = m.group(2).strip()
            if path and path not in sent: sent.append(path)
    return sent

def enforce_one_file_per_response(response: str, sent_files: list) -> str:
    if not response: return response
    matches = list(_FILE_HEADER_PATTERN.finditer(response))
    if not matches: return response

    first_new = None
    for m in matches:
        if m.group(2).strip() not in sent_files:
            first_new = m
            break

    if first_new is None:
        logging.warning("⚠️ AI tried to resend only already-sent files → short-circuit")
        return "All files in this project have already been provided. Reply with a specific file you'd like me to modify, or say 'new project' for a fresh build."

    next_boundary = None
    for m in matches:
        if m.start() > first_new.start():
            next_boundary = m.start()
            break

    if next_boundary is None: return response

    truncated = response[:next_boundary].rstrip()
    file_no = first_new.group(1)
    path = first_new.group(2).strip()

    if not re.search(r"send\s+[\"']?next[\"']?", truncated, re.IGNORECASE):
        truncated += f"\n\nFile {file_no}: {path} done. Send \"next\" for the next file."

    logging.warning(f"✂️ Truncated: AI dumped multiple files, kept only File {file_no}: {path}")
    return truncated

async def get_current_user(request: Request, db: Session):
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "): return None
    try:
        payload = verify_token(auth.replace("Bearer ", ""))
        if not payload: return None
        uid = payload.get("id")
        return db.query(User).filter(User.id == uid).first() if uid else None
    except Exception as e:
        logging.warning(f"auth error: {e}")
        return None

def find_chat(db: Session, chat_id, user_id: int):
    if not chat_id: return None
    try:
        c = db.query(Chat).filter(Chat.uuid_id == str(chat_id), Chat.user_id == user_id).first()
        if c: return c
    except Exception: pass
    try:
        return db.query(Chat).filter(Chat.id == int(chat_id), Chat.user_id == user_id).first()
    except (ValueError, TypeError): return None

def generate_title(msg: str) -> str:
    if not msg: return "New Chat"
    t = msg.strip()[:30]
    return t + "..." if len(msg) > 30 else t

def extract_content(resp) -> str:
    try:
        if resp and resp.choices and resp.choices[0].message:
            c = resp.choices[0].message.content
            if c and isinstance(c, str): return c.strip()
            if isinstance(c, list):
                parts = []
                for p in c:
                    if isinstance(p, dict) and p.get("type") == "text": parts.append(p.get("text", ""))
                return " ".join(parts).strip()
    except Exception: pass
    return ""

def is_rate_limit(e: Exception) -> bool:
    s = str(e).lower()
    if "429" in s or "rate limit" in s or "quota" in s or "exceeded" in s: return True
    if getattr(e, "status_code", None) == 429: return True
    r = getattr(e, "response", None)
    return r is not None and getattr(r, "status_code", None) == 429

def build_context(messages_history: list, system_prompt: str) -> list:
    # Cap system prompt to 8000 chars to leave room for messages
    sys_prompt_capped = system_prompt[:8000]
    ctx = [{"role": "system", "content": sys_prompt_capped}]
    
    valid = [
        {"role": m["role"], "content": m["content"]}
        for m in messages_history
        if isinstance(m, dict) and m.get("role") in ("user", "assistant")
        and isinstance(m.get("content"), str) and m["content"]
    ]
    recent = valid[-MAX_CONTEXT_MESSAGES:]
    total = len(sys_prompt_capped)
    
    # Process NEWEST to OLDEST to guarantee latest message is kept
    selected = []
    for msg in reversed(recent):
        c = msg["content"]
        if len(c) > MAX_MESSAGE_CHARS: c = c[:MAX_MESSAGE_CHARS] + "...[truncated]"
        if len(selected) > 0 and total + len(c) > MAX_TOTAL_CONTEXT_CHARS: break
        selected.append({"role": msg["role"], "content": c})
        total += len(c)
        
    ctx.extend(reversed(selected))
    logging.info(f"📚 Context: {len(ctx) - 1} msgs, ~{total} chars")
    return ctx

def get_friendly_error_message(groq_reason: str, gemini_reason: str) -> str:
    both_rate = (groq_reason == "rate_limit" and gemini_reason == "rate_limit")
    one_rate = (groq_reason == "rate_limit" or gemini_reason == "rate_limit")
    if both_rate:
        return "**🚀 Daily AI limit reached**\n\nYou've reached today's free usage limit. Both of our AI providers have hit their daily quota for now.\n\n**What you can do:**\n- ⏰ **Try again in a few hours**\n- 🌙 **Come back tomorrow**\n- ⭐ **Upgrade to Pro** *(coming soon)*"
    if one_rate:
        return "**⏳ AI service is busy right now**\n\nOne of our AI providers is experiencing high demand.\n\n**Please try:**\n- 🔄 **Wait 30-60 seconds** and resend\n- ⭐ **Upgrade to Pro** *(coming soon)*"
    return "**🔌 Connection issue**\n\nWe couldn't reach our AI providers just now. Please try again in a few seconds."

async def get_ai_response(messages_history: list, system_prompt: str) -> tuple:
    ctx = build_context(messages_history, system_prompt)
    last_user_msg = ""
    for m in reversed(messages_history):
        if isinstance(m, dict) and m.get("role") == "user":
            last_user_msg = m.get("content", "")
            break

    code_mode = is_code_request(last_user_msg)
    sent_files = extract_sent_files(messages_history) if code_mode else []
    max_out = 3500 if code_mode else 800

    logging.info(f"🎯 Code mode: {code_mode}, max_tokens: {max_out}")

    if code_mode and sent_files:
        sent_list = "\n".join(f"  - {p}" for p in sent_files)
        ctx[0] = {
            "role": "system",
            "content": ctx[0]["content"] + f"\n\n=== ALREADY-SENT FILES (DO NOT REPEAT) ===\n{sent_list}\nSend only the NEXT unsent file.",
        }

    groq_reason = None
    gemini_reason = None

    try:
        logging.info("🔄 Groq (primary)...")
        r = await groq_client.chat.completions.create(
            model=GROQ_MODEL, messages=ctx, max_tokens=max_out, temperature=0.65, top_p=0.95, frequency_penalty=0.3, presence_penalty=0.3
        )
        t = extract_content(r)
        if t:
            if code_mode: t = enforce_one_file_per_response(t, sent_files)
            logging.info("✅ Groq responded")
            return (t, "Groq")
        groq_reason = "empty"
    except Exception as e:
        groq_reason = "rate_limit" if is_rate_limit(e) else "error"
        logging.warning(f"⚠️ Groq failed ({groq_reason}) → trying Gemini: {e}")

    try:
        logging.info("🔄 Gemini (fallback)...")
        r = await gemini_client.chat.completions.create(
            model=GEMINI_MODEL, messages=ctx, max_tokens=max_out, temperature=0.65, top_p=0.95, frequency_penalty=0.3, presence_penalty=0.3
        )
        t = extract_content(r)
        if t:
            if code_mode: t = enforce_one_file_per_response(t, sent_files)
            logging.info("✅ Gemini responded")
            return (t, "Gemini")
        gemini_reason = "empty"
    except Exception as e:
        gemini_reason = "rate_limit" if is_rate_limit(e) else "error"
        logging.error(f"❌ Gemini failed ({gemini_reason}): {e}")

    logging.error(f"❌ Both providers failed — Groq: {groq_reason}, Gemini: {gemini_reason}")
    friendly = get_friendly_error_message(groq_reason or "error", gemini_reason or "error")
    provider_tag = "LimitReached" if (groq_reason == "rate_limit" and gemini_reason == "rate_limit") else "Error"
    return (friendly, provider_tag)

async def get_gemini_vision_response(user_msg: str, image_url: str, chat_messages: list, system_prompt: str) -> tuple:
    ctx = [{"role": "system", "content": system_prompt + " Be concise — describe the image in 3-5 sentences."}]
    for m in chat_messages[-5:-1]:
        if isinstance(m, dict) and m.get("role") in ("user", "assistant"):
            content = m.get("content", "")
            if content and isinstance(content, str): ctx.append({"role": m["role"], "content": content})

    prompt_text = user_msg.strip() if user_msg.strip() else "What is in this image?"
    ctx.append({"role": "user", "content": [{"type": "text", "text": prompt_text}, {"type": "image_url", "image_url": {"url": image_url}}]})

    async def try_gemini():
        r = await gemini_client.chat.completions.create(model=GEMINI_MODEL, messages=ctx, max_tokens=600, temperature=0.7, timeout=12.0)
        return extract_content(r)

    async def try_groq():
        r = await groq_client.chat.completions.create(model="meta-llama/llama-4-scout-17b-16e-instruct", messages=ctx, max_tokens=600, temperature=0.7, timeout=12.0)
        return extract_content(r)

    tasks = {asyncio.create_task(try_gemini()): "Gemini-Vision", asyncio.create_task(try_groq()): "Groq-Vision"}
    pending = set(tasks.keys())
    try:
        while pending:
            done, pending = await asyncio.wait(pending, timeout=13.0, return_when=asyncio.FIRST_COMPLETED)
            if not done: break
            for task in done:
                provider = tasks[task]
                try:
                    text = task.result()
                    if text:
                        for p in pending: p.cancel()
                        return (text, provider)
                except Exception as e: pass
    finally:
        for task in pending: task.cancel()

    return ("**🖼️ Image analysis unavailable right now**\n\nPlease try again in a moment.", "VisionError")

async def _run_extraction_bg(user_id: int, chat_id: str, messages_snapshot: list, prev_summary: str):
    try:
        from ..database.db import SessionLocal
        db = SessionLocal()
        try:
            await extract_and_save(db=db, user_id=user_id, chat_id=chat_id, messages_history=messages_snapshot, previous_summary=prev_summary, primary_client=groq_client, primary_model=GROQ_MODEL, fallback_client=gemini_client, fallback_model=GEMINI_MODEL)
        finally: db.close()
    except Exception as e:
        logging.warning(f"Background extraction error: {e}")

@router.get("/history")
async def get_history(request: Request, db: Session = Depends(get_db)):
    try:
        u = await get_current_user(request, db)
        if not u: return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})
        chats = db.query(Chat).filter(Chat.user_id == u.id).order_by(Chat.updated_at.desc()).limit(20).all()
        return JSONResponse(content={"success": True, "chats": [{"id": str(c.uuid_id), "title": c.title} for c in chats]})
    except Exception as e: return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})

@router.post("/new")
async def new_chat(request: Request, db: Session = Depends(get_db)):
    try:
        u = await get_current_user(request, db)
        if not u: return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})
        data = await request.json()
        c = Chat(user_id=u.id, title=generate_title(data.get("message", "New chat")), messages=[], created_at=datetime.utcnow(), updated_at=datetime.utcnow())
        db.add(c); db.commit(); db.refresh(c)
        return JSONResponse(content={"success": True, "chat_id": str(c.uuid_id), "title": c.title})
    except Exception as e: return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})

@router.post("/feedback")
async def feedback(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
        u = await get_current_user(request, db)
        if not u: return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})
        cid, idx, fb = data.get("chat_id"), data.get("message_index"), data.get("feedback")
        if cid is None or idx is None: return JSONResponse(status_code=400, content={"success": False, "message": "chat_id and message_index required"})
        try: cu = PyUUID(str(cid))
        except Exception: return JSONResponse(status_code=400, content={"success": False, "message": "Invalid chat_id"})
        db.query(MessageFeedback).filter(MessageFeedback.chat_id == cu, MessageFeedback.message_index == int(idx), MessageFeedback.user_id == u.id).delete()
        if fb in ("like", "dislike"): db.add(MessageFeedback(chat_id=cu, message_index=int(idx), user_id=u.id, feedback=fb))
        db.commit(); return JSONResponse(content={"success": True, "feedback": fb})
    except Exception as e: return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})

@router.get("/feedback/{chat_id}")
async def get_feedback(chat_id: str, request: Request, db: Session = Depends(get_db)):
    try:
        u = await get_current_user(request, db)
        if not u: return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})
        try: cu = PyUUID(str(chat_id))
        except Exception: return JSONResponse(status_code=400, content={"success": False, "message": "Invalid chat_id"})
        rows = db.query(MessageFeedback).filter(MessageFeedback.chat_id == cu, MessageFeedback.user_id == u.id).all()
        return JSONResponse(content={"success": True, "feedback": {r.message_index: r.feedback for r in rows}})
    except Exception as e: return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})

@router.post("/guest")
async def guest_chat(request: Request):
    try:
        data = await request.json()
        user_msg = (data.get("message") or "").strip()
        if not user_msg: return JSONResponse(content={"success": True, "message": "Hello!"})
        ai_response, provider = await get_ai_response([{"role": "user", "content": user_msg}], BASE_SYSTEM_PROMPT)
        return JSONResponse(content={"success": True, "message": ai_response, "chat_id": "guest", "provider": provider})
    except Exception as e: return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})

@router.post("/send")
async def send_message(request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    try:
        data = await request.json()
        user_msg = (data.get("message") or "").strip()
        chat_id = data.get("chat_id")
        image_url = data.get("image_url")

        u = await get_current_user(request, db)
        if not u: return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})
        if not user_msg and not image_url: return JSONResponse(content={"success": True, "message": "Hello!"})

        plan = get_user_plan(u)
        allowed_daily, used, limit, _ = check_daily_limit(db, u.id, plan)
        if not allowed_daily:
            return JSONResponse(status_code=429, content={"success": False, "limit_reached": True, "message": f"**🚀 Daily limit reached**\n\nYou've used all **{limit}** messages for today ({used}/{limit}).\n\nPlease wait until midnight UTC or upgrade to Pro."})

        allowed_hourly, used_h, limit_h = check_hourly_limit(u.id, plan)
        if not allowed_hourly:
            return JSONResponse(status_code=429, content={"success": False, "limit_reached": True, "message": f"**⏳ Slow down a bit**\n\nYou've sent **{used_h}** messages in the last hour. Please wait a few minutes."})

        chat = find_chat(db, chat_id, u.id) if chat_id else None
        if not chat:
            chat = Chat(user_id=u.id, title=generate_title(user_msg or "Image chat"), messages=[], created_at=datetime.utcnow(), updated_at=datetime.utcnow())
            db.add(chat); db.commit(); db.refresh(chat)

        messages = chat.messages or []
        summary_row = get_summary(db, str(chat.uuid_id))
        memory_ctx = build_memory_context(db, u.id, str(chat.uuid_id))
        system_prompt = BASE_SYSTEM_PROMPT + ("\n\n" + memory_ctx if memory_ctx else "")

        user_obj = {"role": "user", "content": user_msg}
        if image_url: user_obj["image_url"] = image_url
        messages.append(user_obj)
        chat.messages = messages; chat.updated_at = datetime.utcnow(); db.commit()

        if image_url:
            ai_response, provider = await get_gemini_vision_response(user_msg, image_url, messages, system_prompt)
        else:
            ai_response, provider = await get_ai_response(messages, system_prompt)
        
        model_tag = "gemini" if provider and "gemini" in provider.lower() else None
        increment_usage(db, u.id, model=model_tag)

        messages.append({"role": "assistant", "content": ai_response})
        chat.messages = messages; chat.updated_at = datetime.utcnow(); db.commit()

        if not image_url and (should_extract(user_msg) or has_pronoun(user_msg) or len(messages) % 6 == 0):
            background_tasks.add_task(_run_extraction_bg, u.id, str(chat.uuid_id), list(messages), summary_row.summary if summary_row else "")

        return JSONResponse(content={"success": True, "message": ai_response, "chat_id": str(chat.uuid_id), "provider": provider})
    except Exception as e:
        import traceback; traceback.print_exc()
        return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})

@router.get("/memory")
async def view_memory(request: Request, db: Session = Depends(get_db)):
    try:
        u = await get_current_user(request, db)
        if not u: return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})
        facts = get_all_facts(db, u.id)
        return JSONResponse(content={"success": True, "count": len(facts), "facts": [{"category": f.category, "key": f.mem_key, "value": f.mem_value, "context": f.context, "updated_at": f.updated_at.isoformat() if f.updated_at else None} for f in facts]})
    except Exception as e: return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})

@router.delete("/memory/{key}")
async def forget_key(key: str, request: Request, db: Session = Depends(get_db)):
    try:
        u = await get_current_user(request, db)
        if not u: return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})
        return JSONResponse(content={"success": True, "deleted": delete_fact(db, u.id, key)})
    except Exception as e: return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})

@router.delete("/memory")
async def forget_all(request: Request, db: Session = Depends(get_db)):
    try:
        u = await get_current_user(request, db)
        if not u: return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})
        return JSONResponse(content={"success": True, "deleted": delete_all(db, u.id)})
    except Exception as e: return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})

@router.get("/test-groq")
async def test_groq():
    try:
        r = await groq_client.chat.completions.create(model=GROQ_MODEL, messages=[{"role": "user", "content": "Say 'Groq working' in 3 words"}], max_tokens=20, temperature=0.5)
        return JSONResponse(content={"success": True, "provider": "Groq", "response": extract_content(r)})
    except Exception as e: return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

@router.get("/test-gemini")
async def test_gemini():
    try:
        r = await gemini_client.chat.completions.create(model=GEMINI_MODEL, messages=[{"role": "user", "content": "Say 'Gemini working' in 3 words"}], max_tokens=20, temperature=0.5)
        return JSONResponse(content={"success": True, "provider": "Gemini", "response": extract_content(r)})
    except Exception as e: return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

@router.get("/usage")
async def get_my_usage(request: Request, db: Session = Depends(get_db)):
    try:
        u = await get_current_user(request, db)
        if not u: return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})
        plan = get_user_plan(u)
        stats = get_usage_stats(db, u.id)
        stats["plan"] = plan
        stats["daily_limit"] = PLAN_LIMITS[plan]["daily"]
        stats["hourly_limit"] = PLAN_LIMITS[plan]["hourly"]
        stats["remaining"] = max(0, PLAN_LIMITS[plan]["daily"] - stats["messages_used"])
        return JSONResponse(content={"success": True, **stats})
    except Exception as e: return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})

@router.get("/test")
async def test():
    return JSONResponse(content={"success": True, "message": "MonsterX AI with vision + memory running"})

@router.get("/{chat_id}")
async def get_chat(chat_id: str, request: Request, db: Session = Depends(get_db)):
    try:
        u = await get_current_user(request, db)
        if not u: return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})
        c = find_chat(db, chat_id, u.id)
        if not c: return JSONResponse(status_code=404, content={"success": False, "message": "Chat not found"})
        return JSONResponse(content={"success": True, "chat": {"id": str(c.uuid_id), "title": c.title, "messages": c.messages or []}})
    except Exception as e: return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})

@router.delete("/{chat_id}")
async def delete_chat(chat_id: str, request: Request, db: Session = Depends(get_db)):
    try:
        u = await get_current_user(request, db)
        if not u: return JSONResponse(status_code=401, content={"success": False, "message": "Not authenticated"})
        c = find_chat(db, chat_id, u.id)
        if not c: return JSONResponse(status_code=404, content={"success": False, "message": "Chat not found"})
        db.delete(c)
        delete_chat_summary(db, str(c.uuid_id))
        db.commit()
        return JSONResponse(content={"success": True, "message": "Chat deleted"})
    except Exception as e: return JSONResponse(status_code=500, content={"success": False, "message": "Server error"})
