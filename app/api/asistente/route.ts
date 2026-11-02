import { ASSISTANT_LIMITS as L, SYSTEM_PROMPT, type ChatMessage } from "@/lib/assistant";
import { cleanReply, groqChain } from "@/lib/groq";
import { clientIp, json, readJson } from "@/lib/guard";
import { consume, refund } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/** Valida y normaliza el historial que envía el navegador. Devuelve null si no es válido. */
function parseMessages(body: unknown): ChatMessage[] | null {
  const list = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(list) || list.length < 1 || list.length > L.maxMessages) return null;
  const out: ChatMessage[] = [];
  for (const item of list) {
    const { role, content } = (item ?? {}) as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
    if (!text || (role === "user" && text.length > L.maxInputChars)) return null;
    out.push({ role, content: role === "assistant" ? text.slice(0, L.maxHistoryChars) : text });
  }
  return out[out.length - 1].role === "user" ? out : null;
}

export async function POST(request: Request) {
  const read = await readJson(request, L.maxBodyBytes);
  if ("error" in read) return read.error;
  const messages = parseMessages(read.data);
  if (!messages) return json({ error: "bad_request" }, 400);

  const ip = clientIp(request);
  const rate = consume(ip, L);
  if (!rate.allowed) {
    return json({ error: "rate_limited", reason: rate.reason, remaining: rate.remaining }, 429, {
      "Retry-After": rate.reason === "minute" ? "60" : "3600",
    });
  }

  const result = await groqChain({
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    maxTokens: L.maxOutputTokens,
    accept: (text) => cleanReply(text) || null,
  });
  if (!result.ok) {
    refund(ip); // el fallo fue nuestro: no cuenta contra el visitante
    return json({ error: "unavailable" }, 503);
  }
  return json({ reply: result.value, remaining: rate.remaining });
}

export function GET() {
  return json({ error: "method_not_allowed" }, 405, { Allow: "POST" });
}
