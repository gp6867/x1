from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from datetime import datetime, timezone
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from database.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=True)
    name = Column(String, nullable=True)
    google_id = Column(String, unique=True, nullable=True)
    apple_id = Column(String, unique=True, nullable=True)
    is_verified = Column(Boolean, default=False)
    forgot_password_attempts = Column(Integer, default=0)
    last_forgot_password = Column(DateTime, nullable=True)
    account_locked = Column(Boolean, default=False)
    lock_until = Column(DateTime, nullable=True)
    
    # Payment & Quota Fields
    plan = Column(String, default="free")  # free, pro, pro_plus, ultimate
    video_quota = Column(Integer, default=5)
    quota_reset_date = Column(DateTime, default=datetime.utcnow)
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    @property
    def last_forgot_password_aware(self):
        """Return last_forgot_password with timezone (for comparison)"""
        if self.last_forgot_password:
            if self.last_forgot_password.tzinfo is None:
                return self.last_forgot_password.replace(tzinfo=timezone.utc)
            return self.last_forgot_password
        return None
