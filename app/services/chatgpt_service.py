import asyncio

async def get_chatgpt_response(message: str) -> str:
    """
    Simulated async ChatGPT API call
    """
    await asyncio.sleep(0.5)  # simulate network delay
    return f"[ChatGPT simulated reply]: {message}"

