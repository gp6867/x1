# brain/memory_store.py

USER_MEMORY = {}

def load_memory(user_id: str):
    return USER_MEMORY.get(user_id, [])

def save_memory(user_id: str, memory: list):
    USER_MEMORY[user_id] = memory
