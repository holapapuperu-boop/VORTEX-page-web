import { DEFAULT_GROQ_MODELS } from "@/lib/assistant";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const ATTEMPT_TIMEOUT_MS = 9_000;
const TOTAL_BUDGET_MS = 24_000;

type Msg = { role: "system" | "user" | "assistant"; content: string };

export function getModels(): string[] {
  const fromEnv = (process.env.GROQ_MODELS ?? "")
    .split(",")
    .map((m) => m.trim())
    .filter((m) => /^[\w./:-]{1,80}$/.test(m));
  return fromEnv.length ? fromEnv : [...DEFAULT_GROQ_MODELS];
}

/** El modelo a veces ignora el "texto plano": quitamos Markdown y recortamos. */
export function cleanReply(text: string, max = 1_000): string {
  return text.replace(/\*\*|__|`/g, "").replace(/^#{1,6}\s*/gm, "").replace(/\n{3,}/g, "\n\n").trim().slice(0, max);
}

type Attempt = { ok: true; text: string } | { ok: false; status: number; fatal?: boolean };

async function ask(model: string, messages: Msg[], apiKey: string, maxTokens: number, temperature: number): Promise<Attempt> {
  const payload: Record<string, unknown> = {
    model,
    messages,
    temperature,
    max_completion_tokens: maxTokens,
    stream: false,
  };
  // Los modelos gpt-oss "piensan" antes de responder: lo reducimos para ahorrar cuota.
  if (model.startsWith("openai/gpt-oss")) payload.reasoning_effort = "low";
  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
    });
    if (!res.ok) return { ok: false, status: res.status, fatal: res.status === 401 || res.status === 403 };
    const data = (await res.json()) as { choices?: { message?: { content?: unknown } }[] };
    const content = data.choices?.[0]?.message?.content;
    const text = typeof content === "string" ? content.trim() : "";
    return text ? { ok: true, text } : { ok: false, status: 204 };
  } catch {
    return { ok: false, status: 0 }; // tiempo agotado o red caída
  }
}

/**
 * Prueba los modelos en orden: si uno agota su cuota, falla o devuelve algo que `accept` rechaza,
 * pasa al siguiente. Nunca registra el contenido de las conversaciones.
 */
export async function groqChain<T>(opts: {
  messages: Msg[];
  maxTokens: number;
  temperature?: number;
  accept: (text: string) => T | null;
}): Promise<{ ok: true; value: T } | { ok: false }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("[groq] Falta la variable GROQ_API_KEY");
    return { ok: false };
  }
  const started = Date.now();
  for (const model of getModels()) {
    if (Date.now() - started > TOTAL_BUDGET_MS) break;
    const attempt = await ask(model, opts.messages, apiKey, opts.maxTokens, opts.temperature ?? 0.6);
    if (attempt.ok) {
      const value = opts.accept(attempt.text);
      if (value !== null) return { ok: true, value };
      console.error(`[groq] ${model} -> respuesta no válida`);
      continue;
    }
    console.error(`[groq] ${model} -> ${attempt.status}`);
    if (attempt.fatal) break; // clave inválida: no tiene sentido seguir
  }
  return { ok: false };
}
