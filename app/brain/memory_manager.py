import json
import logging
from .memory_store import save_fact, get_top_facts, save_summary, get_summary

EXTRACTION_PROMPT = """You are an advanced memory extraction AI (like Claude/ChatGPT). Extract structured knowledge from the conversation.

Return ONLY valid JSON:
{
  "facts": [
    {"category": "...", "key": "snake_case", "value": "concise value", "context": "one line", "importance": 0.8}
  ],
  "summary": "2-4 sentence summary of the current chat"
}

CATEGORIES:
- "personal": name, family, relationships
- "preference": likes, dislikes
- "project": what they are building (e.g., MonsterX AI)
- "tech": frameworks, tools
- "goal": short/long term goals
- "fact": other permanent facts

RULES:
1. IMPORTANCE SCORE (0.0 to 1.0): 
   - 0.9-1.0: Core identity (Name, GF name, Company name)
   - 0.7-0.8: Current projects, tech stack
   - 0.4-0.6: Preferences, minor facts
   - 0.0-0.3: Trivial/one-off things
2. RESOLVE PRONOUNS: If "vo/woh" refers to someone, use their name.
3. ONLY extract if user states something new or corrects an old fact.
4. Skip greetings and small talk.

Previous Summary:
{previous_summary}

Conversation:
{conversation}

JSON Output:"""

async def _call_llm(client, model, prompt: str) -> str:
    response = await client.chat.completions.create(
        model=model, messages=[{"role": "user", "content": prompt}], max_tokens=800, temperature=0.1
    )
    if response.choices and response.choices[0].message:
        return (response.choices[0].message.content or "").strip()
    return ""

def _parse_json(raw: str) -> dict:
    if not raw: return {}
    text = raw.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"): text = text[4:]
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end == -1: return {}
    try:
        return json.loads(text[start:end + 1])
    except Exception as e:
        logging.warning(f"🧠 JSON parse error: {e}")
        return {}

async def extract_and_save(db, user_id: int, chat_id: str, messages_history: list, previous_summary: str = "", primary_client=None, primary_model=None, fallback_client=None, fallback_model=None):
    try:
        lines = []
        for m in (messages_history or [])[-8:]:
            if isinstance(m, dict) and m.get("role") in ("user", "assistant"):
                c = (m.get("content") or "")[:300]
                if c: lines.append(f"{m['role']}: {c}")
        if not lines: return

        prompt = EXTRACTION_PROMPT.replace("{conversation}", "\n".join(lines)).replace("{previous_summary}", previous_summary or "(none)")
        
        raw = ""
        if primary_client and primary_model:
            try:
                raw = await _call_llm(primary_client, primary_model, prompt)
            except Exception as e:
                if fallback_client and fallback_model:
                    raw = await _call_llm(fallback_client, fallback_model, prompt)

        if not raw: return

        data = _parse_json(raw)
        facts = data.get("facts", [])
        summary = data.get("summary", "").strip()

        saved = 0
        for f in (facts if isinstance(facts, list) else [])[:10]:
            if not isinstance(f, dict): continue
            imp = float(f.get("importance", 0.5))
            if save_fact(db, user_id, f.get("category", "fact"), f.get("key", ""), f.get("value", ""), f.get("context", ""), imp):
                saved += 1

        if summary:
            save_summary(db, user_id, chat_id, summary, messages_covered=len(messages_history or []))

        logging.info(f"🧠 Extracted: {saved} facts")

    except Exception as e:
        logging.error(f"extract_and_save error: {e}")

def build_memory_context(db, user_id: int, chat_id: str = None) -> str:
    """Claude-style Layered Context: Only Top 15 important facts + Current Summary"""
    facts = get_top_facts(db, user_id, limit=15)  # ONLY TOP 15
    summary_row = get_summary(db, chat_id) if chat_id else None
    summary_text = summary_row.summary if summary_row else ""

    if not facts and not summary_text: return ""

    profile_lines = []
    project_lines = []
    other_lines = []

    for f in facts:
        key = f.mem_key.replace("_", " ").title()
        val = f.mem_value
        if len(val) > 150: val = val[:150] + "..."
        
        line = f"  • {key}: {val}"
        if f.category in ["personal", "relationship"]:
            profile_lines.append(line)
        elif f.category in ["project", "tech", "goal"]:
            project_lines.append(line)
        else:
            other_lines.append(line)

    lines = []
    lines.append("=== BACKGROUND MEMORY (DO NOT IGNORE, BUT DO NOT FORCE) ===")
    lines.append("⚠️ ONLY use these facts if the user's CURRENT question directly relates to them. Do NOT assume they are asking about old projects.")
    lines.append("")
    
    if profile_lines:
        lines.append("[USER PROFILE]")
        lines.extend(profile_lines)
        lines.append("")
    
    if project_lines:
        lines.append("[CURRENT PROJECTS & TECH]")
        lines.extend(project_lines)
        lines.append("")
        
    if other_lines:
        lines.append("[OTHER PREFERENCES]")
        lines.extend(other_lines)
        lines.append("")

    if summary_text:
        lines.append("=== CURRENT CHAT SUMMARY (PRIORITY) ===")
        lines.append(summary_text)
        lines.append("")
        
    return "\n".join(lines)[:2500]  # Hard cap at 2500 chars to prevent context overflow
