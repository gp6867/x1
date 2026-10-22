from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from database.db import Base
from app.models.user import User  # noqa: F401


class ChatSummary(Base):
    __tablename__ = "chat_summary"

    id = Column(Integer, primary_key=True)
    chat_id = Column(String(36), nullable=False, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    summary = Column(Text, nullable=False)
    messages_covered = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
