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
- "personal": name, age, city, family, relationships (girlfriend/boyfriend/family members + names)
- "preference": likes, dislikes, favorite food/music/style, hobbies
- "project": projects user is building (name, purpose, current stage)
- "tech": tech stack, frameworks, databases, tools, providers (e.g. FastAPI, Supabase, Groq)
- "decision": architectural or strategic decisions made
- "goal": short-term and long-term goals (business, career, personal)
- "task": ongoing TODOs, pending work
- "code": key code architecture, patterns, function names, approaches (NOT raw code — extract what it does)
- "business": business model, revenue, marketing, customers, pricing, ad budget
- "learning": what user is currently learning
- "relationship": relationship dynamics (e.g. GF doesn't love user back)

RULES:
1. Extract ONLY what's explicitly stated or clearly implied. Don't invent.
2. RESOLVE PRONOUNS: if "vo"/"woh"/"uska" refers to a person already mentioned, use their name.
3. Use English snake_case keys. Values can be in user's language (English/Hindi/Hinglish).
4. Update existing facts if new info conflicts (e.g. user changed project name).
5. Summary: 2-4 sentences. Focus on: current project state, decisions, next steps, active issues.
6. Skip greetings, small talk, one-off questions.
7. Return [] for facts if nothing new. Return "" for summary if not enough context.

EXAMPLES:

Msg: "Meri GF ka naam Kripa hai"
facts: [{"category":"personal","key":"girlfriend_name","value":"Kripa","context":"User's girlfriend"}]

Msg: "Vo hai na mujhse pyar nahi karti" (prev: Kripa=GF)
facts: [{"category":"relationship","key":"girlfriend_love_status","value":"Kripa does not love the user","context":"Ongoing"}]
summary: "User is discussing relationship with Kripa. Kripa doesn't love them back."

Msg: "I'm building a FastAPI backend with Groq AI and deploying on Render"
facts: [
  {"category":"project","key":"backend_framework","value":"FastAPI"},
  {"category":"tech","key":"ai_provider","value":"Groq"},
  {"category":"tech","key":"deployment","value":"Render"}
]

Msg: "Mujhe ads chalane hain Google par 300 rupaye budget se 3 din ke liye"
facts: [{"category":"business","key":"ad_plan","value":"Google ads, ₹300 budget, 3 days"}]

Msg: "Switch karta hoon gemini-3.8-flash par kyunki 2.0 deprecated hai"
facts: [{"category":"decision","key":"gemini_model","value":"Using gemini-3.8-flash (2.0 deprecated)"}]

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
        # Build conversation excerpt (last 10 messages, truncated)
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
    """Full memory context — grouped by category + chat summary"""
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

    lines = ["=== USER MEMORY (persistent across chats) ==="]
    lines.append("Use these facts to resolve pronouns (vo/woh/uska/he/she) and maintain continuity.")
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
        lines.append("=== CURRENT CHAT SUMMARY ===")
        lines.append(summary_text)
        lines.append("=== END SUMMARY ===")
        lines.append("")

    lines.append("=== END USER MEMORY ===")
    return "\n".join(lines)
