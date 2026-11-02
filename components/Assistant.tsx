"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUp } from "lucide-react";
import { ASSISTANT_LIMITS, type ChatMessage } from "@/lib/assistant";
import { whatsappUrl } from "@/lib/contact";

type Notice = null | "limit" | "down" | "error";

const SUGGESTIONS = [
  "¿Qué tipo de página le queda bien a un laboratorio?",
  "Quiero vender por WhatsApp, ¿qué necesito?",
  "¿Qué secciones debe tener la página de un restaurante?",
];

export default function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Mantiene el final de la conversación a la vista, solo dentro del cuadro (sin mover la página).
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, notice]);

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || loading) return;
    if (text.length > ASSISTANT_LIMITS.maxInputChars) return;

    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setNotice(null);
    setLoading(true);

    try {
      const response = await fetch("/api/asistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-ASSISTANT_LIMITS.maxMessages) }),
        signal: AbortSignal.timeout(35_000),
      });
      const data = await response.json().catch(() => null);

      if (response.ok && typeof data?.reply === "string") {
        setMessages([...next, { role: "assistant", content: data.reply }]);
        if (typeof data.remaining === "number") setRemaining(data.remaining);
      } else if (response.status === 429) {
        setNotice("limit");
        if (typeof data?.remaining === "number") setRemaining(data.remaining);
      } else if (response.status === 503) {
        setNotice("down");
      } else {
        setNotice("error");
      }
    } catch {
      setNotice("error");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(input);
  }

  /** Lleva un resumen de la charla al formulario de contacto (la persona puede editarlo antes de enviar). */
  function sendSummary() {
    const wants = messages.filter((m) => m.role === "user").map((m) => `- ${m.content}`);
    const lastIdeas = [...messages].reverse().find((m) => m.role === "assistant")?.content ?? "";
    const message = [
      "Hola VORTEX, hablé con el asistente de su página y esto es lo que busco:",
      ...wants,
      "",
      "Ideas que me sugirió el asistente:",
      lastIdeas,
    ]
      .join("\n")
      .slice(0, 1_800);
    window.dispatchEvent(new CustomEvent("vortex:prefill", { detail: { message } }));
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  }

  const hasAnswer = messages.some((m) => m.role === "assistant");

  return (
    <div className="assistant">
      <div className="assistant-log" ref={logRef} role="log" aria-live="polite" aria-label="Conversación con el asistente">
        {messages.length === 0 && (
          <div className="assistant-empty">
            <p>Prueba con una de estas preguntas o escribe la tuya:</p>
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" className="chip" onClick={() => void send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role === "user" ? "user" : "bot"}`}>
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="bubble bot typing" aria-label="El asistente está escribiendo">
            <i /><i /><i />
          </div>
        )}

        {notice && (
          <p className="assistant-notice" role="alert">
            {notice === "limit" && "Llegaste al límite de preguntas por ahora. "}
            {notice === "down" && "El asistente no está disponible en este momento. "}
            {notice === "error" && "No pudimos responder tu pregunta. Inténtalo de nuevo. "}
            Si quieres, cuéntanos tu idea por{" "}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a> o con el formulario de contacto.
          </p>
        )}
      </div>

      {hasAnswer && (
        <button type="button" className="button button-blue assistant-summary" onClick={sendSummary}>
          Enviar este resumen a VORTEX <ArrowDownRight />
        </button>
      )}

      <form className="assistant-form" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="asistente-input">Escribe tu pregunta</label>
        <input
          id="asistente-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={ASSISTANT_LIMITS.maxInputChars}
          placeholder="Cuéntanos qué negocio tienes o qué buscas…"
          autoComplete="off"
          disabled={loading}
        />
        <button className="assistant-send" type="submit" disabled={loading || !input.trim()} aria-label="Enviar pregunta">
          <ArrowUp />
        </button>
      </form>

      <p className="assistant-fine">
        Responde una inteligencia artificial y puede equivocarse. No escribas datos personales. Los precios y plazos los
        confirmamos nosotros. Más información en el <Link href="/privacidad">Aviso de privacidad</Link>.
        {remaining !== null && ` Te quedan ${remaining} preguntas hoy.`}
      </p>
    </div>
  );
}
