# app/brain/memory_filter.py

IMPORTANT_KEYWORDS = [
    "my name is",
    "i am",
    "i work",
    "i love",
    "my girlfriend",
    "my boyfriend",
    "remember",
    "call me",
    "i live",
    "i study"
]


def should_store_memory(message: str) -> bool:
    """
    Decide if message is important enough
    to store in long-term memory.
    """

    message = message.lower()

    for keyword in IMPORTANT_KEYWORDS:
        if keyword in message:
            return True

    return False
