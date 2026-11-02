import type { CSSProperties } from "react";
import { Bot, Code2 } from "lucide-react";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;
const sat = (rot: number, fd: number) => ({ "--rot": `${rot}deg`, "--fd": `${fd}s` }) as CSSProperties;

/**
 * Composición del hero: una página web que se arma sola, rodeada de
 * tarjetas flotantes de código, automatización y diseño adaptable.
 * Es decorativa (aria-hidden) y no usa imágenes.
 */
export default function HeroArt() {
  return (
    <div className="hero-art-wrap" aria-hidden="true">
      <div className="hero-art">
        <div className="browser">
          <div className="hb-bar">
            <i /><i /><i />
            <span>tunegocio.com</span>
          </div>
          <div className="hb-body">
            <b className="hb hb-title" style={d(0.2)} />
            <b className="hb hb-line" style={d(0.5)} />
            <b className="hb hb-line short" style={d(0.7)} />
            <div className="hb-cols">
              <b className="hb" style={d(1)} />
              <b className="hb" style={d(1.2)} />
              <b className="hb" style={d(1.4)} />
            </div>
            <b className="hb hb-btn" style={d(1.7)} />
          </div>
          <svg className="hb-cursor" viewBox="0 0 20 20">
            <path d="M3 2l13 7-6 1.6L7.6 17z" fill="#fff" stroke="#0b0f14" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="sat sat-code" style={sat(-4, 0)}>
          <div className="sat-head"><span className="sat-ico"><Code2 /></span>Código</div>
          <div className="code-lines">
            <span className="x" style={{ width: "80%", ...d(0.3) }} />
            <span style={{ width: "58%", ...d(0.6) }} />
            <span style={{ width: "72%", ...d(0.9) }} />
            <span className="x" style={{ width: "40%", ...d(1.2) }} />
          </div>
        </div>

        <div className="sat sat-live" style={sat(3, 1.2)}>
          <i className="live-dot" />
          En línea
        </div>

        <div className="sat sat-auto" style={sat(2, 2.1)}>
          <div className="sat-head"><span className="sat-ico"><Bot /></span>Automatización</div>
          <svg className="auto-svg" viewBox="0 0 150 34" width="150" height="34">
            <path d="M12 17H138" />
            <circle className="nd" cx="12" cy="17" r="6" style={d(0)} />
            <circle className="nd" cx="75" cy="17" r="6" style={d(1.1)} />
            <circle className="nd" cx="138" cy="17" r="6" style={d(2.2)} />
            <circle className="auto-dot" r="3" cy="17">
              <animateMotion dur="2.6s" repeatCount="indefinite" path="M12 0H138" />
            </circle>
          </svg>
        </div>

        <div className="sat sat-phone" style={sat(-3, 3.2)}>
          <i className="ph-notch" />
          <b className="hb hb-title" style={d(0.9)} />
          <b className="hb hb-line" style={d(1.2)} />
          <b className="hb hb-card" style={d(1.5)} />
          <b className="hb hb-card" style={d(1.7)} />
        </div>
      </div>
    </div>
  );
}
