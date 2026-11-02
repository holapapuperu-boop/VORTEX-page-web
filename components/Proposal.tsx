"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowDownRight, Check, ImageIcon, MonitorPlay } from "lucide-react";
import { AI_LIMITS, DESCRIPTION_MIN, FIELD_MAX, type Brief, type Proposal as ProposalData } from "@/lib/vortexai";
import { whatsappLink } from "@/lib/contact";
import { sendWeb3Form } from "@/lib/web3forms";

type Phase = "idle" | "loading" | "done" | "limit" | "down" | "invalid" | "error";
type SaveStatus = "idle" | "sending" | "ok" | "error" | "missing-key";

export default function Proposal() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [brief, setBrief] = useState<Brief | null>(null);
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [remaining, setRemaining] = useState<number>(AI_LIMITS.perIpPerDay);
  const [chars, setChars] = useState(0);
  const [saveOpen, setSaveOpen] = useState(false);
  const [save, setSave] = useState<SaveStatus>("idle");

  async function analyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase === "loading") return;
    const data = new FormData(event.currentTarget);
    const body = Object.fromEntries(
      (Object.keys(FIELD_MAX) as (keyof Brief)[]).map((k) => [k, String(data.get(k) ?? "").trim()]),
    ) as Brief;
    setPhase("loading");
    try {
      const res = await fetch("/api/vortex-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(40_000),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.proposal) {
        setBrief(body);
        setProposal(json.proposal);
        if (typeof json.remaining === "number") setRemaining(json.remaining);
        setSaveOpen(false);
        setSave("idle");
        setPhase("done");
      } else if (res.status === 429) {
        setRemaining(0);
        setPhase("limit");
      } else {
        setPhase(res.status === 503 ? "down" : res.status === 400 ? "invalid" : "error");
      }
    } catch {
      setPhase("error");
    }
  }

  async function saveProposal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!brief || !proposal || save === "sending") return;
    const form = event.currentTarget;
    const d = new FormData(form);
    if (d.get("botcheck")) return;
    setSave("sending");
    const status = await sendWeb3Form({
      subject: "Propuesta VORTEX AI (BETA)",
      name: String(d.get("name") ?? "").trim(),
      email: String(d.get("email") ?? "").trim(),
      whatsapp: String(d.get("whatsapp") ?? "").trim() || "No indicado",
      negocio: brief.nombre,
      tipo: brief.tipo,
      descripcion: brief.descripcion,
      productos_o_servicios: brief.servicios || "No indicado",
      publico: brief.publico || "No indicado",
      estilo_deseado: brief.estilo || "No indicado",
      objetivo: brief.objetivo || "No indicado",
      plan_recomendado: `VORTEX ${proposal.plan}`,
      motivo: proposal.motivo,
      secciones_sugeridas: proposal.secciones.join(", "),
      estilo_sugerido: proposal.estilo,
      idea_portada: proposal.idea_portada,
      consentimiento: "Aceptó el Aviso de privacidad",
    });
    setSave(status);
    if (status === "ok") form.reset();
  }

  const busy = phase === "loading";

  return (
    <div className="ai-tool">
      <p className="ai-beta">
        <strong>BETA.</strong> Los resultados son experimentales y pueden variar. Es una orientación, no una cotización.
      </p>

      <form className="ai-form" onSubmit={analyze}>
        <div className="ai-row">
          <label>Nombre del negocio<input name="nombre" required minLength={2} maxLength={FIELD_MAX.nombre} autoComplete="off" /></label>
          <label>Tipo de negocio<input name="tipo" required minLength={2} maxLength={FIELD_MAX.tipo} placeholder="Ej.: laboratorio, restaurante" autoComplete="off" /></label>
        </div>
        <label>
          Descripción del negocio
          <textarea name="descripcion" required minLength={DESCRIPTION_MIN} maxLength={FIELD_MAX.descripcion} rows={4} onChange={(e) => setChars(e.target.value.length)} />
          <small>{chars}/{FIELD_MAX.descripcion}</small>
        </label>
        <label>Productos o servicios principales<input name="servicios" maxLength={FIELD_MAX.servicios} autoComplete="off" /></label>
        <div className="ai-row">
          <label>Público al que se dirige<input name="publico" maxLength={FIELD_MAX.publico} autoComplete="off" /></label>
          <label>Estilo visual que te gustaría<input name="estilo" maxLength={FIELD_MAX.estilo} placeholder="Ej.: moderno, elegante" autoComplete="off" /></label>
        </div>
        <label>¿Qué buscas conseguir con tu página?<input name="objetivo" maxLength={FIELD_MAX.objetivo} autoComplete="off" /></label>
        <button className="button button-blue ai-submit" type="submit" disabled={busy || remaining <= 0}>
          {busy ? "Analizando tu negocio…" : "Generar mi propuesta"} <ArrowDownRight />
        </button>
        <p className="assistant-fine">
          Tienes {AI_LIMITS.perIpPerDay} usos por día{phase === "done" || phase === "limit" ? ` (te quedan ${remaining})` : ""}. No escribas datos personales
          ni confidenciales; el texto se procesa con inteligencia artificial (ver el <Link href="/privacidad">Aviso de privacidad</Link>).
        </p>
      </form>

      <div aria-live="polite">
        {busy && <div className="ai-loading" role="status"><i /><i /><i /><span>Analizando tu negocio…</span></div>}
        {phase === "limit" && <p className="assistant-notice" role="alert">Agotaste tus usos de VORTEX AI por hoy. Puedes volver mañana o contarnos tu idea por <a href={whatsappLink("Hola VORTEX, quiero que me ayuden a definir mi página web.")} target="_blank" rel="noopener noreferrer">WhatsApp</a>.</p>}
        {phase === "down" && <p className="assistant-notice" role="alert">VORTEX AI no está disponible en este momento. Escríbenos por <a href={whatsappLink("Hola VORTEX, quiero que me ayuden a definir mi página web.")} target="_blank" rel="noopener noreferrer">WhatsApp</a> y te orientamos.</p>}
        {phase === "invalid" && <p className="assistant-notice" role="alert">Revisa los campos: necesitamos el nombre, el tipo de negocio y una descripción de al menos {DESCRIPTION_MIN} caracteres.</p>}
        {phase === "error" && <p className="assistant-notice" role="alert">No pudimos generar tu propuesta. Inténtalo de nuevo en un momento.</p>}
      </div>

      {phase === "done" && proposal && brief && (
        <div className="ai-result">
          <p className="ai-plan"><span>Plan recomendado</span><strong>VORTEX {proposal.plan}</strong></p>
          <p>{proposal.motivo}</p>
          <h4>Secciones sugeridas</h4>
          <ul className="feature-list">{proposal.secciones.map((s) => <li key={s}><Check aria-hidden="true" />{s}</li>)}</ul>
          <h4>Estilo visual</h4>
          <p>{proposal.estilo}</p>
          <h4>Idea para la portada</h4>
          <p>{proposal.idea_portada}</p>

          <div className="ai-soon">
            <span><ImageIcon aria-hidden="true" /> Imagen conceptual de tu portada <em>· próximamente</em></span>
            <span><MonitorPlay aria-hidden="true" /> Demostración interactiva <em>· próximamente</em></span>
          </div>

          <p className="assistant-fine">Recomendación orientativa generada por IA: no constituye una cotización definitiva.</p>
          <div className="ai-actions">
            <a className="button button-blue" target="_blank" rel="noopener noreferrer"
              href={whatsappLink(`Hola VORTEX, usé VORTEX AI (beta) para mi negocio "${brief.nombre}" (${brief.tipo}). Me recomendó el plan VORTEX ${proposal.plan}. Quisiera solicitar una cotización.`)}>
              Solicitar cotización por WhatsApp <ArrowDownRight />
            </a>
            {!saveOpen && <button type="button" className="button button-ghost" onClick={() => setSaveOpen(true)}>Guardar mi propuesta</button>}
          </div>

          {saveOpen && save !== "ok" && (
            <form className="ai-save" onSubmit={saveProposal}>
              <p>Déjanos tus datos y revisaremos tu propuesta para contactarte.</p>
              <div className="ai-row">
                <label>Nombre<input name="name" required minLength={2} maxLength={80} autoComplete="name" /></label>
                <label>Correo electrónico<input name="email" type="email" required maxLength={120} autoComplete="email" /></label>
              </div>
              <label>WhatsApp <small>(opcional, pero recomendable)</small><input name="whatsapp" type="tel" maxLength={25} autoComplete="tel" /></label>
              <label className="consent">
                <input type="checkbox" name="consent" required />
                <span>He leído y acepto el <Link href="/privacidad" target="_blank">Aviso de privacidad</Link>.</span>
              </label>
              <input type="checkbox" name="botcheck" className="hp-field" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <button className="button button-blue" type="submit" disabled={save === "sending"}>{save === "sending" ? "Guardando…" : "Enviar mi propuesta"}</button>
              {save === "error" && <p className="form-note bad" role="alert">No pudimos enviarla. Inténtalo de nuevo o escríbenos por WhatsApp.</p>}
              {save === "missing-key" && <p className="form-note bad" role="alert">El envío aún no está configurado. Escríbenos por WhatsApp.</p>}
            </form>
          )}
          {save === "ok" && <p className="form-note ok" role="status">¡Gracias! Recibimos tu propuesta y te contactaremos pronto.</p>}
        </div>
      )}
    </div>
  );
}
