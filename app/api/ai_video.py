from fastapi import APIRouter, Request, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse, FileResponse
from sqlalchemy.orm import Session
import os
import uuid
import aiohttp
import logging
import asyncio
import shutil
from datetime import datetime, timedelta
from typing import Optional
import base64

from ..database.db import get_db
from ..models.user import User
from ..utils.jwt_handler import verify_token

router = APIRouter(prefix="/ai/video", tags=["AI Video"])

# Configuration
UPLOAD_DIR = "/home/samrat/monster-ai/uploads/video"
OUTPUT_DIR = "/home/samrat/monster-ai/outputs/video"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============= HELPER: Get Current User =============
async def get_current_user(request: Request, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None
    token = auth_header.replace("Bearer ", "")
    payload = verify_token(token)
    if not payload:
        return None
    return db.query(User).filter(User.id == payload.get("id")).first()

# ============= HELPER: Check Quota =============
def check_quota(user):
    """Check if user has remaining quota"""
    if user.video_quota <= 0:
        return False, "Video quota exhausted. Please upgrade your plan!"
    return True, "OK"

# ============= HELPER: Check Duration Limit =============
def check_duration_limit(user, duration):
    """Check if duration is allowed for user's plan"""
    limits = {
        "free": 5,
        "pro": 10,
        "pro_plus": 30,
        "ultimate": 60
    }
    max_duration = limits.get(user.plan, 5)
    if duration > max_duration:
        return False, f"Your plan allows max {max_duration} seconds. Upgrade for longer videos!"
    return True, "OK"

# ============= HELPER: Check Quality Limit =============
def check_quality_limit(user, quality):
    """Check if quality is allowed for user's plan"""
    qualities = {
        "free": ["720p"],
        "pro": ["720p"],
        "pro_plus": ["720p", "1080p", "2K"],
        "ultimate": ["720p", "1080p", "2K", "4K"]
    }
    allowed = qualities.get(user.plan, ["720p"])
    if quality not in allowed:
        return False, f"Your plan supports {', '.join(allowed)}. Upgrade for {quality}!"
    return True, "OK"

# ============= HELPER: Reset Quota if Needed =============
def reset_quota_if_needed(user):
    """Reset quota monthly based on plan"""
    now = datetime.utcnow()
    if user.quota_reset_date and user.quota_reset_date < now:
        if user.plan == "free":
            user.video_quota = 5
        elif user.plan == "pro":
            user.video_quota = 50
        elif user.plan == "pro_plus":
            user.video_quota = 200
        elif user.plan == "ultimate":
            user.video_quota = 999999
        user.quota_reset_date = now + timedelta(days=30)
        return True
    return False

# ============= VIDEO GENERATION FUNCTION =============
async def generate_with_model(
    photo_path: str, 
    video_path: str, 
    duration: int,
    quality: str
) -> tuple:
    """
    VIDEO MODEL PLACEHOLDER
    Model आने पर यहाँ सिर्फ यह function बदलना है
    """
    # TODO: Add actual model here (AnimateAnyone / Wan-Move)
    output_filename = f"output_{uuid.uuid4()}.mp4"
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    
    # Dummy output (testing ke liye)
    with open(output_path, 'wb') as f:
        f.write(b'DUMMY_VIDEO_DATA')
    
    return output_path, output_filename

# ============= VIDEO GENERATION ENDPOINT =============
@router.post("/generate")
async def generate_video(
    request: Request,
    photo: UploadFile = File(..., description="Your photo (JPG/PNG)"),
    reference_video: UploadFile = File(..., description="Reference video (MP4)"),
    duration: int = Form(10, description="Video duration (5-60 seconds)"),
    quality: str = Form("1080p", description="Quality: 720p, 1080p, 2K, 4K"),
    prompt: Optional[str] = Form(None, description="Optional description"),
    db: Session = Depends(get_db)
):
    """
    Generate video from photo + reference video
    """
    try:
        # 1. Get user
        user = await get_current_user(request, db)
        if not user:
            return JSONResponse(
                status_code=401,
                content={"success": False, "message": "Please login first"}
            )
        
        # 2. Reset quota if needed
        reset_quota_if_needed(user)
        db.commit()
        
        # 3. Check quota
        allowed, quota_msg = check_quota(user)
        if not allowed:
            return JSONResponse(
                status_code=403,
                content={
                    "success": False, 
                    "message": quota_msg, 
                    "plan": user.plan,
                    "remaining": user.video_quota
                }
            )
        
        # 4. Validate duration
        if duration < 5 or duration > 60:
            return JSONResponse(
                status_code=400,
                content={"success": False, "message": "Duration must be between 5 and 60 seconds"}
            )
        
        # 5. Check duration limit for user's plan
        duration_allowed, duration_msg = check_duration_limit(user, duration)
        if not duration_allowed:
            return JSONResponse(
                status_code=403,
                content={
                    "success": False, 
                    "message": duration_msg, 
                    "plan": user.plan,
                    "max_duration": 10 if user.plan == "pro" else (30 if user.plan == "pro_plus" else 60)
                }
            )
        
        # 6. Check quality limit for user's plan
        quality_allowed, quality_msg = check_quality_limit(user, quality)
        if not quality_allowed:
            return JSONResponse(
                status_code=403,
                content={
                    "success": False, 
                    "message": quality_msg, 
                    "plan": user.plan,
                    "allowed_qualities": ["720p"] if user.plan == "free" or user.plan == "pro" 
                                          else (["720p", "1080p", "2K"] if user.plan == "pro_plus" 
                                          else ["720p", "1080p", "2K", "4K"])
                }
            )
        
        # 7. Save uploaded files
        photo_ext = photo.filename.split('.')[-1]
        video_ext = reference_video.filename.split('.')[-1]
        
        photo_path = os.path.join(UPLOAD_DIR, f"photo_{uuid.uuid4()}.{photo_ext}")
        video_path = os.path.join(UPLOAD_DIR, f"video_{uuid.uuid4()}.{video_ext}")
        
        with open(photo_path, "wb") as f:
            f.write(await photo.read())
        with open(video_path, "wb") as f:
            f.write(await reference_video.read())
        
        # 8. Generate video with model
        output_path, output_filename = await generate_with_model(
            photo_path, video_path, duration, quality
        )
        
        # 9. Decrease quota
        user.video_quota -= 1
        db.commit()
        
        # 10. Clean up uploaded files
        os.remove(photo_path)
        os.remove(video_path)
        
        # 11. Return response
        return JSONResponse(
            content={
                "success": True,
                "video_url": f"/api/ai/video/download/{output_filename}",
                "video_id": output_filename.replace(".mp4", ""),
                "duration": duration,
                "quality": quality,
                "remaining_quota": user.video_quota,
                "plan": user.plan,
                "message": "Video generated successfully!",
                "timestamp": datetime.utcnow().isoformat()
            }
        )
        
    except Exception as e:
        logging.error(f"Video generation error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": str(e)}
        )

