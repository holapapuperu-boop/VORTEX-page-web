"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import s from "./page.module.css";

/* ═══════════════════════════════════════════════════
   A-FORCE · Landing Demo — VORTEX Digital Solutions
   ═══════════════════════════════════════════════════ */

// ── Reveal (IntersectionObserver scroll animation) ──────────────────
function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return;
    el.dataset.state = "hidden";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.dataset.state = "in"; io.disconnect(); }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={s.reveal} style={{ "--delay": `${delay}s` } as CSSProperties}>
      {children}
    </div>
  );
}

// ── Icons ────────────────────────────────────────────────────────────
function IcArrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path d="M2 6.5h9M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IcWA() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.398A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
            fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

// ── SVG Art — car wireframe ──────────────────────────────────────────
function CarArt({ size = 1 }: { size?: number }) {
  return (
    <svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg"
         width={480 * size} height={220 * size} aria-hidden>
      {/* body */}
      <path d="M 42 145 Q 55 110 90 92 Q 145 72 200 70 Q 240 68 265 70 L 335 78 Q 390 90 410 108 L 428 140 Q 435 158 420 164 L 42 164 Q 28 158 42 145Z"
            fill="none" stroke="rgba(196,164,74,.28)" strokeWidth="1.5"/>
      {/* cabin */}
      <path d="M 115 92 Q 150 55 215 46 L 300 46 Q 345 48 368 78 L 115 92Z"
            fill="rgba(196,164,74,.04)" stroke="rgba(196,164,74,.18)" strokeWidth="1.2"/>
      {/* wheel L */}
      <circle cx="118" cy="164" r="26" fill="none" stroke="rgba(196,164,74,.3)" strokeWidth="1.8"/>
      <circle cx="118" cy="164" r="14" fill="rgba(196,164,74,.07)" stroke="rgba(196,164,74,.4)" strokeWidth="1.5"/>
      {[0,1,2,3,4,5].map(i => {
        const a = (i * 60 * Math.PI) / 180;
        return (
          <line key={i}
            x1={118 + 5 * Math.cos(a)}  y1={164 + 5 * Math.sin(a)}
            x2={118 + 14 * Math.cos(a)} y2={164 + 14 * Math.sin(a)}
            stroke="rgba(196,164,74,.3)" strokeWidth="1.2"/>
        );
      })}
      {/* wheel R */}
      <circle cx="332" cy="164" r="26" fill="none" stroke="rgba(196,164,74,.3)" strokeWidth="1.8"/>
      <circle cx="332" cy="164" r="14" fill="rgba(196,164,74,.07)" stroke="rgba(196,164,74,.4)" strokeWidth="1.5"/>
      {[0,1,2,3,4,5].map(i => {
        const a = (i * 60 * Math.PI) / 180;
        return (
          <line key={i}
            x1={332 + 5 * Math.cos(a)}  y1={164 + 5 * Math.sin(a)}
            x2={332 + 14 * Math.cos(a)} y2={164 + 14 * Math.sin(a)}
            stroke="rgba(196,164,74,.3)" strokeWidth="1.2"/>
        );
      })}
      {/* headlight */}
      <ellipse cx="416" cy="124" rx="9" ry="5.5" fill="rgba(196,164,74,.5)"/>
      <ellipse cx="44"  cy="124" rx="6" ry="4"   fill="rgba(196,164,74,.12)"/>
      {/* detail lines */}
      <line x1="90"  y1="142" x2="415" y2="142" stroke="rgba(196,164,74,.07)" strokeWidth="1"/>
      <line x1="140" y1="90"  x2="366" y2="90"  stroke="rgba(196,164,74,.07)" strokeWidth="1"/>
      {/* side vent */}
      <path d="M 380 112 L 410 118 L 408 128 L 376 122Z"
            fill="rgba(196,164,74,.08)" stroke="rgba(196,164,74,.2)" strokeWidth="1"/>
    </svg>
  );
}

