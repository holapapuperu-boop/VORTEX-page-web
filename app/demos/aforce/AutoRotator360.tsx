"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { ROTATOR } from "./data";

const EASE = [0.16, 1, 0.3, 1] as const;
const N = ROTATOR.length;
const STEP = 1 / (N - 1);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const label = "font-sans-tech text-[10px] md:text-xs uppercase tracking-[0.35em] text-neutral-400";

/* Un fotograma de la secuencia: entra, se asienta y sale con desplazamiento + desenfoque de giro */
function Layer({ f, i, p }: { f: (typeof ROTATOR)[number]; i: number; p: MotionValue<number> }) {
  const c = i * STEP;
  const opacity = useTransform(p, [c - STEP, c - STEP * 0.15, c + STEP * 0.15, c + STEP], [0, 1, 1, 0]);
  const x = useTransform(p, [c - STEP, c, c + STEP], ["9%", "0%", "-9%"]);
  const scale = useTransform(p, [c - STEP, c, c + STEP], [1.14, 1, 1.14]);
  const filter = useTransform(p, [c - STEP, c, c + STEP], ["blur(9px)", "blur(0px)", "blur(9px)"]);
  return (
    <motion.div style={{ opacity, x, scale, filter }} className="absolute inset-0 will-change-transform">
      <Image
        src={f.src}
        alt={`Vista ${f.angle}`}
        fill
        sizes="(min-width:768px) 66vw, 100vw"
        className="object-cover"
        style={{ objectPosition: f.pos }}
        draggable={false}
      />
    </motion.div>
  );
}

/* Hotspot flotante: aparece solo en el ángulo clave */
function Hotspot({ f, i, p }: { f: (typeof ROTATOR)[number]; i: number; p: MotionValue<number> }) {
  const c = i * STEP;
  const h = f.hotspot;
  const o = useTransform(p, [c - STEP * 0.4, c - STEP * 0.12, c + STEP * 0.12, c + STEP * 0.4], [0, 1, 1, 0]);
  const y = useTransform(o, [0, 1], [18, 0]);
  const scale = useTransform(o, [0, 1], [0.85, 1]);
  const pe = useTransform(o, (v) => (v > 0.6 ? "auto" : "none"));
  const left = h.side === "left";
  return (
    <motion.div
      style={{ left: `${h.x}%`, top: `${h.y}%`, opacity: o, y, scale, pointerEvents: pe }}
      className="group absolute z-20 -translate-x-1/2 -translate-y-1/2"
    >
      <span className="relative block h-3 w-3">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#FF0033]/70" />
        <span className="absolute inset-0 rounded-full border border-white/70 bg-[#FF0033]" />
      </span>
      <span
        className={`absolute top-1/2 hidden h-px w-10 bg-gradient-to-r from-[#FF0033] to-white/30 md:block ${
          left ? "right-full -translate-x-1 rotate-180" : "left-full translate-x-1"
        }`}
      />
      <div
        className={`absolute top-1/2 hidden w-60 -translate-y-1/2 border border-white/10 bg-neutral-950/60 px-5 py-4 backdrop-blur-md transition-colors duration-500 group-hover:border-[#FF0033]/60 md:block ${
          left ? "right-full mr-12" : "left-full ml-12"
        }`}
      >
        <p className="font-sans-tech text-[10px] uppercase tracking-[0.3em] text-[#FF0033]">0{i + 1} · {f.angle}</p>
        <p className="font-serif-lux mt-2 text-2xl font-light leading-tight text-chalk">{h.title}</p>
        <p className="font-sans-tech max-h-0 overflow-hidden text-[12px] leading-[1.8] text-neutral-400 opacity-0 transition-all duration-500 group-hover:mt-3 group-hover:max-h-32 group-hover:opacity-100">
          {h.detail}
        </p>
      </div>
      {/* móvil: título compacto bajo el punto */}
      <p className="font-sans-tech absolute left-1/2 top-full mt-3 w-max max-w-[40vw] -translate-x-1/2 border border-white/10 bg-neutral-950/70 px-3 py-1.5 text-center text-[9px] uppercase tracking-[0.2em] text-chalk backdrop-blur-md md:hidden">
        {h.title}
      </p>
    </motion.div>
  );
}

