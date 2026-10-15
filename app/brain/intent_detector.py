def detect_intent(message: str):

    msg = message.lower()

    casual_words = [
        "hi", "hello", "hey",
        "kya", "kaise", "hal", "haal",
        "namaste", "bhai"
    ]

    tech_words = [
        "code", "bug", "error",
        "api", "python", "server"
    ]

    if any(word in msg for word in tech_words):
        return "technical"

    if any(word in msg for word in casual_words):
        return "casual"

    return "general"

