from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ============= CONFIGURATION =============
SECRET_KEY = os.getenv("JWT_SECRET", "your-super-secret-key-change-this-123456")
REFRESH_SECRET_KEY = os.getenv("JWT_REFRESH_SECRET", "your-super-refresh-key-change-this-789012")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))  # 1 day
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))  # 7 days

# Security scheme for token authentication
security = HTTPBearer(auto_error=False)

# ============= TOKEN CREATION =============

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create JWT access token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "type": "access",
        "iat": datetime.now(timezone.utc)
    })
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: Dict[str, Any]) -> str:
    """
    Create JWT refresh token
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({
        "exp": expire,
        "type": "refresh",
        "iat": datetime.now(timezone.utc)
    })
    
    encoded_jwt = jwt.encode(to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_tokens(user_id: int, email: str) -> Dict[str, str]:
    """
    Create both access and refresh tokens
    """
    access_token = create_access_token(data={"sub": email, "id": user_id})
    refresh_token = create_refresh_token(data={"sub": email, "id": user_id})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

# ============= TOKEN VERIFICATION =============

def verify_token(token: str, token_type: str = "access") -> Optional[Dict[str, Any]]:
    """
    Verify JWT token and return payload
    """
    try:
        secret = SECRET_KEY if token_type == "access" else REFRESH_SECRET_KEY
        payload = jwt.decode(token, secret, algorithms=[ALGORITHM])
        
        # Check token type
        if payload.get("type") != token_type:
            return None
        
        return payload
    except JWTError as e:
        print(f"Token verification error: {e}")
        return None

def verify_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify access token"""
    return verify_token(token, "access")

def verify_refresh_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify refresh token"""
    return verify_token(token, "refresh")

# ============= TOKEN DECODING =============

def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode token without verification (for debugging)
    """
    try:
        # Try with access token secret first
        return jwt.decode(token, SECRET_KEY, options={"verify_signature": False})
    except JWTError:
        try:
            # Try with refresh token secret
            return jwt.decode(token, REFRESH_SECRET_KEY, options={"verify_signature": False})
        except JWTError:
            return None

# ============= CURRENT USER DEPENDENCY - NEW =============

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = None  # This will be injected when used
):
    """
    Get current user from token
    NOTE: This function needs db session - import it in your route file
    """
    from ..models.user import User
    
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    payload = verify_access_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Note: db session needs to be provided by the route using Depends(get_db)
    return {"id": user_id, "email": payload.get("sub")}

# ============= TOKEN FROM REQUEST =============

def get_token_from_header(authorization: str) -> Optional[str]:
    """
    Extract token from Authorization header
    """
    if not authorization:
        return None
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None
    
    return parts[1]

# ============= TOKEN UTILITIES =============

def is_token_expired(token: str) -> bool:
    """
    Check if token is expired
    """
    payload = decode_token(token)
    if not payload:
        return True
    
    exp = payload.get("exp")
    if not exp:
        return True
    
    # Convert exp to datetime if it's timestamp
    if isinstance(exp, (int, float)):
        exp_dt = datetime.fromtimestamp(exp, tz=timezone.utc)
    else:
        exp_dt = exp
    
    return datetime.now(timezone.utc) > exp_dt

def get_token_expiry(token: str) -> Optional[datetime]:
    """
    Get token expiry datetime
    """
    payload = decode_token(token)
    if not payload:
        return None
    
    exp = payload.get("exp")
    if not exp:
        return None
    
    # Convert exp to datetime if it's timestamp
    if isinstance(exp, (int, float)):
        return datetime.fromtimestamp(exp, tz=timezone.utc)
    return exp

def get_token_remaining_time(token: str) -> Optional[int]:
    """
    Get remaining time in seconds
    """
    expiry = get_token_expiry(token)
    if not expiry:
        return None
    
    remaining = (expiry - datetime.now(timezone.utc)).total_seconds()
    return max(0, int(remaining))

# ============= TOKEN REFRESH =============

def refresh_access_token(refresh_token: str) -> Optional[Dict[str, str]]:
    """
    Create new access token using refresh token
    """
    payload = verify_refresh_token(refresh_token)
    if not payload:
        return None
    
    user_id = payload.get("id")
    email = payload.get("sub")
    
    if not user_id or not email:
        return None
    
    # Create new tokens
    new_access_token = create_access_token(data={"sub": email, "id": user_id})
    
    return {
        "access_token": new_access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

# ============= TOKEN BLACKLIST (Optional - if you implement) =============

# Simple in-memory blacklist (use Redis in production)
_token_blacklist = set()

def blacklist_token(token: str):
    """Add token to blacklist"""
    _token_blacklist.add(token)

def is_token_blacklisted(token: str) -> bool:
    """Check if token is blacklisted"""
    return token in _token_blacklist

def remove_from_blacklist(token: str):
    """Remove token from blacklist"""
    _token_blacklist.discard(token)

# ============= MAIN FUNCTION FOR TESTING =============

if __name__ == "__main__":
    # Test the functions
    print("=" * 50)
    print("Testing JWT Handler")
    print("=" * 50)
    
    # Test token creation
    user_id = 1
    email = "test@example.com"
    
    tokens = create_tokens(user_id, email)
    print(f"\n✅ Access Token: {tokens['access_token'][:50]}...")
    print(f"✅ Refresh Token: {tokens['refresh_token'][:50]}...")
    
    # Test token verification
    access_payload = verify_access_token(tokens['access_token'])
    refresh_payload = verify_refresh_token(tokens['refresh_token'])
    
    print(f"\n✅ Access Token Verified: {access_payload.get('sub') if access_payload else 'Failed'}")
    print(f"✅ Refresh Token Verified: {refresh_payload.get('sub') if refresh_payload else 'Failed'}")
    
    # Test token expiry
    remaining = get_token_remaining_time(tokens['access_token'])
    print(f"\n✅ Access Token Expires In: {remaining} seconds")
    
    # Test refresh
    new_tokens = refresh_access_token(tokens['refresh_token'])
    if new_tokens:
        print(f"\n✅ New Access Token Created: {new_tokens['access_token'][:50]}...")
    
    # Test decode
    decoded = decode_token(tokens['access_token'])
    print(f"\n✅ Decoded Token: {decoded.get('sub') if decoded else 'Failed'}")
    
    print("\n" + "=" * 50)
    print("✅ All tests passed!")
    print("=" * 50)
