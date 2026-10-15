import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "phi3"

def stream_generate(prompt: str):
    response = requests.post(
        OLLAMA_URL,
        json={
             "model": "phi3",
            "prompt": prompt,
            "stream": True,
            "options": {
                "num_predict": 300,
                "temperature": 0.4
            }
        },
        stream=True
    )

    for line in response.iter_lines():
        if line:
            data = json.loads(line)
            yield data.get("response", "")
