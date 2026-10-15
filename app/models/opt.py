from sqlalchemy import Column, Integer, String, DateTime, Boolean, func
from datetime import datetime, timezone
from database.db import Base

class OTP(Base):
    __tablename__ = "otps"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    otp = Column(String(6), nullable=False)
    type = Column(String, default="verification")
    attempts = Column(Integer, default=0)
    max_attempts = Column(Integer, default=3)
    expires_at = Column(DateTime, nullable=False)  # ✅ Timezone aware hoga
    created_at = Column(DateTime, server_default=func.now())
    used = Column(Boolean, default=False)

    @property
    def is_expired(self):
        """Check if OTP is expired"""
        if not self.expires_at:
            return True
        now = datetime.now(timezone.utc)
        if self.expires_at.tzinfo is None:
            expires_at = self.expires_at.replace(tzinfo=timezone.utc)
        else:
            expires_at = self.expires_at
        return now > expires_at
