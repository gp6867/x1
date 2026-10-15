import httpx

OLLAMA_URL = "http://localhost:11434/api/generate"


async def get_ollama_response(message, model="phi3"):

    payload = {
        "model": "phi3",
        "prompt": message,
        "stream": False
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(OLLAMA_URL, json=payload)

    data = response.json()
    return data.get("response", "No response from Ollama")

