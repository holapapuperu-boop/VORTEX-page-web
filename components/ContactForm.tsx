"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { whatsappUrl } from "@/lib/contact";

type Status = "idle" | "sending" | "success" | "error" | "missing-key";

const ENDPOINT = "https://api.web3forms.com/submit";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [prefilled, setPrefilled] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // El asistente de ideas puede dejar aquí un resumen de la conversación (editable).
  useEffect(() => {
    const onPrefill = (event: Event) => {
      const message = (event as CustomEvent<{ message?: string }>).detail?.message;
      if (typeof message !== "string" || !messageRef.current) return;
      messageRef.current.value = message.slice(0, 2000);
      setPrefilled(true);
      setStatus("idle");
      messageRef.current.focus({ preventScroll: true });
    };
    window.addEventListener("vortex:prefill", onPrefill);
    return () => window.removeEventListener("vortex:prefill", onPrefill);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!accessKey) {
      setStatus("missing-key");
      return;
    }

    const data = new FormData(form);
    // Trampa para bots: un humano nunca marca esta casilla oculta.
    if (data.get("botcheck")) return;

    setStatus("sending");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: "Nueva consulta desde la web de VORTEX",
          from_name: "Web VORTEX",
          name: String(data.get("name") ?? "").trim(),
          email: String(data.get("email") ?? "").trim(),
          message: String(data.get("message") ?? "").trim(),
          consentimiento: "Aceptó el Aviso de privacidad",
        }),
      });
      const result = await response.json().catch(() => null);
      if (response.ok && result?.success) {
        form.reset();
        setPrefilled(false);
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        Nombre
        <input required minLength={2} maxLength={80} name="name" autoComplete="name" />
      </label>
      <label>
        Correo electrónico
        <input required type="email" maxLength={120} name="email" autoComplete="email" />
      </label>
      <label>
        ¿Cómo podemos ayudarte?
        <textarea ref={messageRef} required minLength={10} maxLength={2000} name="message" rows={4} />
      </label>
      {prefilled && (
        <p className="form-note">Pusimos aquí un resumen de tu charla con el asistente. Puedes editarlo antes de enviarlo.</p>
      )}
      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>He leído y acepto el <Link href="/privacidad" target="_blank">Aviso de privacidad</Link>.</span>
      </label>
      <input type="checkbox" name="botcheck" className="hp-field" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="button button-dark" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Enviando…" : "Enviar consulta"} <span>↗</span>
      </button>
      <div className="form-status" role="status" aria-live="polite">
        {status === "success" && (
          <p className="form-note ok">¡Gracias! Recibimos tu consulta y te responderemos pronto.</p>
        )}
        {status === "error" && (
          <p className="form-note bad">
            No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos por{" "}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
          </p>
        )}
        {status === "missing-key" && (
          <p className="form-note bad">El envío aún no está configurado. Escríbenos por WhatsApp mientras tanto.</p>
        )}
      </div>
    </form>
  );
}
