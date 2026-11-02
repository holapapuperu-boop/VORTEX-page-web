import { NextResponse } from "next/server";

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

/** Comprobaciones comunes de las rutas de IA: mismo origen, JSON, tamaño máximo. Devuelve el JSON o una respuesta de error. */
export async function readJson(request: Request, maxBytes: number): Promise<{ data: unknown } | { error: Response }> {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== request.headers.get("host")) return { error: json({ error: "forbidden" }, 403) };
    } catch {
      return { error: json({ error: "forbidden" }, 403) };
    }
  }
  if (!request.headers.get("content-type")?.includes("application/json")) return { error: json({ error: "bad_request" }, 400) };
  const raw = await request.text();
  if (raw.length > maxBytes) return { error: json({ error: "too_large" }, 413) };
  try {
    return { data: JSON.parse(raw) };
  } catch {
    return { error: json({ error: "bad_request" }, 400) };
  }
}

export const clientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "desconocida";
