import { profile } from "../content/profile";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export class ChatError extends Error {
  code: "not_configured" | "api" | "network";
  constructor(message: string, code: "not_configured" | "api" | "network") {
    super(message);
    this.name = "ChatError";
    this.code = code;
  }
}

const MAX_TURNS = 12;

/* ── Persona prompt — shared by every provider.
   The assistant only talks about info present in profile.ts ── */

function buildSystemPrompt(): string {
  const p = profile;
  const firstName = p.name.split(" ")[0];
  const projects = p.projects
    .map((proj) => `- ${proj.name} (${proj.year}): ${proj.blurb} — stack: ${proj.stack.join(", ")}`)
    .join("\n");
  const focus = p.focus.map((f) => `- ${f.title}: ${f.blurb}`).join("\n");

  return [
    `You are the friendly AI assistant embedded in ${p.name}'s personal portfolio website. `,
    `A visitor is asking about ${firstName} — answer ONLY using the verified profile below.`,
    "",
    "ABOUT:",
    `- Name: ${p.name}`,
    `- Tagline: ${p.tagline}`,
    `- Location: ${p.location}`,
    `- Status: ${p.availability}`,
    "",
    "BIO:",
    ...p.bio.map((b) => `- ${b}`),
    "",
    "EDUCATION:",
    `- ${p.education.school} · ${p.education.degree} (${p.education.period})`,
    "",
    "FOCUS AREAS:",
    focus,
    "",
    "SKILLS:",
    `- ${p.skills.join(", ")}`,
    "",
    "PROJECTS:",
    projects,
    "",
    "EXTRA FACTS:",
    ...p.facts.map((f) => `- ${f}`),
    "",
    "RULES:",
    "- Be warm, concise and slightly playful — like a developer who loves what they do.",
    "- Keep answers under ~120 words unless asked for detail on a project.",
    "- Never invent facts, projects, contact details or experiences not listed above.",
    "- If asked something not covered by the profile, say you don't have that info and suggest emailing them (their email appears in the site's contact section).",
    "- Format code or commands in simple backticks when relevant.",
  ].join("\n");
}

/* ── Provider selection ──
   Groq wins when its key is present (free tier); otherwise Anthropic. */

type Provider = { kind: "groq"; key: string } | { kind: "anthropic"; key: string };

function resolveProvider(): Provider {
  const groq = import.meta.env.VITE_GROQ_API_KEY;
  if (groq) return { kind: "groq", key: groq };
  const anthropic = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (anthropic) return { kind: "anthropic", key: anthropic };
  throw new ChatError(
    "The chat brain isn't connected yet. Add a key in Settings → Environment: " +
      "VITE_GROQ_API_KEY (Groq — free, works instantly) or VITE_ANTHROPIC_API_KEY (Anthropic), then refresh.",
    "not_configured",
  );
}

/* ── Generic SSE reader: yields text chunks from any OpenAI-style stream ── */

async function* readSSE(body: ReadableStream<Uint8Array>, parse: (event: Record<string, unknown>) => string | null) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const event = JSON.parse(payload) as Record<string, unknown>;
        const text = parse(event);
        if (text) yield text;
      } catch {
        /* malformed SSE line — ignore */
      }
    }
  }
}

/* ── Groq (OpenAI-compatible) ── */

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function* streamGroq(key: string, history: ChatMessage[], signal?: AbortSignal) {
  const model = import.meta.env.VITE_GROQ_MODEL || "openai/gpt-oss-120b";

  const body: Record<string, unknown> = {
    model,
    max_tokens: 600,
    stream: true,
    messages: [{ role: "system", content: buildSystemPrompt() }, ...history],
  };

  let response: Response;
  try {
    response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch {
    throw new ChatError("Could not reach the AI service — check your connection and try again.", "network");
  }

  if (!response.ok || !response.body) {
    let detail = `The AI service returned an error (${response.status}).`;
    try {
      const errBody = (await response.json()) as { error?: { message?: string } };
      if (errBody.error?.message) detail = errBody.error.message;
    } catch {
      /* non-JSON error body — keep the generic message */
    }
    throw new ChatError(detail, "api");
  }

  yield* readSSE(response.body, (event) => {
    const choice = event.choices as Array<{ delta?: { content?: string | null }; finish_reason?: string | null }> | undefined;
    const text = choice?.[0]?.delta?.content;
    return text && text.length > 0 ? text : null;
  });
}

/* ── Anthropic ── */

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

async function* streamAnthropic(key: string, history: ChatMessage[], signal?: AbortSignal) {
  const model = import.meta.env.VITE_ANTHROPIC_MODEL || "claude-sonnet-4-5";

  let response: Response;
  try {
    response = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": ANTHROPIC_VERSION,
        // Anthropic requires this header for browser-direct streaming requests.
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model,
        max_tokens: 600,
        system: buildSystemPrompt(),
        messages: history,
        stream: true,
      }),
      signal,
    });
  } catch {
    throw new ChatError("Could not reach the AI service — check your connection and try again.", "network");
  }

  if (!response.ok || !response.body) {
    let detail = `The AI service returned an error (${response.status}).`;
    try {
      const body = (await response.json()) as { error?: { message?: string } };
      if (body.error?.message) detail = body.error.message;
    } catch {
      /* non-JSON error body — keep the generic message */
    }
    throw new ChatError(detail, "api");
  }

  yield* readSSE(response.body, (event) => {
    if (event.type === "content_block_delta") {
      const delta = event.delta as { type?: string; text?: string } | undefined;
      if (delta?.type === "text_delta" && delta.text) return delta.text;
    }
    return null;
  });
}

/* ── Public API ── */

/**
 * Streams an assistant reply using whichever provider is configured:
 * Groq when VITE_GROQ_API_KEY is set, otherwise Anthropic
 * (VITE_ANTHROPIC_API_KEY).
 */
export async function* streamReply(
  messages: ChatMessage[],
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const provider = resolveProvider();
  const history = messages.slice(-MAX_TURNS);

  if (provider.kind === "groq") {
    yield* streamGroq(provider.key, history, signal);
  } else {
    yield* streamAnthropic(provider.key, history, signal);
  }
}
