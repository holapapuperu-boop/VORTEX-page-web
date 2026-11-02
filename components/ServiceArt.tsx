import type { CSSProperties } from "react";

export type ServiceKind = "web" | "soft" | "ia" | "digital";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;
const h = (v: string, s: number) => ({ "--h": v, "--d": `${s}s` }) as CSSProperties;

/** Microanimación decorativa propia de cada servicio. */
export default function ServiceArt({ kind }: { kind: ServiceKind }) {
  if (kind === "web") {
    return (
      <div className="sv" aria-hidden="true">
        <div className="sv-win">
          <div className="sv-bar"><i /><i /><i /></div>
          <div className="sv-body">
            <b className="sv-b sv-title" style={d(0)} />
            <b className="sv-b sv-line" style={d(0.25)} />
            <b className="sv-b sv-line short" style={d(0.5)} />
            <div className="sv-cols">
              <b className="sv-b" style={d(0.8)} />
              <b className="sv-b" style={d(1)} />
              <b className="sv-b" style={d(1.2)} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (kind === "soft") {
    return (
      <div className="sv" aria-hidden="true">
        <div className="sv-panel">
          <div className="sv-rows">
            <span style={d(0.1)} />
            <span style={d(0.4)} />
            <span style={d(0.7)} />
            <span style={d(1)} />
          </div>
          <div className="sv-bars">
            <i style={h("38%", 0.6)} />
            <i style={h("62%", 0.8)} />
            <i style={h("48%", 1)} />
            <i style={h("86%", 1.2)} />
          </div>
        </div>
      </div>
    );
  }

  if (kind === "ia") {
    return (
      <div className="sv" aria-hidden="true">
        <svg className="sv-svg" viewBox="0 0 260 130" width="260" height="130">
          <path d="M40 65H108" />
          <path d="M152 65C186 65 190 28 226 28" />
          <path d="M152 65H226" />
          <path d="M152 65C186 65 190 102 226 102" />
          <rect x="14" y="52" width="26" height="26" rx="8" />
          <rect x="226" y="16" width="22" height="22" rx="7" />
          <rect x="226" y="54" width="22" height="22" rx="7" />
          <rect x="226" y="91" width="22" height="22" rx="7" />
          <circle className="sv-ring" cx="130" cy="65" r="22" />
          <circle className="sv-core" cx="130" cy="65" r="22" />
          <path className="sv-spark" d="M130 55v20M120 65h20" />
          <circle r="3.2" className="sv-dot">
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M40 65H108" />
          </circle>
          <circle r="3.2" className="sv-dot">
            <animateMotion dur="2.8s" begin="1.4s" repeatCount="indefinite" path="M152 65C186 65 190 28 226 28" />
          </circle>
          <circle r="3.2" className="sv-dot">
            <animateMotion dur="2.8s" begin="1.55s" repeatCount="indefinite" path="M152 65H226" />
          </circle>
          <circle r="3.2" className="sv-dot">
            <animateMotion dur="2.8s" begin="1.7s" repeatCount="indefinite" path="M152 65C186 65 190 102 226 102" />
          </circle>
        </svg>
      </div>
    );
  }

  return (
    <div className="sv" aria-hidden="true">
      <div className="dg">
        <span className="dg-t dg-a" />
        <i className="dg-l" style={d(0)} />
        <span className="dg-t dg-b" />
        <i className="dg-l" style={d(1.2)} />
        <span className="dg-t dg-c" />
      </div>
    </div>
  );
}