// ── SVG Art — service visuals ────────────────────────────────────────
function ArtInterior() {
  return (
    <svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" aria-hidden>
      <rect x="70" y="50" width="360" height="270" rx="6" fill="none" stroke="rgba(196,164,74,.12)" strokeWidth="1"/>
      <path d="M 90 150 Q 90 100 120 90 L 240 88 L 380 90 Q 420 100 420 155"
            fill="none" stroke="rgba(196,164,74,.22)" strokeWidth="1.4"/>
      {/* seats */}
      {[0,1].map(i => (
        <g key={i} transform={`translate(${i * 140}, 0)`}>
          <path d="M 110 220 Q 112 175 130 168 L 200 168 Q 220 170 220 190 L 220 230 Q 220 248 198 248 L 128 248 Q 110 248 110 220Z"
                fill="rgba(196,164,74,.07)" stroke="rgba(196,164,74,.25)" strokeWidth="1.2"/>
          <rect x="118" y="168" width="96" height="12" rx="4"
                fill="rgba(196,164,74,.08)" stroke="rgba(196,164,74,.18)" strokeWidth="1"/>
        </g>
      ))}
      {/* steering */}
      <circle cx="162" cy="192" r="24" fill="none" stroke="rgba(196,164,74,.28)" strokeWidth="1.5"/>
      <circle cx="162" cy="192" r="8"  fill="rgba(196,164,74,.1)"  stroke="rgba(196,164,74,.3)" strokeWidth="1"/>
      <line x1="162" y1="168" x2="162" y2="184" stroke="rgba(196,164,74,.22)" strokeWidth="1.5"/>
      <line x1="162" y1="200" x2="162" y2="216" stroke="rgba(196,164,74,.22)" strokeWidth="1.5"/>
      <line x1="138" y1="192" x2="154" y2="192" stroke="rgba(196,164,74,.22)" strokeWidth="1.5"/>
      <line x1="170" y1="192" x2="186" y2="192" stroke="rgba(196,164,74,.22)" strokeWidth="1.5"/>
      {/* ambient strip */}
      <rect x="90" y="256" width="320" height="3" rx="1.5" fill="rgba(196,164,74,.2)"/>
      <text x="250" y="318" textAnchor="middle" fontFamily="'Cormorant Garamond', serif"
            fontSize="10" fill="rgba(196,164,74,.25)" letterSpacing="4">INTERIOR</text>
    </svg>
  );
}
function ArtWheels() {
  return (
    <svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" aria-hidden>
      <circle cx="250" cy="190" r="140" fill="none" stroke="rgba(196,164,74,.12)" strokeWidth="1.5"/>
      <circle cx="250" cy="190" r="118" fill="none" stroke="rgba(196,164,74,.1)"  strokeWidth="1"/>
      <circle cx="250" cy="190" r="88"  fill="rgba(196,164,74,.03)" stroke="rgba(196,164,74,.2)" strokeWidth="1.5"/>
      {/* disc */}
      <circle cx="250" cy="190" r="66" fill="none" stroke="rgba(196,164,74,.07)" strokeWidth="8" strokeDasharray="5 3"/>
      <circle cx="250" cy="190" r="22" fill="rgba(196,164,74,.08)" stroke="rgba(196,164,74,.4)" strokeWidth="1.5"/>
      {/* spokes */}
      {Array.from({length:10},(_,i)=>{
        const a=(i*36)*Math.PI/180;
        return <line key={i}
          x1={250+22*Math.cos(a)} y1={190+22*Math.sin(a)}
          x2={250+88*Math.cos(a)} y2={190+88*Math.sin(a)}
          stroke="rgba(196,164,74,.22)" strokeWidth="1.8"/>;
      })}
      <text x="250" y="354" textAnchor="middle" fontFamily="'Cormorant Garamond', serif"
            fontSize="10" fill="rgba(196,164,74,.25)" letterSpacing="4">WHEELS</text>
    </svg>
  );
}
function ArtExhaust() {
  return (
    <svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" aria-hidden>
      <ellipse cx="250" cy="190" rx="90" ry="90" fill="none" stroke="rgba(196,164,74,.22)" strokeWidth="1.5"/>
      <ellipse cx="250" cy="190" rx="68" ry="68" fill="rgba(196,164,74,.03)" stroke="rgba(196,164,74,.3)" strokeWidth="1.5"/>
      <ellipse cx="250" cy="190" rx="42" ry="42" fill="rgba(196,164,74,.06)" stroke="rgba(196,164,74,.22)" strokeWidth="1"/>
      <ellipse cx="250" cy="190" rx="20" ry="20" fill="rgba(10,10,10,.92)" stroke="rgba(196,164,74,.45)" strokeWidth="1.5"/>
      {[110,135,162].map((r,i)=>(
        <ellipse key={i} cx="250" cy="190" rx={r} ry={r*.55}
          fill="none" stroke={`rgba(196,164,74,${.06-i*.015})`} strokeWidth="1" strokeDasharray="3 7"/>
      ))}
      <rect x="72"  y="178" width="140" height="24" rx="12" fill="rgba(196,164,74,.06)" stroke="rgba(196,164,74,.2)" strokeWidth="1"/>
      <rect x="288" y="178" width="140" height="24" rx="12" fill="rgba(196,164,74,.06)" stroke="rgba(196,164,74,.2)" strokeWidth="1"/>
      <text x="250" y="318" textAnchor="middle" fontFamily="'Cormorant Garamond', serif"
            fontSize="10" fill="rgba(196,164,74,.25)" letterSpacing="4">EXHAUST</text>
    </svg>
  );
}
function ArtPPF() {
  return (
    <svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" aria-hidden>
      <path d="M 140 210 Q 150 148 196 128 Q 238 115 258 115 Q 302 115 326 128 Q 362 148 362 210 Q 362 252 342 262 Q 302 274 250 274 Q 198 274 168 262 Q 140 252 140 210Z"
            fill="none" stroke="rgba(196,164,74,.22)" strokeWidth="1.5"/>
      <path d="M 152 208 Q 162 150 204 130 Q 243 118 258 118 Q 299 118 322 130 Q 352 150 350 208 Q 350 248 334 258 Q 298 268 250 268 Q 202 268 174 258 Q 152 248 152 208Z"
            fill="rgba(196,164,74,.03)" stroke="rgba(196,164,74,.1)" strokeWidth="1" strokeDasharray="4 4"/>
      {/* hood zone */}
      <path d="M 198 128 Q 250 112 302 128 L 316 174 Q 250 160 184 174Z"
            fill="rgba(196,164,74,.1)" stroke="rgba(196,164,74,.3)" strokeWidth="1"/>
      {/* shimmer */}
      {[0,1,2,3].map(i=>(
        <line key={i} x1={165+i*44} y1="135" x2={185+i*44} y2="262"
              stroke={`rgba(196,164,74,${.1-i*.02})`} strokeWidth="1"/>
      ))}
      <ellipse cx="250" cy="162" rx="52" ry="28"
            fill="rgba(196,164,74,.05)" stroke="rgba(196,164,74,.14)" strokeWidth="1"/>
      <text x="250" y="318" textAnchor="middle" fontFamily="'Cormorant Garamond', serif"
            fontSize="10" fill="rgba(196,164,74,.25)" letterSpacing="4">PROTECTION</text>
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────
const STATS = [
  { val: "25+",  key: "Builds completados" },
  { val: "7",    key: "Años de experiencia" },
  { val: "100%", key: "Satisfacción cliente" },
  { val: "SLV",  key: "El Salvador" },
];

const SERVICES = [
  {
    num: "01", tag: "Interior", title: "Interior Customization",
    desc: "Transformamos la cabina en un espacio de lujo exclusivo. Tapicería en cuero italiano, paneles de fibra de carbono e iluminación ambiental que definen cada detalle.",
    features: ["Tapicería en cuero Nappa o Alcántara", "Paneles en fibra de carbono", "Iluminación ambiental 64 colores", "Cielo interior tapizado"],
    art: <ArtInterior />,
  },
  {
    num: "02", tag: "Wheels & Brakes", title: "Alloy Wheels & Fitment",
    desc: "Rines forjados de las mejores marcas con fitment perfecto para cada modelo. Upgrade de frenos con kits Brembo y StopTech para un rendimiento excepcional.",
    features: ["Rines HRE, Vossen, BBS, Rotiform", "Fitment personalizado por modelo", "Kits de freno Brembo y StopTech", "Llantas performance"],
    art: <ArtWheels />,
  },
  {
    num: "03", tag: "Performance", title: "Exhaust Systems",
    desc: "Escapes cat-back y axle-back que liberan el verdadero potencial sonoro y dinámico de tu vehículo. Fabricación en titanio, acero inoxidable y fibra de carbono.",
    features: ["Akrapovič, Capristo, Milltek", "Tips en titanio o fibra de carbono", "Válvulas de escape activo", "ECU tune optimizado"],
    art: <ArtExhaust />,
  },
  {
    num: "04", tag: "Protection", title: "Paint Protection Film",
    desc: "Protección de pintura de máxima durabilidad. PPF premium, recubrimiento cerámico de grado profesional y vinyl wraps de alta definición para personalización total.",
    features: ["PPF XPEL o 3M en zonas críticas", "Ceramic Coating 10H — 5 años", "Vinyl wrap 3M 2080 / Avery", "Garantía certificada"],
    art: <ArtPPF />,
  },
] as const;

type BuildStatus = "sold" | "inProgress" | "available";
const BUILDS: { name: string; year: number; zero: string; hp: string; stage: string; status: BuildStatus; label: string }[] = [
  { name: "LAMBORGHINI HURACÁN EVO", year: 2023, zero: "2.9s", hp: "630 HP", stage: "STAGE III", status: "sold",       label: "VENDIDO"     },
  { name: "PORSCHE 911 GT3 RS",      year: 2023, zero: "3.2s", hp: "525 HP", stage: "STAGE II",  status: "inProgress", label: "EN PROCESO"  },
  { name: "MERCEDES-AMG GT63 S",     year: 2024, zero: "3.2s", hp: "639 HP", stage: "STAGE I",   status: "available",  label: "DISPONIBLE"  },
];

const VORTEX_URL = "https://vortexdigitalsolutions.vercel.app";

// ── Navbar ────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className={s.navbar}>
      <div className={`${s.wrap} ${s.navInner}`}>
        <div>
          <span className={s.navLogoMark}>A-FORCE</span>
          <span className={s.navLogoSub}>High-End Automotive</span>
        </div>
        <ul className={s.navLinks}>
          {([ ["Builds", "#catalog"], ["Servicios", "#showcase"], ["Proyectos", "#catalog"], ["Contacto", "#contact"] ] as [string,string][]).map(([label, href]) => (
            <li key={href}><a href={href}>{label}</a></li>
          ))}
          <li><a className={s.navCta} href="#contact">COTIZAR</a></li>
        </ul>
      </div>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className={s.hero}>
      <div className={s.heroBg} />
      <div className={s.heroGrid} />
      <div className={`${s.wrap} ${s.heroInner}`}>
        <div className={s.heroText}>
          <p className={s.eyebrow}>El Salvador · Concesionaria Premium</p>
          <h1 className={s.heroH1}>REFUSE<br /><em>ORDINARY.</em></h1>
          <p className={s.heroSub}>
            Vehículos de colección, detailing de alto nivel y modificaciones que definen un estilo sin igual. Cada proyecto es una obra de ingeniería y diseño.
          </p>
          <div className={s.heroActions}>
            <a href="#catalog"  className={s.btnGold}>    Explorar Builds <IcArrow /></a>
            <a href="#contact"  className={s.btnOutline}> Iniciar Proyecto <IcArrow /></a>
          </div>
        </div>
        <div className={s.heroVisual}>
          <div className={s.heroCarWrap}><CarArt /></div>
        </div>
      </div>
    </section>
  );
}

