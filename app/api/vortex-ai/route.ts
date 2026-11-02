import { groqChain } from "@/lib/groq";
import { clientIp, json, readJson } from "@/lib/guard";
import { consume, refund } from "@/lib/ratelimit";
import { AI_LIMITS, ANALYSIS_PROMPT, buildUserMessage, parseBrief, parseProposal } from "@/lib/vortexai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  const read = await readJson(request, AI_LIMITS.maxBodyBytes);
  if ("error" in read) return read.error;
  const brief = parseBrief(read.data);
  if (!brief) return json({ error: "bad_request" }, 400);

  // Límite en el servidor, separado del chat (clave "ai:" + IP).
  const key = `ai:${clientIp(request)}`;
  const rate = consume(key, AI_LIMITS);
  if (!rate.allowed) {
    return json({ error: "rate_limited", reason: rate.reason, remaining: rate.remaining }, 429, {
      "Retry-After": rate.reason === "minute" ? "60" : "3600",
    });
  }

  const result = await groqChain({
    messages: [
      { role: "system", content: ANALYSIS_PROMPT },
      { role: "user", content: buildUserMessage(brief) },
    ],
    maxTokens: AI_LIMITS.maxOutputTokens,
    temperature: 0.5,
    accept: parseProposal, // si el formato no es válido, se prueba con el siguiente modelo
  });
  if (!result.ok) {
    refund(key);
    return json({ error: "unavailable" }, 503);
  }
  return json({ proposal: result.value, remaining: rate.remaining });
}

export function GET() {
  return json({ error: "method_not_allowed" }, 405, { Allow: "POST" });
}
