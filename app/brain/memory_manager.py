conversation_memory = {}

def get_memory(user_id: str):
    return conversation_memory.get(user_id, "")

def update_memory(user_id: str, user_msg: str, ai_msg: str):
    old = conversation_memory.get(user_id, "")
    new_memory = old + f"\nUser: {user_msg}\nAssistant: {ai_msg}"
    conversation_memory[user_id] = new_memory[-4000:]
