from app.database.db import engine, Base
from app.models.user import User, Message

# Create all tables
Base.metadata.create_all(bind=engine)

print("Database and tables created successfully!")
