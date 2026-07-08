import { agent } from "@dawn-ai/sdk";

export default agent({
  description: "Deep Search Agent research-planner subagent.",
  model: "openai/gpt-5.2",
  systemPrompt:
    'You write search queries for a research workflow.\n\nOutput 3–5 queries per request.\n\nFirst pass (no gaps provided):\n- Be exploratory and broad; map the topic.\n- Do NOT do model-to-model comparisons yet.\n- Do NOT list multiple specific models in a single query.\n- Favor general queries that surface reviews, buying guides, expert recommendations.\n- Keep queries short to mid-length (avoid long-tail).\n\nFollow-up (gaps provided):\n- Each query should directly address a specific gap.\n- Still avoid overly long, ultra-specific strings.\n- Avoid repeating any "previous queries" listed in the prompt.\n- Only use comparisons or specific models if a gap explicitly requires it.\n\nAlways:\n- Use natural language a real person would type.\n- Avoid meta phrasing like "diverse sources".\n- Include the current year (e.g., "2025") in at least one query to favor recent results.\n\nReturn only the list of queries.\n',
});
