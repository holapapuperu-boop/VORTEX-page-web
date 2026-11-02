"use client";
import { useState } from "react";
import Assistant from "@/components/Assistant";
import Proposal from "@/components/Proposal";

/** VORTEX AI (BETA): propuesta para el negocio + preguntas rápidas. */
export default function VortexAI() {
  const [tab, setTab] = useState<"propuesta" | "preguntar">("propuesta");
  return (
    <div className="ai-shell">
      <div className="ai-tabs" role="tablist" aria-label="Herramientas de VORTEX AI">
        <button role="tab" id="tab-propuesta" aria-selected={tab === "propuesta"} aria-controls="panel-propuesta" onClick={() => setTab("propuesta")}>Propuesta para mi negocio</button>
        <button role="tab" id="tab-preguntar" aria-selected={tab === "preguntar"} aria-controls="panel-preguntar" onClick={() => setTab("preguntar")}>Preguntar</button>
      </div>
      <div role="tabpanel" id="panel-propuesta" aria-labelledby="tab-propuesta" hidden={tab !== "propuesta"}><Proposal /></div>
      <div role="tabpanel" id="panel-preguntar" aria-labelledby="tab-preguntar" hidden={tab !== "preguntar"}><Assistant /></div>
    </div>
  );
}
