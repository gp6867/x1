# app/brain/memory_filter.py
import re

# Skip these — no memory value
GREETINGS = {
    "hi", "hello", "hey", "ok", "okay", "thanks", "thank you",
    "yes", "no", "hmm", "cool", "nice", "great", "sure",
    "haan", "nahi", "theek", "thik", "hmm", "hn"
}

# Signals — koi meaningful info hai
INFO_SIGNALS = [
    # Personal
    r"\b(my name|mera naam|i am|i'm|i work|i live|i study)\b",
    r"\b(girlfriend|boyfriend|wife|husband|gf|bf|mom|dad|bhai|behen|family)\b",
    r"\b(i love|i hate|i like|mujhe pasand|mujhe nahi pasand)\b",
    r"\b(remember|yaad rakh|call me|bulao)\b",
    # Project / coding
    r"\b(building|developing|creating|making|working on)\b.{0,40}\b(app|project|website|api|bot|tool)\b",
    r"\b(project|repo|codebase|application|startup|product)\b",
    r"\b(bug|error|issue|crash|fix|deploy|deployment)\b",
    r"\b(code|function|class|api|endpoint|database|schema|query)\b",
    # Tech stack
    r"\b(using|built with|powered by|stack|framework|library)\b",
    r"\b(fastapi|django|flask|react|next|node|python|javascript|typescript|postgres|mongodb|redis|supabase)\b",
    r"\b(groq|gemini|openai|claude|anthropic|llama)\b",
    # Business / marketing
    r"\b(business|revenue|customers|users|marketing|ads|advertising|campaign|pricing|budget|profit|launch)\b",
    # Decisions
    r"\b(we decided|i decided|i chose|going with|switch(ing)? to|migrat(e|ing) to|use .* instead)\b",
    # Goals / tasks / plans
    r"\b(want to|plan to|planning to|goal is|aim to|need to|should|have to|trying to|working towards)\b",
    r"\b(todo|task|next step|roadmap|milestone)\b",
    # Learning
    r"\b(learning|studying|trying to understand|figuring out|exploring)\b",
]

# Pronouns — context resolve karna zaroori
PRONOUN_TRIGGERS = [
    r"\bvo\b", r"\bwoh\b", r"\bwo\b", r"\buska\b", r"\buski\b", r"\busse\b",
    r"\bunka\b", r"\bunki\b", r"\bhe\b", r"\bshe\b", r"\bhis\b", r"\bher\b",
    r"\bhim\b", r"\bthat person\b", r"\bthat guy\b", r"\bthat girl\b",
    r"\bthe (person|project|app|tool|thing)\b"
]


def _is_greeting(message: str) -> bool:
    return message.strip().lower() in GREETINGS


def should_extract(message: str) -> bool:
    """Kya message se memory extract karni chahiye?"""
    if not message:
        return False
    text = message.strip()
    if len(text) < 15:
        return False
    if _is_greeting(text):
        return False
    # Very short question without "I/we/my" → skip
    if text.endswith("?") and len(text) < 60 and not re.search(r"\b(i|we|my|our|mujhe|mera|meri|hum)\b", text.lower()):
        return False
    # Long message → likely meaningful
    if len(text) > 80:
        return True
    # Check info signals
    lower = text.lower()
    for pattern in INFO_SIGNALS:
        if re.search(pattern, lower):
            return True
    return False


def has_pronoun(message: str) -> bool:
    """Agar pronoun hai to memory context zaroori hai"""
    if not message:
        return False
    lower = message.lower()
    for pattern in PRONOUN_TRIGGERS:
        if re.search(pattern, lower):
            return True
    return False


# Backward-compat aliases
def needs_extraction(message: str) -> bool:
    return should_extract(message)

def needs_context_resolution(message: str) -> bool:
    return has_pronoun(message)
