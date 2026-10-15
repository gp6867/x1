from .model_router import select_model
from .ollama_client import stream_from_ollama
from .intent_detector import detect_intent

def execute_stream(prompt: str):

    intent = detect_intent(prompt)
    model = select_model(intent)

    return stream_from_ollama(model, prompt)
