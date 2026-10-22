from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from database.db import Base
from app.models.user import User  # noqa: F401 — FK resolve


class UserMemory(Base):
    __tablename__ = "user_memory"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(50), nullable=False)      # 'person', 'preference', 'fact', 'event', 'relationship'
    mem_key = Column(String(100), nullable=False)      # 'girlfriend_name', 'employer'
    mem_value = Column(Text, nullable=False)           # 'Kripa'
    context = Column(Text, nullable=True)              # 'User mentioned their girlfriend Kripa'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
