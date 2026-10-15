import requests

OLLAMA_URL = "http://localhost:11434/api/generate"


def build_prompt(memory, message):
    """
    Build Monster AI prompt with memory + strict behavior rules
    """

    system_prompt = """
You are Monster AI, an intelligent and helpful assistant.

Rules:
- Remember user information from past conversation.
- If the user asks about their own details (name, work, preferences),
  answer clearly and directly using memory.
- Do NOT give philosophical or long explanations.
- Give short, accurate answers when facts are known.
- Be natural, confident, and helpful.
"""

    conversation = ""

    # Add previous conversation memory
    for msg in memory:
        role = msg["role"]
        content = msg["content"]
        conversation += f"{role}: {content}\n"

    # Add latest user message
    conversation += f"user: {message}\nassistant:"

    return system_prompt + "\n\n" + conversation


def ask_ollama(model: str, message: str, memory):
    """
    Send prompt to Ollama and return response
    """

    prompt = build_prompt(memory, message)

    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }

    response = requests.post(OLLAMA_URL, json=payload)

    # Safety check
    if response.status_code != 200:
        return "Model error: Ollama not responding"

    data = response.json()
    return data.get("response", "No response from model")
