from pydantic import BaseModel
from typing import Optional

class UserResponse(BaseModel):
    id: int
    email: str
    name: Optional[str] = None
    is_verified: bool
    
    class Config:
        from_attributes = True  # SQLAlchemy models ke liye
