from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ..database.db import get_db
from ..models.user import User
from ..utils.jwt_handler import verify_token
import logging

router = APIRouter()

# ============= HELPER: Get Current User =============
async def get_current_user(request: Request, db: Session):
    """Extract user from JWT token"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    
    token = auth_header.split(" ")[1]
    payload = verify_token(token)
    
    if not payload:
        return None
    
    user_id = payload.get("id")
    return db.query(User).filter(User.id == user_id).first()

# ============= GET USER PROFILE =============
@router.get("/profile")
async def get_profile(
    request: Request,
    db: Session = Depends(get_db)
):
    """Get current user profile"""
    try:
        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(
                status_code=401,
                content={"success": False, "message": "Not authenticated"}
            )
        
        return {
            "success": True,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "plan": user.plan,
                "is_verified": user.is_verified,
                "video_quota": user.video_quota
            }
        }
    except Exception as e:
        logging.error(f"Profile error: {e}")
        return {"success": False, "message": "Failed to get profile"}

# ============= UPDATE USER PROFILE =============
@router.put("/profile")
async def update_profile(
    request: Request,
    db: Session = Depends(get_db)
):
    """Update user profile"""
    try:
        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(
                status_code=401,
                content={"success": False, "message": "Not authenticated"}
            )
        
        data = await request.json()
        
        if "name" in data:
            user.name = data["name"]
        
        db.commit()
        db.refresh(user)
        
        return {
            "success": True,
            "message": "Profile updated",
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "plan": user.plan
            }
        }
    except Exception as e:
        logging.error(f"Update profile error: {e}")
        return {"success": False, "message": "Failed to update profile"}

# ============= GET USER QUOTA =============
@router.get("/quota")
async def get_quota(
    request: Request,
    db: Session = Depends(get_db)
):
    """Get user's remaining video quota"""
    try:
        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(
                status_code=401,
                content={"success": False, "message": "Not authenticated"}
            )
        
        # Check if quota needs monthly reset
        now = datetime.utcnow()
        if user.quota_reset_date and user.quota_reset_date < now:
            # Reset quota based on plan
            if user.plan == "free":
                user.video_quota = 5
            elif user.plan == "pro":
                user.video_quota = 50
            elif user.plan == "pro_plus":
                user.video_quota = 200
            elif user.plan == "ultimate":
                user.video_quota = 999999
            else:
                user.video_quota = 5
            
            # Set next reset date (30 days from now)
            user.quota_reset_date = now + timedelta(days=30)
            db.commit()
        
        # Get total quota based on plan
        total_quota = {
            "free": 5,
            "pro": 50,
            "pro_plus": 200,
            "ultimate": 999999
        }.get(user.plan, 5)
        
        return {
            "success": True,
            "plan": user.plan,
            "remaining": user.video_quota,
            "total": total_quota,
            "reset_date": user.quota_reset_date.isoformat() if user.quota_reset_date else None
        }
    except Exception as e:
        logging.error(f"Quota error: {e}")
        return {"success": False, "message": "Failed to get quota"}

# ============= UPDATE USER PLAN =============
@router.post("/upgrade")
async def upgrade_plan(
    request: Request,
    db: Session = Depends(get_db)
):
    """Upgrade user plan after payment"""
    try:
        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(
                status_code=401,
                content={"success": False, "message": "Not authenticated"}
            )
        
        data = await request.json()
        plan = data.get("plan")
        
        if plan not in ["pro", "pro_plus", "ultimate"]:
            return JSONResponse(
                status_code=400,
                content={"success": False, "message": "Invalid plan"}
            )
        
        # Update user plan
        user.plan = plan
        
        # Set quota based on plan
        if plan == "pro":
            user.video_quota = 50
        elif plan == "pro_plus":
            user.video_quota = 200
        elif plan == "ultimate":
            user.video_quota = 999999
        
        # Reset quota date
        user.quota_reset_date = datetime.utcnow() + timedelta(days=30)
        db.commit()
        
        return {
            "success": True,
            "plan": user.plan,
            "video_quota": user.video_quota,
            "message": f"Upgraded to {plan} plan successfully!"
        }
    except Exception as e:
        logging.error(f"Upgrade error: {e}")
        return {"success": False, "message": "Failed to upgrade plan"}

# ============= TEST ENDPOINT =============
@router.get("/test")
async def test():
    return {"success": True, "message": "User API is working"}
