from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from database.db import Base

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    token = Column(String, nullable=False)
    refresh_token = Column(String)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
