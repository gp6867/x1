import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    APP_NAME = "Monster AI"

    # APIs (future use)
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

settings = Settings()
