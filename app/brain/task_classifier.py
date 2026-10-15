# task_classifier.py

def task_weight(intent, message):
    """
    Decide how heavy the task is.
    Returns numeric cost instead of text.
    """

    message = message.lower()

    # Heavy tasks
    if intent in ["code", "analysis", "reasoning"]:
        return 5

    # Medium tasks
    if len(message) > 80:
        return 3

    # Light tasks
    return 1

