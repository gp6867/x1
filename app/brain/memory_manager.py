# app/brain/memory_manager.py
import json
import logging
from .memory_store import save_fact, get_all_facts, save_summary, get_summary

EXTRACTION_PROMPT = """You are a memory extraction AI for an AI chatbot. Analyze the conversation and extract:

1. **Facts** — structured knowledge about the user
2. **Summary** — running summary of this conversation (topic, decisions, next steps)

Return ONLY valid JSON, no markdown fences, no explanation:

{
  "facts": [
    {"category": "...", "key": "snake_case_key", "value": "concise value", "context": "one-line"}
  ],
  "summary": "2-4 sentence summary focusing on: current project/task, key decisions, ongoing issues, next steps"
}

CATEGORIES (pick exactly one per fact):
- "personal": name, age, city, family, relationships
- "preference": likes, dislikes, hobbies
- "project": projects user is building
- "tech": tech stack, frameworks, tools
- "decision": architectural or strategic decisions
- "goal": short-term and long-term goals
- "task": ongoing TODOs, pending work
- "code": key code architecture, patterns
- "business": business model, revenue, marketing
- "learning": what user is currently learning
- "relationship": relationship dynamics

RULES:
1. Extract ONLY what's explicitly stated or clearly implied. Don't invent.
2. RESOLVE PRONOUNS: if "vo"/"woh"/"uska" refers to a person already mentioned, use their name.
3. Use English snake_case keys. Values can be in user's language.
4. Update existing facts if new info conflicts.
5. Skip greetings, small talk, one-off questions.
6. Return [] for facts if nothing new. Return "" for summary if not enough context.

Previous summary (update this if provided):
{previous_summary}

Recent conversation:
{conversation}

Extract now (JSON only):"""


async def _call_llm(client, model, prompt: str) -> str:
    response = await client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=800,
        temperature=0.2
    )
    if response.choices and response.choices[0].message:
        return (response.choices[0].message.content or "").strip()
    return ""


def _parse_json(raw: str) -> dict:
    if not raw:
        return {}
    text = raw.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
        text = text.strip()
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end == -1:
        return {}
    try:
        return json.loads(text[start:end + 1])
    except Exception as e:
        logging.warning(f"🧠 JSON parse error: {e}")
        return {}


async def extract_and_save(
    db,
    user_id: int,
    chat_id: str,
    messages_history: list,
    previous_summary: str = "",
    primary_client=None,
    primary_model: str = None,
    fallback_client=None,
    fallback_model: str = None,
):
    """Unified extraction: facts + summary in one LLM call"""
    try:
        lines = []
        for m in (messages_history or [])[-10:]:
            if isinstance(m, dict) and m.get("role") in ("user", "assistant"):
                c = (m.get("content") or "")[:400]
                if c:
                    lines.append(f"{m['role']}: {c}")
        if not lines:
            return
        conversation = "\n".join(lines)

        prompt = EXTRACTION_PROMPT.replace(
            "{conversation}", conversation
        ).replace(
            "{previous_summary}", previous_summary or "(none)"
        )

        raw = ""
        if primary_client and primary_model:
            try:
                raw = await _call_llm(primary_client, primary_model, prompt)
            except Exception as e:
                logging.warning(f"🧠 Extraction primary failed: {e}")
                if fallback_client and fallback_model:
                    try:
                        raw = await _call_llm(fallback_client, fallback_model, prompt)
                    except Exception as e2:
                        logging.error(f"🧠 Extraction fallback failed: {e2}")
                        return

        if not raw:
            return

        data = _parse_json(raw)
        facts = data.get("facts", [])
        summary = data.get("summary", "").strip()

        # Save facts
        saved = 0
        for f in (facts if isinstance(facts, list) else [])[:15]:
            if not isinstance(f, dict):
                continue
            if save_fact(
                db, user_id,
                f.get("category", "fact"),
                f.get("key", ""),
                f.get("value", ""),
                f.get("context", "")
            ):
                saved += 1

        # Save summary
        if summary:
            save_summary(
                db, user_id, chat_id, summary,
                messages_covered=len(messages_history or [])
            )

        logging.info(f"🧠 Extracted: {saved} facts, summary_len={len(summary)}")

    except Exception as e:
        logging.error(f"extract_and_save error: {e}")


def build_memory_context(db, user_id: int, chat_id: str = None) -> str:
    """Full memory context — strictly separated into Global Facts and Current Chat Summary"""
    facts = get_all_facts(db, user_id, limit=100)
    summary_row = get_summary(db, chat_id) if chat_id else None
    summary_text = summary_row.summary if summary_row else ""

    if not facts and not summary_text:
        return ""

    # Group facts by category
    groups = {}
    for f in facts:
        groups.setdefault(f.category, []).append(f)

    # Nice category display order
    order = ["personal", "preference", "relationship", "project", "tech",
             "code", "business", "decision", "goal", "task", "learning", "fact"]

    lines = []
    lines.append("=== BACKGROUND MEMORY (GLOBAL FACTS) ===")
    lines.append("⚠️ USE WITH CAUTION: These are facts from PAST conversations. Only use them if the user's CURRENT question directly relates to them. Do NOT assume the current topic is about these past projects.")
    lines.append("")

    for cat in order:
        if cat not in groups:
            continue
        lines.append(f"[{cat.upper()}]")
        for f in groups[cat]:
            key_disp = f.mem_key.replace("_", " ")
            val = f.mem_value
            if len(val) > 250:
                val = val[:250] + "..."
            lines.append(f"  • {key_disp}: {val}")
        lines.append("")

    if summary_text:
        lines.append("=== CURRENT CHAT SUMMARY (USE THIS TO MAINTAIN CONTINUITY) ===")
        lines.append(summary_text)
        lines.append("")
        
    lines.append("=== REMINDER ===")
    lines.append("Always prioritize the CURRENT conversation history above all else.")
    
    return "\n".join(lines)
