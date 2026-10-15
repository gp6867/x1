from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ..database.db import get_db
from ..models.user import User
from ..utils.jwt_handler import verify_token
from ..services.razorpay_service import RazorPayService
import logging

router = APIRouter(prefix="/payment", tags=["Payment"])
razorpay_service = RazorPayService()

PLANS = {
    "pro": {"price": 399, "videos": 50, "duration": 10, "quality": "720p"},
    "pro_plus": {"price": 1999, "videos": 200, "duration": 30, "quality": "2K"},
    "ultimate": {"price": 4999, "videos": 999999, "duration": 60, "quality": "4K"}
}

async def get_current_user(request: Request, db: Session):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None
    token = auth_header.replace("Bearer ", "")
    payload = verify_token(token)
    if not payload:
        return None
    return db.query(User).filter(User.id == payload.get("id")).first()

@router.post("/create-order")
async def create_order(request: Request, db: Session = Depends(get_db)):
    """Create RazorPay payment order"""
    try:
        data = await request.json()
        user = await get_current_user(request, db)
        
        if not user:
            return JSONResponse(
                status_code=401,
                content={"success": False, "message": "Please login first"}
            )
        
        plan = data.get("plan")
        if plan not in PLANS:
            return JSONResponse(
                status_code=400,
                content={"success": False, "message": "Invalid plan"}
            )
        
        amount = PLANS[plan]["price"]
        order = razorpay_service.create_order(amount)
        
        return {
            "success": True,
            "order_id": order['id'],
            "amount": amount,
            "currency": "INR",
            "key_id": razorpay_service.key_id
        }
        
    except Exception as e:
        logging.error(f"Create order error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": str(e)}
        )

@router.post("/verify")
async def verify_payment(request: Request, db: Session = Depends(get_db)):
    """Verify payment and upgrade user plan"""
    try:
        data = await request.json()
        user = await get_current_user(request, db)
        
        if not user:
            return JSONResponse(
                status_code=401,
                content={"success": False, "message": "Please login first"}
            )
        
        order_id = data.get("order_id")
        payment_id = data.get("payment_id")
        signature = data.get("signature")
        plan = data.get("plan")
        
        # Verify payment signature
        if not razorpay_service.verify_payment(order_id, payment_id, signature):
            return JSONResponse(
                status_code=400,
                content={"success": False, "message": "Invalid payment signature"}
            )
        
        # Upgrade user plan
        user.plan = plan
        user.video_quota = PLANS[plan]["videos"]
        user.quota_reset_date = datetime.utcnow() + timedelta(days=30)
        db.commit()
        
        return {
            "success": True,
            "message": f"Successfully upgraded to {plan} plan!",
            "plan": user.plan,
            "video_quota": user.video_quota
        }
        
    except Exception as e:
        logging.error(f"Verify error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": str(e)}
        )

@router.get("/test")
async def test():
    return {"success": True, "message": "Payment API working"}
