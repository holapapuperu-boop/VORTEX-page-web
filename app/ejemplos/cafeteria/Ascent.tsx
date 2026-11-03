"use client";
import { useEffect, useRef, useState } from "react";
import s from "./cafe.module.css";

const STAGES = [
  { alt: 1600, title: "Crece a 1,600 metros", text: "En la ladera del volcán, bajo la sombra de los árboles y con noches frías, la cereza madura despacio. Se corta a mano, solo cuando está roja.", icon: "cherry" },
  { alt: 1100, title: "Se lava y se seca a 1,100", text: "Despulpamos el mismo día, fermentamos una noche y secamos al sol en camas elevadas, moviendo el grano varias veces al día.", icon: "bed" },
  { alt: 700, title: "Se tuesta a 700", text: "Tostamos cada semana, en lotes pequeños y a la vista, en San Salvador. Cada bolsa lleva la fecha en que salió del tambor.", icon: "drum" },
  { alt: 650, title: "Llega a tu taza a 650", text: "Molemos al momento y preparamos con agua filtrada a 93 grados. Nada se queda esperando en el mostrador.", icon: "cup" },
] as const;

function Icon({ name }: { name: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 96 96" className={s.stageIcon} aria-hidden="true" {...p}>
      {name === "cherry" && (<><path d="M20 20c18 4 34 12 44 30" /><path d="M64 50c8-16 14-22 22-26" /><circle cx="64" cy="64" r="14" /><circle cx="36" cy="72" r="11" /><path d="M36 61c0-18 6-30 16-38" /><path d="M24 26c10-14 24-14 30-8-6 10-20 14-30 8z" /></>)}
      {name === "bed" && (<><path d="M10 52h76" /><path d="M16 52v28M80 52v28" /><path d="M20 44c6-6 12-6 18 0s12 6 18 0 12-6 18 0" /><path d="M24 32c4-5 9-5 13 0M52 30c4-5 9-5 13 0" /></>)}
      {name === "drum" && (<><circle cx="44" cy="48" r="26" /><path d="M44 48 L62 36" /><path d="M70 26c10 6 16 14 16 24" /><path d="M82 46l4 6 6-6" /><path d="M20 78h48" /></>)}
      {name === "cup" && (<><path d="M16 42h52v14a26 26 0 0 1-26 26h0a26 26 0 0 1-26-26z" /><path d="M68 48h6a8 8 0 0 1 0 16h-8" /><path d="M32 30c-4-6 4-8 0-14M44 30c-4-6 4-8 0-14M56 30c-4-6 4-8 0-14" /></>)}
    </svg>
  );
}

export default function Ascent() {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState<number>(STAGES[0].alt);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const raf = useRef(0);
  const shownRef = useRef<number>(STAGES[0].alt);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)); }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const target = STAGES[active].alt;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cancelAnimationFrame(raf.current);
    if (reduce) { shownRef.current = target; setShown(target); return; }
    const from = shownRef.current;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 900);
      const v = Math.round(from + (target - from) * (1 - Math.pow(1 - k, 3)));
      shownRef.current = v; setShown(v);
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  const pos = ((STAGES[0].alt - shown) / (STAGES[0].alt - STAGES[3].alt)) * 100;

  return (
    <section id="grano" className={s.ascent}>
      <div className={s.ascentIn}>
        <div className={s.gaugeCol} aria-hidden="true">
          <div className={s.gauge}>
            <p className={s.readout}><b>{shown.toLocaleString("en-US")}</b><span>metros sobre el nivel del mar</span></p>
            <div className={s.track}>
              {STAGES.map((st) => <i key={st.alt} style={{ top: `${((1600 - st.alt) / 950) * 100}%` }} />)}
              <span className={s.marker} style={{ top: `${pos}%` }} />
            </div>
          </div>
        </div>
        <div>
          <h2 className={s.ascentTitle}>Del volcán a tu taza <span>baja mil metros.</span></h2>
          {STAGES.map((st, i) => (
            <article key={st.title} data-i={i} ref={(el) => { refs.current[i] = el; }} className={`${s.stage} ${active === i ? s.stageOn : ""}`}>
              <Icon name={st.icon} />
              <h3>{st.title}</h3>
              <p>{st.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