# ============= DOWNLOAD VIDEO =============
@router.get("/download/{video_id}")
async def download_video(video_id: str):
    """Download generated video"""
    video_path = os.path.join(OUTPUT_DIR, f"{video_id}.mp4")
    
    if not os.path.exists(video_path):
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Video not found"}
        )
    
    return FileResponse(
        video_path,
        media_type="video/mp4",
        filename=f"{video_id}.mp4"
    )

# ============= GET VIDEO STATUS =============
@router.get("/status/{video_id}")
async def video_status(video_id: str):
    """Check video generation status"""
    video_path = os.path.join(OUTPUT_DIR, f"{video_id}.mp4")
    
    return JSONResponse({
        "success": True,
        "video_id": video_id,
        "status": "completed" if os.path.exists(video_path) else "processing",
        "url": f"/api/ai/video/download/{video_id}" if os.path.exists(video_path) else None
    })

# ============= GET USER QUOTA =============
@router.get("/quota")
async def get_quota(request: Request, db: Session = Depends(get_db)):
    """Get user's remaining video quota"""
    user = await get_current_user(request, db)
    if not user:
        return JSONResponse(
            status_code=401,
            content={"success": False, "message": "Please login first"}
        )
    
    # Reset quota if needed
    reset_quota_if_needed(user)
    db.commit()
    
    # Get total quota based on plan
    total_quota = {
        "free": 5,
        "pro": 50,
        "pro_plus": 200,
        "ultimate": 999999
    }.get(user.plan, 5)
    
    return JSONResponse({
        "success": True,
        "plan": user.plan,
        "remaining": user.video_quota,
        "total": total_quota,
        "reset_date": user.quota_reset_date.isoformat() if user.quota_reset_date else None
    })

# ============= TEST ENDPOINT =============
@router.get("/test")
async def test():
    return JSONResponse({
        "success": True,
        "message": "AI Video API is working!",
        "endpoints": [
            "POST /generate - Create video from photo + video",
            "GET /download/{video_id} - Download video",
            "GET /status/{video_id} - Check status",
            "GET /quota - Check remaining quota"
        ]
    })
