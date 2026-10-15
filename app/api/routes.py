from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.message import Message
from app.database.db import get_db
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api")

@router.post("/chat")
def chat(message: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    reply = f"Monster AI says: {message}"

    if current_user:
        user_msg = Message(user_id=current_user.id, role="user", content=message, timestamp=datetime.utcnow())
        ai_msg = Message(user_id=current_user.id, role="assistant", content=reply, timestamp=datetime.utcnow())
        db.add_all([user_msg, ai_msg])
        db.commit()

    return {"reply": reply, "user": current_user.username if current_user else "Guest"}
