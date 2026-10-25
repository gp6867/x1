from sqlalchemy import Column, Integer, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from database.db import Base
from app.models.user import User  # noqa: F401


class UserUsage(Base):
    __tablename__ = "user_usage"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    usage_date = Column(Date, nullable=False, server_default=func.current_date())
    messages_count = Column(Integer, default=0)
    gemini_count = Column(Integer, default=0)
    sonnet_count = Column(Integer, default=0)
    haiku_count = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (UniqueConstraint('user_id', 'usage_date', name='uq_user_usage_date'),)
