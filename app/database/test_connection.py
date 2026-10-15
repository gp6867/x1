from db import SessionLocal, engine
from sqlalchemy import text

try:
    # Method 1: Engine se direct connection
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("✅ Method 1: Engine connected successfully!")
    
    # Method 2: Session se connection
    db = SessionLocal()
    result = db.execute(text("SELECT 1"))
    print("✅ Method 2: Session connected successfully!")
    db.close()
    
except Exception as e:
    print(f"❌ Connection failed: {e}")
