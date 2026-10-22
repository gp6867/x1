# app/brain/memory_store.py
# DB CRUD operations for user memory

import logging
from sqlalchemy.orm import Session
from ..models.user_memory import UserMemory


def save_fact(db: Session, user_id: int, category: str, key: str, value: str, context: str = None):
    """Upsert a fact — naya save ya existing update"""
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
            db.commit()
            logging.info(f"💾 Memory updated: [{category}] {key} = {value}")
            return existing

        new = UserMemory(
            user_id=user_id,
            category=category,
            mem_key=key,
            mem_value=value,
            context=context
        )
        db.add(new)
        db.commit()
        logging.info(f"💾 Memory saved: [{category}] {key} = {value}")
        return new
    except Exception as e:
        logging.error(f"save_fact error: {e}")
        db.rollback()
        return None


def get_all_facts(db: Session, user_id: int, limit: int = 50):
    """User ke saare facts — latest first"""
    try:
        return db.query(UserMemory).filter(
            UserMemory.user_id == user_id
        ).order_by(UserMemory.updated_at.desc()).limit(limit).all()
    except Exception as e:
        logging.error(f"get_all_facts error: {e}")
        return []


def delete_fact(db: Session, user_id: int, key: str):
    """Ek specific fact delete"""
    try:
        count = db.query(UserMemory).filter(
            UserMemory.user_id == user_id,
            UserMemory.mem_key == key
        ).delete()
        db.commit()
        return count
    except Exception as e:
        logging.error(f"delete_fact error: {e}")
        db.rollback()
        return 0


def delete_all(db: Session, user_id: int):
    """Poori memory clear"""
    try:
        count = db.query(UserMemory).filter(UserMemory.user_id == user_id).delete()
        db.commit()
        logging.info(f"🗑️ All memory deleted for user {user_id}: {count} rows")
        return count
    except Exception as e:
        logging.error(f"delete_all error: {e}")
        db.rollback()
        return 0
