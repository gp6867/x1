from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
import string
import logging
import json
import os
import traceback
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config

from ..database.db import get_db
from ..models.user import User
from ..models.otp import OTP
from ..models.session import Session as UserSession
from ..utils.jwt_handler import create_tokens, verify_token, verify_refresh_token
from ..core.security import get_password_hash, verify_password
from ..services.email_service import send_otp_email

# Google OAuth Setup
config = Config('.env')
oauth = OAuth(config)

oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

router = APIRouter()

# Constants
MAX_FORGOT_ATTEMPTS = 3
OTP_EXPIRY_MINUTES = 10
MAX_OTP_ATTEMPTS = 3

def generate_otp():
    """Generate 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))

def get_utc_now():
    """Get current UTC datetime without timezone"""
    return datetime.utcnow()

def _naive_dt(dt):
    """Safe helper — timezone-aware datetime ko naive banao"""
    if dt is None:
        return None
    if dt.tzinfo is not None:
        return dt.replace(tzinfo=None)
    return dt

# ============= REGISTER (AUTO-LOGIN) =============
@router.post("/register")
async def register(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
        email = data.get("email")
        password = data.get("password")
        name = data.get("name", "")

        if not email or not password:
            return {"success": False, "message": "Email and password required"}

        if len(password) < 6:
            return {"success": False, "message": "Password must be at least 6 characters"}

        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            return {"success": False, "message": "User already exists"}

        hashed_password = get_password_hash(password)
        new_user = User(
            email=email,
            password=hashed_password,
            name=name,
            is_verified=True
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # ✅ AUTO-LOGIN: token create karke session save karein
        tokens = create_tokens(new_user.id, new_user.email)
        expires_at = get_utc_now() + timedelta(days=7)
        session = UserSession(
            user_id=new_user.id,
            token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            expires_at=expires_at
        )
        db.add(session)
        db.commit()

        return {
            "success": True,
            "message": "Registration successful.",
            "token": tokens["access_token"],
            "refreshToken": tokens["refresh_token"],
            "user": {
                "id": new_user.id,
                "email": new_user.email,
                "name": new_user.name,
                "is_verified": new_user.is_verified
            }
        }

    except Exception as e:
        logging.error(f"Register error: {e}")
        traceback.print_exc()
        return {"success": False, "message": "Server error"}

# ============= LOGIN =============
@router.post("/login")
async def login(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
        email = data.get("email")
        password = data.get("password")

        user = db.query(User).filter(User.email == email).first()

        if not user:
            return {"success": False, "message": "Invalid credentials"}

        if not user.is_verified:
            return {"success": False, "message": "Please verify your email first"}

        if not verify_password(password, user.password):
            return {"success": False, "message": "Invalid credentials"}

        tokens = create_tokens(user.id, user.email)
        
        expires_at = get_utc_now() + timedelta(days=7)
        session = UserSession(
            user_id=user.id,
            token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            expires_at=expires_at
        )
        db.add(session)
        db.commit()

        return {
            "success": True,
            "message": "Login successful",
            "token": tokens["access_token"],
            "refreshToken": tokens["refresh_token"],
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "is_verified": user.is_verified
            }
        }

    except Exception as e:
        logging.error(f"Login error: {e}")
        traceback.print_exc()
        return {"success": False, "message": "Server error"}

# ============= FORGOT PASSWORD (FIXED) =============
@router.post("/forgot-password")
async def forgot_password(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
        email = data.get("email")

        user = db.query(User).filter(User.email == email).first()
        if not user:
            # Security: don't reveal if email exists
            return {"success": True, "message": "If email exists, OTP sent"}

        now = get_utc_now()

        # ✅ FIX 1: Safe None handling — naye user par crash nahi hoga
        attempts = user.forgot_password_attempts or 0

        if attempts >= MAX_FORGOT_ATTEMPTS:
            # ✅ FIX 2: Timezone-safe comparison
            last_time = _naive_dt(user.last_forgot_password)
            if last_time and (now - last_time) < timedelta(hours=24):
                return {
                    "success": False,
                    "message": "Too many attempts. Try after 24 hours."
                }
            user.forgot_password_attempts = 0

        # Purane unused reset OTPs delete karein
        db.query(OTP).filter(
            OTP.email == email,
            OTP.type == "reset",
            OTP.used == False
        ).delete()
        db.commit()

        otp = generate_otp()
        expires_at = now + timedelta(minutes=OTP_EXPIRY_MINUTES)

        logging.info(f"🔐 FORGOT PASSWORD — generating OTP for {email}")
        logging.info(f"⏰ Expires at: {expires_at} UTC")

        otp_record = OTP(
            email=email,
            otp=otp,
            type="reset",
            expires_at=expires_at,
            attempts=0,
            max_attempts=MAX_OTP_ATTEMPTS,
            used=False
        )
        db.add(otp_record)
        user.forgot_password_attempts = attempts + 1
        user.last_forgot_password = now
        db.commit()
        db.refresh(otp_record)

        # ✅ FIX 3: Email send ka result actually check karein
        email_sent = await send_otp_email(email, otp, "reset")

        if not email_sent:
            logging.error(f"❌ OTP email delivery FAILED for {email}")
            # ✅ FIX 4: Email fail hone par attempt rollback — user unjustly blocked na ho
            try:
                db.delete(otp_record)
                user.forgot_password_attempts = max(0, attempts)  # rollback to original
                user.last_forgot_password = None if attempts == 0 else user.last_forgot_password
                db.commit()
            except Exception as rollback_err:
                logging.error(f"Rollback error: {rollback_err}")
                db.rollback()

            return {
                "success": False,
                "message": "Unable to send OTP email right now. Please try again in a moment."
            }

        logging.info(f"✅ OTP sent successfully to {email}")

        return {"success": True, "message": "OTP sent successfully"}

    except Exception as e:
        logging.error(f"Forgot password error: {e}")
        traceback.print_exc()
        return {"success": False, "message": "Server error"}

# ============= RESET PASSWORD (FIXED) =============
@router.post("/reset-password")
async def reset_password(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
        email = data.get("email")
        otp = data.get("otp")
        new_password = data.get("newPassword")

        # ✅ FIX 5: Password validation
        if not new_password or len(new_password) < 6:
            return {
                "success": False,
                "message": "Password must be at least 6 characters"
            }

        now = get_utc_now()
        
        otp_record = db.query(OTP).filter(
            OTP.email == email,
            OTP.type == "reset",
            OTP.used == False,
            OTP.otp == otp
        ).first()

        if not otp_record:
            return {"success": False, "message": "Invalid OTP"}

        # ✅ FIX 6: Timezone-safe expiry check
        expires = _naive_dt(otp_record.expires_at)
        if expires is None or now > expires:
            db.delete(otp_record)
            db.commit()
            return {"success": False, "message": "OTP expired"}

        user = db.query(User).filter(User.email == email).first()
        if not user:
            return {"success": False, "message": "User not found"}

        user.password = get_password_hash(new_password)
        user.forgot_password_attempts = 0
        user.last_forgot_password = None  # ✅ FIX 7: Reset timestamp too
        db.commit()

        otp_record.used = True
        db.commit()

        # Security: invalidate all sessions
        db.query(UserSession).filter(UserSession.user_id == user.id).delete()
        db.commit()

        logging.info(f"✅ Password reset successful for {email}")

        return {
            "success": True, 
            "message": "Password reset successfully! Please login with your new password."
        }

    except Exception as e:
        logging.error(f"Reset password error: {e}")
        traceback.print_exc()
        return {"success": False, "message": "Server error"}

# ============= LOGOUT =============
@router.post("/logout")
async def logout(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
        refresh_token = data.get("refreshToken")

        if refresh_token:
            db.query(UserSession).filter(UserSession.refresh_token == refresh_token).delete()
            db.commit()

        return {"success": True, "message": "Logged out successfully"}

    except Exception as e:
        logging.error(f"Logout error: {e}")
        return {"success": False, "message": "Server error"}

# ============= REFRESH TOKEN =============
@router.post("/refresh")
async def refresh_token(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
        refresh_token = data.get("refreshToken")

        if not refresh_token:
            return {"success": False, "message": "Refresh token required"}

        payload = verify_token(refresh_token, "refresh")
        if not payload:
            return {"success": False, "message": "Invalid refresh token"}

        session = db.query(UserSession).filter(
            UserSession.refresh_token == refresh_token,
            UserSession.expires_at > get_utc_now()
        ).first()

        if not session:
            return {"success": False, "message": "Session expired"}

        user = db.query(User).filter(User.id == payload.get("id")).first()
        if not user:
            return {"success": False, "message": "User not found"}

        tokens = create_tokens(user.id, user.email)
        session.token = tokens["access_token"]
        session.refresh_token = tokens["refresh_token"]
        session.expires_at = get_utc_now() + timedelta(days=7)
        db.commit()

        return {
            "success": True,
            "token": tokens["access_token"],
            "refreshToken": tokens["refresh_token"]
        }

    except Exception as e:
        logging.error(f"Refresh token error: {e}")
        traceback.print_exc()
        return {"success": False, "message": "Server error"}

# ============= GOOGLE OAUTH =============
@router.get('/google')
async def google_login(request: Request):
    redirect_uri = os.getenv(
        "GOOGLE_REDIRECT_URI",
        "https://x1-2j5f.onrender.com/api/auth/google/callback"
    )
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get('/google/callback')
async def google_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        
        if not user_info:
            resp = await oauth.google.get('https://openidconnect.googleapis.com/v1/userinfo')
            user_info = resp.json()

        email = user_info.get('email')
        name = user_info.get('name')
        google_id = user_info.get('sub')

        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            user = User(
                email=email,
                name=name,
                google_id=google_id,
                is_verified=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        tokens = create_tokens(user.id, user.email)
        expires_at = get_utc_now() + timedelta(days=7)
        session = UserSession(
            user_id=user.id,
            token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            expires_at=expires_at
        )
        db.add(session)
        db.commit()

        user_data = {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'is_verified': user.is_verified
        }

        frontend_url = os.getenv('FRONTEND_URL', 'https://xoneai.in')
        redirect_url = f"{frontend_url}/oauth-callback?token={tokens['access_token']}&user={json.dumps(user_data)}"
        
        return RedirectResponse(url=redirect_url)

    except Exception as e:
        print(f"❌ Google callback error: {e}")
        traceback.print_exc()
        return JSONResponse({'success': False, 'message': 'Google login failed'})

# ============= APPLE OAUTH (Placeholder) =============
@router.get('/apple')
async def apple_login(request: Request):
    return {"success": False, "message": "Apple login coming soon"}

@router.get('/apple/callback')
async def apple_callback(request: Request):
    return {"success": False, "message": "Apple login coming soon"}

# ============= TEST ENDPOINT =============
@router.get("/test")
async def test():
    return {
        "success": True,
        "message": "Auth API is working",
        "timestamp": str(get_utc_now())
    }
