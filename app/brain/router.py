import asyncio
import random
from app.services.chatgpt_service import get_chatgpt_response
from app.services.deepseek_service import get_deepseek_response

async def decide_model(message: str) -> str:

    # Run both models in parallel (FAST)
    chatgpt_reply, deepseek_reply = await asyncio.gather(
        get_chatgpt_response(message),
        get_deepseek_response(message)
    )

    choice = random.choice(["chatgpt", "deepseek", "mix"])

    if choice == "chatgpt":
        return chatgpt_reply
    elif choice == "deepseek":
        return deepseek_reply
    else:
        return f"{chatgpt_reply}\n\n---\n\n{deepseek_reply}"

