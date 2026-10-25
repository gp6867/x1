from datetime import datetime, date, timedelta
from sqlalchemy.orm import Session
import logging
from ..models.user_usage import UserUsage

PLAN_LIMITS = {
    "free":    {"daily": 30,  "hourly": 15},
    "starter": {"daily": 60,  "hourly": 20},
    "pro":     {"daily": 80,  "hourly": 25},
    "ultra":   {"daily": 120, "hourly": 30},
}

_hourly_tracker = {}


def get_user_plan(user) -> str:
    plan = getattr(user, "plan", None) or "free"
    return plan if plan in PLAN_LIMITS else "free"


def check_daily_limit(db: Session, user_id: int, plan: str) -> tuple:
    limits = PLAN_LIMITS[plan]
    today = date.today()
    usage = db.query(UserUsage).filter(
        UserUsage.user_id == user_id,
        UserUsage.usage_date == today
    ).first()
    used = usage.messages_count if usage else 0
    limit = limits["daily"]
    if used >= limit:
        return (False, used, limit, "midnight_utc")
    return (True, used, limit, None)


def check_hourly_limit(user_id: int, plan: str) -> tuple:
    limits = PLAN_LIMITS[plan]
    now = datetime.utcnow()
    cutoff = now - timedelta(hours=1)
    timestamps = _hourly_tracker.get(user_id, [])
    timestamps = [t for t in timestamps if t > cutoff]
    used = len(timestamps)
    limit = limits["hourly"]
    if used >= limit:
        _hourly_tracker[user_id] = timestamps
        return (False, used, limit)
    timestamps.append(now)
    _hourly_tracker[user_id] = timestamps
    return (True, used, limit)


def increment_usage(db: Session, user_id: int, model: str = None):
    today = date.today()
    usage = db.query(UserUsage).filter(
        UserUsage.user_id == user_id,
        UserUsage.usage_date == today
    ).first()
    if not usage:
        usage = UserUsage(user_id=user_id, usage_date=today, messages_count=1)
        db.add(usage)
    else:
        usage.messages_count = (usage.messages_count or 0) + 1
    if model == "gemini":
        usage.gemini_count = (usage.gemini_count or 0) + 1
    elif model == "sonnet":
        usage.sonnet_count = (usage.sonnet_count or 0) + 1
    elif model == "haiku":
        usage.haiku_count = (usage.haiku_count or 0) + 1
    db.commit()
    logging.info(f"📊 Usage incremented: user={user_id}, total_today={usage.messages_count}")
    return usage


def get_usage_stats(db: Session, user_id: int) -> dict:
    today = date.today()
    usage = db.query(UserUsage).filter(
        UserUsage.user_id == user_id,
        UserUsage.usage_date == today
    ).first()
    return {
        "date": str(today),
        "messages_used": usage.messages_count if usage else 0,
        "gemini_used": usage.gemini_count if usage else 0,
        "sonnet_used": usage.sonnet_count if usage else 0,
        "haiku_used": usage.haiku_count if usage else 0,
    }