export default function AutoRotator360() {
  const reduce = useReducedMotion();
  const outer = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const base = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.5 });
  const drag = useMotionValue(0);

  // ángulo final = scroll (si el usuario lo permite) + arrastre
  const p = useTransform([base, drag], ([b, d]: number[]) =>
    clamp(((reduce ? 0 : clamp((b - 0.04) / 0.92)) + d))
  );
  const deg = useTransform(p, (v) => `${String(Math.round(v * 360)).padStart(3, "0")}°`);
  const angle = useTransform(p, (v) => ROTATOR[Math.round(v * (N - 1))].angle);
  const bar = useTransform(p, (v) => v);

  const down = useRef<{ x: number; d: number } | null>(null);
  const bound = (d: number) => {
    const b = reduce ? 0 : clamp((base.get() - 0.04) / 0.92);
    return clamp(d, -b, 1 - b);
  };
  const nudge = (dir: 1 | -1) =>
    animate(drag, bound(drag.get() + dir * STEP), { duration: 0.9, ease: EASE });

  return (
    <section
      ref={outer}
      id="showroom"
      className={`relative border-t border-white/10 bg-[#050505] ${reduce ? "px-6 py-28 md:px-10 md:py-36" : "h-[420vh]"}`}
    >
      <div className={reduce ? "" : "sticky top-0 flex h-screen items-center px-6 md:px-10"}>
        <div className="mx-auto grid w-full max-w-[1400px] items-center gap-8 md:grid-cols-12 md:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease: EASE }}
            className="md:col-span-4"
          >
            <p className={label}>
              <span className="mr-3 inline-block h-2 w-2 animate-pulse rounded-full bg-[#FF0033] align-middle" />
              Showroom 360°
            </p>
            <div role="heading" aria-level={2} className="font-serif-lux mt-6 text-5xl leading-[1.02] text-chalk md:mt-8 md:text-7xl">
              <span className="font-light">Cada ángulo, </span>
              <span className="font-normal italic">bajo control.</span>
            </div>
            <p className="font-sans-tech mt-6 hidden max-w-xs text-[14px] leading-[1.95] text-neutral-400 md:block">
              Desplázate o arrastra el auto para recorrerlo. Los puntos rojos revelan la ingeniería de cada zona.
            </p>

            <div className="mt-8 flex items-end gap-5 md:mt-12">
              <motion.span className="font-serif-lux text-6xl font-light tabular-nums text-chalk md:text-8xl">{deg}</motion.span>
              <motion.span className={label + " pb-3"}>{angle}</motion.span>
            </div>
            <div className="mt-5 h-px w-full max-w-xs bg-white/10">
              <motion.div style={{ scaleX: bar }} className="h-px origin-left bg-[#FF0033]" />
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button aria-label="Ángulo anterior" onClick={() => nudge(-1)} className="flex h-11 w-11 items-center justify-center border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all duration-500 hover:border-[#FF0033] hover:shadow-[0_0_20px_rgba(255,0,51,0.3)]">
                <ChevronLeft size={16} />
              </button>
              <button aria-label="Ángulo siguiente" onClick={() => nudge(1)} className="flex h-11 w-11 items-center justify-center border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all duration-500 hover:border-[#FF0033] hover:shadow-[0_0_20px_rgba(255,0,51,0.3)]">
                <ChevronRight size={16} />
              </button>
              <span className={label + " ml-3 flex items-center gap-2"}>
                <MoveHorizontal size={14} /> Arrastra
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ clipPath: "inset(8% 8% 8% 8%)", opacity: 0 }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="md:col-span-8"
          >
            <div
              className="relative aspect-[16/10] w-full cursor-grab touch-pan-y select-none overflow-hidden border border-white/10 bg-[#050505] active:cursor-grabbing"
              onPointerDown={(e) => {
                down.current = { x: e.clientX, d: drag.get() };
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (!down.current) return;
                const w = e.currentTarget.clientWidth;
                drag.set(bound(down.current.d - ((e.clientX - down.current.x) / w) * 0.9));
              }}
              onPointerUp={() => (down.current = null)}
              onPointerCancel={() => (down.current = null)}
            >
              {ROTATOR.map((f, i) => (
                <Layer key={f.angle} f={f} i={i} p={p} />
              ))}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,0,51,0.10)_0%,_rgba(5,5,5,0.55)_100%)]" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />
              {ROTATOR.map((f, i) => (
                <Hotspot key={f.angle} f={f} i={i} p={p} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
