import asyncio

async def get_deepseek_response(message: str) -> str:
    """
    Simulated async DeepSeek API call
    """
    await asyncio.sleep(0.5)  # simulate network delay
    return f"[DeepSeek simulated reply]: {message}"