// ── Stats ─────────────────────────────────────────────────────────────
function Stats() {
  return (
    <div className={s.stats}>
      <div className={`${s.wrap} ${s.statsInner}`}>
        {STATS.map(({ val, key }) => (
          <div key={key} className={s.statItem}>
            <div>
              <strong className={s.statVal}>{val}</strong>
              <span className={s.statKey}>{key}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Showcase ──────────────────────────────────────────────────────────
function Showcase() {
  return (
    <section id="showcase" className={s.showcase}>
      <div className={s.wrap}>
        <Reveal>
          <div className={s.showcaseHeadWrap}>
            <p className={`${s.eyebrow} ${s.eyebrowCenter}`}>Especialidades</p>
            <h2>Crafted for the <em>extraordinary.</em></h2>
          </div>
        </Reveal>
      </div>
      {SERVICES.map((svc, i) => (
        <Reveal key={svc.num} delay={0.05}>
          <div className={`${s.showcaseItem}${i % 2 !== 0 ? ` ${s.reversed}` : ""}`}>
            <div className={s.showcaseContent}>
              <span className={s.scNum}>{svc.num}</span>
              <p className={s.scTag}>{svc.tag}</p>
              <h3>{svc.title}</h3>
              <p>{svc.desc}</p>
              <ul className={s.scFeatures}>
                {svc.features.map(f => <li key={f}>{f}</li>)}
              </ul>
            </div>
            <div className={s.showcaseVisual}>{svc.art}</div>
          </div>
        </Reveal>
      ))}
    </section>
  );
}

// ── Catalog ───────────────────────────────────────────────────────────
function Catalog() {
  return (
    <section id="catalog" className={s.catalog}>
      <div className={s.wrap}>
        <Reveal>
          <div className={s.catalogHead}>
            <p className={s.eyebrow}>Proyectos Recientes</p>
            <h2>Builds que <em>hablan por sí solos.</em></h2>
          </div>
        </Reveal>
        <div className={s.catalogGrid}>
          {BUILDS.map((b, i) => (
            <Reveal key={b.name} delay={i * 0.1}>
              <article className={s.carCard}>
                <div className={s.carThumb}><CarArt size={0.65} /></div>
                <div className={s.carBody}>
                  <span className={`${s.carStatus} ${s[b.status]}`}>{b.label}</span>
                  <h3>{b.name}</h3>
                  <p className={s.carYear}>{b.year} · Premium Build</p>
                  <div className={s.carSpecs}>
                    <div className={s.carSpec}><small>0–100</small><strong>{b.zero}</strong></div>
                    <div className={s.carSpec}><small>Potencia</small><strong>{b.hp}</strong></div>
                    <div className={s.carSpec}><small>Año</small><strong>{b.year}</strong></div>
                  </div>
                  <p className={s.carStage}>{b.stage}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA + Form ────────────────────────────────────────────────────────
function CTASection() {
  const [form, setForm] = useState({ name: "", vehicle: "", service: "", message: "" });

  function set(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const msg = `Hola A-FORCE! Soy ${form.name}. Vehículo: ${form.vehicle || "—"}. Servicio: ${form.service || "—"}. ${form.message}`;
    window.open(`https://wa.me/50300000000?text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <section id="contact" className={s.ctaSec}>
      <div className={s.wrap}>
        <div className={s.ctaGrid}>
          <Reveal>
            <div className={s.ctaLeft}>
              <p className={s.eyebrow}>Comienza tu proyecto</p>
              <h2>Define tu <em>próxima obra.</em></h2>
              <p>
                Cada build de A-FORCE es un proyecto único. Cuéntanos qué tienes en mente
                y nuestro equipo de especialistas diseñará una propuesta a tu medida.
              </p>
              <a href="https://wa.me/50300000000" target="_blank" rel="noopener noreferrer" className={s.waBtn}>
                <span className={s.waIco}><IcWA /></span>
                Consultar por WhatsApp
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <form className={s.form} onSubmit={submit} noValidate>
              <div className={s.formRow}>
                <div className={s.field}>
                  <label htmlFor="af-name">Nombre</label>
                  <input id="af-name" name="name" type="text" placeholder="Tu nombre"
                         value={form.name} onChange={set} />
                </div>
                <div className={s.field}>
                  <label htmlFor="af-vehicle">Vehículo</label>
                  <input id="af-vehicle" name="vehicle" type="text" placeholder="Marca y modelo"
                         value={form.vehicle} onChange={set} />
                </div>
              </div>
              <div className={s.field}>
                <label htmlFor="af-service">Servicio de interés</label>
                <select id="af-service" name="service" value={form.service} onChange={set}>
                  <option value="">Selecciona un servicio</option>
                  <option value="Interior Customization">Interior Customization</option>
                  <option value="Alloy Wheels & Fitment">Alloy Wheels &amp; Fitment</option>
                  <option value="Performance Exhaust">Performance Exhaust</option>
                  <option value="Paint Protection Film">Paint Protection Film</option>
                  <option value="Build Completo">Build Completo</option>
                </select>
              </div>
              <div className={s.field}>
                <label htmlFor="af-msg">Detalles del proyecto</label>
                <textarea id="af-msg" name="message" rows={3}
                          placeholder="Cuéntanos sobre tu visión..."
                          value={form.message} onChange={set} />
              </div>
              <div className={s.formFooter}>
                <span className={s.formNote}>Respuesta en menos de 24 h</span>
                <button type="submit" className={s.btnGold}>
                  Enviar proyecto <IcArrow />
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── VORTEX Promo ──────────────────────────────────────────────────────
function VortexPromo() {
  return (
    <section className={s.promo}>
      <div className={s.wrap}>
        <Reveal>
          <div className={s.promoInner}>
            <div className={s.promoText}>
              <p className={s.promoEyebrow}>Creado por VORTEX Digital Solutions</p>
              <h2>¿Quieres una web con este nivel<br />para tu <em>negocio</em>?</h2>
              <p>
                Esta landing es una demo de lo que VORTEX puede construir para tu empresa.
                Diseñamos y desarrollamos páginas web de alto impacto para negocios en El Salvador —
                desde concesionarias y restaurantes hasta spas, consultorios y más.
                Sin plantillas. Sin límites.
              </p>
            </div>
            <div className={s.promoActions}>
              <a href={`${VORTEX_URL}/#contacto`} target="_blank" rel="noopener noreferrer" className={s.btnBlue}>
                Contactar a VORTEX ↗
              </a>
              <a href={VORTEX_URL} target="_blank" rel="noopener noreferrer" className={s.btnBlueGhost}>
                Ver sitio oficial
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={s.footer}>
      <div className={s.wrap}>
        <div className={s.footerMain}>
          <div>
            <span className={s.footerBrand}>A-FORCE</span>
            <p className={s.footerTag}>
              High-End Automotive. Builds de lujo, detailing premium
              y modificaciones de élite en El Salvador.
            </p>
          </div>
          <div className={s.footerCol}>
            <h4>Servicios</h4>
            {["Interior", "Wheels & Brakes", "Exhaust Systems", "Paint Protection", "Full Builds"].map(x => (
              <a key={x} href="#showcase">{x}</a>
            ))}
          </div>
          <div className={s.footerCol}>
            <h4>Empresa</h4>
            {["Proyectos", "Proceso", "Certificaciones", "Blog"].map(x => (
              <span key={x}>{x}</span>
            ))}
          </div>
          <div className={s.footerCol}>
            <h4>Contacto</h4>
            <span>San Salvador, El Salvador</span>
            <a href="#contact">info@aforce.sv</a>
            <a href="https://wa.me/50300000000">WhatsApp</a>
          </div>
        </div>
        <div className={s.footerBottom}>
          <span>© {year} A-FORCE · Demo creada por VORTEX Digital Solutions</span>
          <a href={VORTEX_URL} target="_blank" rel="noopener noreferrer" className={s.footerCredit}>
            VORTEX Digital Solutions →
          </a>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────
export default function AForcePage() {
  return (
    <div className={s.root}>
      <Navbar />
      <Hero />
      <Stats />
      <Showcase />
      <Catalog />
      <CTASection />
      <VortexPromo />
      <Footer />
    </div>
  );
}
