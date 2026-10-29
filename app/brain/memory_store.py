import logging
from sqlalchemy.orm import Session
from ..models.user_memory import UserMemory
from ..models.chat_summary import ChatSummary

def save_fact(db: Session, user_id: int, category: str, key: str, value: str, context: str = None, importance: float = 0.5):
    try:
        key = (key or "").strip()[:100]
        value = (value or "").strip()
        category = (category or "fact").strip().lower()[:50]
        if not key or not value:
            return None

        existing = db.query(UserMemory).filter(
            UserMemory.user_id == user_id,
            UserMemory.category == category,
            UserMemory.mem_key == key
        ).first()

        if existing:
            existing.mem_value = value
            if context:
                existing.context = context
            existing.importance = importance
            db.commit()
            return existing

        new = UserMemory(
            user_id=user_id, category=category,
            mem_key=key, mem_value=value, context=context,
            importance=importance
        )
        db.add(new)
        db.commit()
        return new
    except Exception as e:
        logging.error(f"save_fact error: {e}")
        db.rollback()
        return None

def get_top_facts(db: Session, user_id: int, limit: int = 15):
    """Retrieve ONLY the most important facts (Claude-style)"""
    try:
        return db.query(UserMemory).filter(
            UserMemory.user_id == user_id
        ).order_by(UserMemory.importance.desc(), UserMemory.updated_at.desc()).limit(limit).all()
    except Exception as e:
        logging.error(f"get_top_facts error: {e}")
        return []

def get_all_facts(db: Session, user_id: int, limit: int = 100):
    try:
        return db.query(UserMemory).filter(UserMemory.user_id == user_id).order_by(UserMemory.updated_at.desc()).limit(limit).all()
    except Exception as e:
        logging.error(f"get_all_facts error: {e}")
        return []

def delete_fact(db: Session, user_id: int, key: str):
    try:
        n = db.query(UserMemory).filter(UserMemory.user_id == user_id, UserMemory.mem_key == key).delete()
        db.commit()
        return n
    except Exception as e:
        db.rollback()
        return 0

def delete_all(db: Session, user_id: int):
    try:
        n = db.query(UserMemory).filter(UserMemory.user_id == user_id).delete()
        db.query(ChatSummary).filter(ChatSummary.user_id == user_id).delete()
        db.commit()
        return n
    except Exception as e:
        db.rollback()
        return 0

def save_summary(db: Session, user_id: int, chat_id: str, summary: str, messages_covered: int = 0):
    try:
        if not summary or not summary.strip(): return None
        existing = db.query(ChatSummary).filter(ChatSummary.chat_id == str(chat_id)).first()
        if existing:
            existing.summary = summary
            existing.messages_covered = messages_covered
            db.commit()
            return existing
        new = ChatSummary(chat_id=str(chat_id), user_id=user_id, summary=summary, messages_covered=messages_covered)
        db.add(new); db.commit(); return new
    except Exception as e:
        logging.error(f"save_summary error: {e}")
        db.rollback()
        return None

def get_summary(db: Session, chat_id: str):
    try:
        return db.query(ChatSummary).filter(ChatSummary.chat_id == str(chat_id)).first()
    except Exception:
        return None

def delete_chat_summary(db: Session, chat_id: str):
    try:
        db.query(ChatSummary).filter(ChatSummary.chat_id == str(chat_id)).delete()
        db.commit()
    except Exception:
        db.rollback()
