# app/brain/memory_manager.py
# Orchestration — extraction, context building

import json
import logging
from .memory_store import save_fact, get_all_facts


EXTRACTION_PROMPT = """You are a memory extraction assistant for an AI chatbot.
Extract structured personal facts about the USER from the conversation below.

Return ONLY a valid JSON array. No markdown fences, no explanation, no extra text.

Each fact object format:
{"category": "person|preference|fact|event|relationship", "key": "short_snake_case_key", "value": "concise value", "context": "one-line context"}

Rules:
1. Extract ONLY facts explicitly stated or clearly implied about the user.
2. RESOLVE PRONOUNS using the conversation context. If "vo" or "woh" refers to a person already mentioned (e.g. girlfriend Kripa), use Kripa's name in the value.
3. Do NOT invent, guess, or assume.
4. If nothing new to remember, return [].
5. Use English snake_case keys. Values can be in user's language (Hindi, Hinglish, English).
6. Categories:
   - "person" = people in user's life (GF, friend, family)
   - "preference" = likes/dislikes
   - "fact" = attributes (name, city, job, age)
   - "event" = specific events/things that happened
   - "relationship" = relationship dynamics

Examples:

Message: "Meri GF ka naam Kripa hai"
→ [{"category":"person","key":"girlfriend_name","value":"Kripa","context":"User's girlfriend is named Kripa"}]

Message: "Vo hai na mujhse pyar nahi karti"
(context: girlfriend = Kripa)
→ [{"category":"relationship","key":"girlfriend_love_status","value":"Kripa does not love the user","context":"User mentioned Kripa doesn't love them"}]

Message: "I work at Google as a backend developer in Bangalore"
→ [{"category":"fact","key":"employer","value":"Google"},{"category":"fact","key":"role","value":"Backend developer"},{"category":"fact","key":"city","value":"Bangalore"}]

Message: "Mujhe biryani bahut pasand hai"
→ [{"category":"preference","key":"favorite_food","value":"Biryani"}]

Conversation:
{conversation}

Extract facts now (JSON array only):"""


async def _run_extraction(client, model, prompt: str) -> str:
    """Ek LLM call — JSON raw text return karta hai"""
    response = await client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
        temperature=0.2
    )
    if response.choices and response.choices[0].message:
        return (response.choices[0].message.content or "").strip()
    return ""


def _parse_facts(raw: str) -> list:
    """LLM output se JSON array nikalo (markdown fences hatayein)"""
    if not raw:
        return []
    text = raw.strip()
    # Markdown fences
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
        text = text.strip()
    # JSON array substring
    start = text.find("[")
    end = text.rfind("]")
    if start == -1 or end == -1 or end <= start:
        return []
    try:
        data = json.loads(text[start:end + 1])
        return data if isinstance(data, list) else []
    except Exception as e:
        logging.warning(f"🧠 Fact JSON parse error: {e}")
        return []


async def extract_and_save_facts(
    db,
    user_id: int,
    user_message: str,
    recent_context: list,
    primary_client,
    primary_model: str,
    fallback_client=None,
    fallback_model: str = None,
):
    """
    LLM se facts extract karke DB mein save karta hai.
    Gemini primary (quota bachata hai), Groq fallback.
    """
    try:
        # Chhota context — last 4 messages + current
        context_lines = []
        for m in (recent_context or [])[-4:]:
            if isinstance(m, dict) and m.get("role") in ("user", "assistant"):
                content = (m.get("content") or "")[:300]
                if content:
                    context_lines.append(f"{m['role']}: {content}")
        context_lines.append(f"user: {user_message[:300]}")
        conversation = "\n".join(context_lines)

        prompt = EXTRACTION_PROMPT.replace("{conversation}", conversation)

        raw = ""
        # Try primary
        try:
            raw = await _run_extraction(primary_client, primary_model, prompt)
        except Exception as e:
            logging.warning(f"🧠 Extraction primary failed: {e}")
            if fallback_client and fallback_model:
                try:
                    raw = await _run_extraction(fallback_client, fallback_model, prompt)
                except Exception as e2:
                    logging.error(f"🧠 Extraction fallback failed too: {e2}")
                    return []

        if not raw:
            return []

        facts = _parse_facts(raw)
        if not facts:
            logging.info("🧠 No new facts to save")
            return []

        saved = []
        for f in facts[:10]:
            if not isinstance(f, dict):
                continue
            cat = f.get("category", "fact")
            key = f.get("key", "")
            val = f.get("value", "")
            ctx = f.get("context", "")
            if key and val:
                result = save_fact(db, user_id, cat, key, val, ctx)
                if result:
                    saved.append(result)

        logging.info(f"🧠 Extracted & saved {len(saved)} facts")
        return saved

    except Exception as e:
        logging.error(f"extract_and_save_facts error: {e}")
        return []


def build_memory_context(db, user_id: int) -> str:
    """
    Prompt mein inject karne ke liye formatted memory.
    """
    facts = get_all_facts(db, user_id, limit=50)
    if not facts:
        return ""

    lines = ["=== KNOWN FACTS ABOUT THE USER ==="]
    lines.append("(Use these to resolve pronouns like 'vo', 'woh', 'uska', 'he', 'she' — do NOT ask which person when already known below)")
    lines.append("")

    for f in facts:
        key_display = f.mem_key.replace("_", " ")
        lines.append(f"• {key_display}: {f.mem_value}")

    lines.append("")
    lines.append("=== END FACTS ===")
    return "\n".join(lines)
