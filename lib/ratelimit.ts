/**
 * Límite de uso en memoria.
 *
 * Es una protección "de mejor esfuerzo": en Vercel cada instancia del servidor tiene su
 * propia memoria, así que el conteo no es global ni exacto. Aun así frena el abuso simple.
 * El respaldo real es que el plan gratuito de Groq no puede generar cobros.
 */
type Entry = { dayStart: number; count: number; recent: number[] };

const DAY = 24 * 60 * 60 * 1000;
const MINUTE = 60 * 1000;
const MAX_ENTRIES = 5_000;

const store = new Map<string, Entry>();
const globalState = { dayStart: Date.now(), count: 0 };

export type Limits = { perIpPerDay: number; perIpPerMinute: number; globalPerDay: number };
export type RateResult =
  | { allowed: true; remaining: number }
  | { allowed: false; reason: "minute" | "day" | "global"; remaining: number };

function prune(now: number) {
  if (store.size < MAX_ENTRIES) return;
  for (const [key, entry] of store) {
    if (now - entry.dayStart > DAY) store.delete(key);
  }
  // Si sigue lleno (ataque con muchas IP), vaciamos lo más antiguo.
  if (store.size >= MAX_ENTRIES) {
    for (const key of store.keys()) {
      store.delete(key);
      if (store.size < MAX_ENTRIES / 2) break;
    }
  }
}

export function consume(ip: string, limits: Limits, now = Date.now()): RateResult {
  if (now - globalState.dayStart > DAY) {
    globalState.dayStart = now;
    globalState.count = 0;
  }
  if (globalState.count >= limits.globalPerDay) {
    return { allowed: false, reason: "global", remaining: 0 };
  }

  prune(now);
  let entry = store.get(ip);
  if (!entry || now - entry.dayStart > DAY) {
    entry = { dayStart: now, count: 0, recent: [] };
    store.set(ip, entry);
  }
  entry.recent = entry.recent.filter((t) => now - t < MINUTE);

  if (entry.count >= limits.perIpPerDay) {
    return { allowed: false, reason: "day", remaining: 0 };
  }
  if (entry.recent.length >= limits.perIpPerMinute) {
    return { allowed: false, reason: "minute", remaining: limits.perIpPerDay - entry.count };
  }

  entry.count += 1;
  entry.recent.push(now);
  globalState.count += 1;
  return { allowed: true, remaining: limits.perIpPerDay - entry.count };
}

/** Devuelve la consulta al contador cuando el fallo fue nuestro (ningún modelo respondió). */
export function refund(ip: string) {
  const entry = store.get(ip);
  if (entry && entry.count > 0) {
    entry.count -= 1;
    entry.recent.pop();
  }
  if (globalState.count > 0) globalState.count -= 1;
}
