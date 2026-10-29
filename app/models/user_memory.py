from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from database.db import Base
from app.models.user import User  # noqa: F401

class UserMemory(Base):
    __tablename__ = "user_memory"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(50), nullable=False)      # 'person', 'preference', 'fact', 'project', 'tech'
    mem_key = Column(String(100), nullable=False)      # 'girlfriend_name', 'current_project'
    mem_value = Column(Text, nullable=False)           # 'Kripa', 'MonsterX AI'
    context = Column(Text, nullable=True)              # 'User mentioned their girlfriend Kripa'
    importance = Column(Float, default=0.5)            # 0.0 to 1.0 (Claude-style scoring)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
