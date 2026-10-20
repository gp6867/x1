from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

# ✅ FIX: existing models jaisa hi import (chat.py model se match)
from database.db import Base

# ✅ FIX: User model import — ForeignKey resolve ke liye zaroori
from app.models.user import User  # noqa: F401


class MessageFeedback(Base):
    __tablename__ = "message_feedback"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    message_index = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    feedback = Column(String(10), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
