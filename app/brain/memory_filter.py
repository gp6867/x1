# app/brain/memory_filter.py
# Trigger detection — kab extraction chalani hai

import re

# Strong triggers — pakka extract
STRONG_TRIGGERS = [
    r"\bmy name is\b", r"\bmera naam\b", r"\bi am\b", r"\bi'?m\b",
    r"\bi work\b", r"\bi live\b", r"\bi study\b",
    r"\bmeri girlfriend\b", r"\bmera boyfriend\b",
    r"\bmy girlfriend\b", r"\bmy boyfriend\b",
    r"\bmeri wife\b", r"\bmera husband\b",
    r"\bmy wife\b", r"\bmy husband\b",
    r"\bmeri mom\b", r"\bmera mom\b", r"\bmera dad\b", r"\bmera bhai\b", r"\bmeri behen\b",
    r"\bmy mom\b", r"\bmy dad\b", r"\bmy brother\b", r"\bmy sister\b",
    r"\bremember\b", r"\byaad rakh\b", r"\byaad rakhna\b",
    r"\bi love\b", r"\bi hate\b", r"\bmujhe pasand\b", r"\bmujhe nahi pasand\b",
    r"\bcall me\b", r"\bmujhe bulao\b",
]

# Weak triggers — pronoun use ho raha hai, memory check karo
PRONOUN_TRIGGERS = [
    r"\bvo\b", r"\bwoh\b", r"\bwo\b",
    r"\buska\b", r"\buski\b", r"\busse\b", r"\bunka\b", r"\bunki\b",
    r"\bhe\b", r"\bshe\b", r"\bhis\b", r"\bher\b", r"\bhim\b",
    r"\bthat person\b", r"\bthat guy\b", r"\bthat girl\b",
    r"\bthe person\b",
]


def needs_extraction(message: str) -> bool:
    """Kya message mein naya fact ho sakta hai?"""
    if not message:
        return False
    text = message.lower()
    for pattern in STRONG_TRIGGERS:
        if re.search(pattern, text):
            return True
    return False


def needs_context_resolution(message: str) -> bool:
    """Pronoun use ho raha hai — memory zaroori hai"""
    if not message:
        return False
    text = message.lower()
    for pattern in PRONOUN_TRIGGERS:
        if re.search(pattern, text):
            return True
    return False
