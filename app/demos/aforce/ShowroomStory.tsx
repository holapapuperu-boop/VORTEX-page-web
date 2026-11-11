"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ROTATOR } from "./data";

const EASE = [0.16, 1, 0.3, 1] as const;
const N = ROTATOR.length; // 4 paneles

/* ─────────────────────────────────────────────────────────────
   SplitLine: cada palabra entra desde abajo con stagger
───────────────────────────────────────────────────────────── */
function SplitLine({
  text,
  p,
  inStart,
  inEnd,
  outStart,
  outEnd,
  className = "",
  staggerMs = 60,
  italic = false,
}: {
  text: string;
  p: MotionValue<number>;
  inStart: number;
  inEnd: number;
  outStart: number;
  outEnd: number;
  className?: string;
  staggerMs?: number;
  italic?: boolean;
}) {
  const words = text.split(" ");
  return (
    <span className={`inline-block overflow-hidden ${className}`} aria-label={text}>
      {words.map((w, i) => {
        const delay = (i / words.length) * (inEnd - inStart) * 0.6;
        const wordOpacity = useTransform(p, [inStart + delay, inEnd + delay, outStart, outEnd], [0, 1, 1, 0]); // eslint-disable-line
        const wordY = useTransform(p, [inStart + delay, inEnd + delay, outStart, outEnd], ["110%", "0%", "0%", "-60%"]); // eslint-disable-line
        return (
          <motion.span
            key={i}
            style={{ opacity: wordOpacity, y: wordY, display: "inline-block", marginRight: "0.28em" }}
            className={italic ? "italic" : ""}
            aria-hidden
          >
            {w}
          </motion.span>
        );
      })}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   DrawLine: línea que se traza de izquierda a derecha
───────────────────────────────────────────────────────────── */
function DrawLine({ p, start, end }: { p: MotionValue<number>; start: number; end: number }) {
  const scaleX = useTransform(p, [start, end], [0, 1]);
  return (
    <div className="relative my-6 h-px w-full max-w-[260px] overflow-hidden bg-white/10">
      <motion.div style={{ scaleX }} className="absolute inset-0 origin-left bg-[#FF0033]" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   RedStat: número grande en rojo que explota al entrar
───────────────────────────────────────────────────────────── */
function RedStat({
  value,
  label,
  p,
  inStart,
  inEnd,
}: {
  value: string;
  label: string;
  p: MotionValue<number>;
  inStart: number;
  inEnd: number;
}) {
  const scale = useTransform(p, [inStart, inEnd], [0.5, 1]);
  const opacity = useTransform(p, [inStart, inEnd, inEnd + 0.12], [0, 1, 1]);
  const blur = useTransform(p, [inStart, inEnd], ["blur(16px)", "blur(0px)"]);
  return (
    <motion.div style={{ scale, opacity, filter: blur }} className="origin-left">
      <span className="font-serif-lux text-6xl font-normal text-[#FF0033] md:text-8xl">{value}</span>
      <p className="font-sans-tech mt-2 text-[9px] uppercase tracking-[0.35em] text-neutral-400">{label}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   StoryPanel: un cuadro cinematográfico completo
   p global [0,1]; este panel vive en [panelStart, panelEnd]
───────────────────────────────────────────────────────────── */
function StoryPanel({
  frame,
  index,
  p,
}: {
  frame: (typeof ROTATOR)[number];
  index: number;
  p: MotionValue<number>;
}) {
  const seg = 1 / N;
  const ps = index * seg;         // start del panel
  const pe = ps + seg;            // end del panel
  const first = index === 0;
  const last = index === N - 1;

  /* ── Visibilidad del panel (opacity window) ── */
  // El primer panel ya nace visible (nunca pantalla negra al entrar) y el último se queda hasta soltar el sticky.
  const panelOpacity = useTransform(
    p,
    first
      ? [-1, 0, pe - seg * 0.08, pe + 0.01]
      : [ps - 0.01, ps + seg * 0.08, pe - seg * 0.08, pe + 0.01],
    first ? [1, 1, 1, 0] : last ? [0, 1, 1, 1] : [0, 1, 1, 0]
  );

  /* ── Imagen: paralaje profundo ── */
  const imgScale = useTransform(p, [ps, pe], [1.12, 1.0]);
  const imgY = useTransform(p, [ps, pe], ["-6%", "6%"]);

  /* ── Cortina de entrada: wipe vertical negro que se abre ── */
  const curtainY = useTransform(p, first ? [-1, 0] : [ps - 0.01, ps + seg * 0.15], first ? ["-100%", "-100%"] : ["0%", "-100%"]);

  /* ── Overlay que oscurece al salir ── */
  const exitOverlay = useTransform(p, [pe - seg * 0.2, pe], [0, last ? 0 : 0.88]);

  /* ── Texto: ventana de aparición y salida ── */
  // Panel 0: el texto ya está completo al llegar. Último panel: el texto no sale.
  const tIn = first ? -0.3 : ps + seg * 0.12;
  const tOut = last ? 2 : pe - seg * 0.18;

  /* ── Número índice de fondo ── */
  const idxOpacity = useTransform(p, [tIn, tIn + 0.04, tOut, tOut + 0.04], [0, 0.055, 0.055, 0]);

  /* ── Badge de ángulo en la imagen ── */
  const badgeO = useTransform(p, [tIn + 0.02, tIn + 0.06, tOut, tOut + 0.03], [0, 1, 1, 0]);
  const badgeY = useTransform(p, [tIn + 0.02, tIn + 0.06], [30, 0]);

  const h = frame.hotspot;
  const specs = [
    { v: `0${index + 1}`, l: "Perspectiva" },
    { v: frame.angle, l: "Ángulo" },
  ];

  return (
    <motion.div
      style={{ opacity: panelOpacity }}
      className="absolute inset-0 will-change-transform"
    >
      {/* ── Imagen de fondo con paralaje ── */}
      <motion.div
        style={{ scale: imgScale, y: imgY }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={frame.src}
          alt={`Vista ${frame.angle}`}
          fill
          priority={index < 2}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: frame.pos }}
          draggable={false}
        />
      </motion.div>

      {/* Gradientes */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/30 to-[#050505]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/75 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,_rgba(255,0,51,0.09)_0%,_transparent_65%)]" />

      {/* Número de panel de fondo — enorme, muy tenue */}
      <motion.span
        style={{ opacity: idxOpacity }}
        className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 select-none font-serif-lux text-[28vw] font-light leading-none text-white"
        aria-hidden
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>

      {/* ── Contenido textual ── */}
      <div className="absolute inset-0 z-10 mx-auto flex max-w-[1400px] flex-col justify-end px-6 pb-20 pt-32 md:px-10 md:pb-28">

        {/* eyebrow label */}
        <motion.p
          style={{
            opacity: useTransform(p, [tIn, tIn + 0.05, tOut, tOut + 0.03], [0, 1, 1, 0]),
            y: useTransform(p, [tIn, tIn + 0.05], [20, 0]),
          }}
          className="font-sans-tech mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-300"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF0033]" />
          Showroom — {String(index + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
          <span className="ml-2 text-neutral-500">·</span>
          <span className="text-neutral-500">{frame.angle}</span>
        </motion.p>

        {/* Título principal — split word por word */}
        <div className="font-serif-lux text-[clamp(42px,8vw,110px)] leading-[0.95] text-chalk" role="heading" aria-level={2}>
          <div className="mb-1">
            <SplitLine
              text={h.title.split(" ").slice(0, Math.ceil(h.title.split(" ").length / 2)).join(" ")}
              p={p}
              inStart={tIn}
              inEnd={tIn + 0.09}
              outStart={tOut}
              outEnd={tOut + 0.05}
              className="font-light"
            />
          </div>
          <div>
            <SplitLine
              text={h.title.split(" ").slice(Math.ceil(h.title.split(" ").length / 2)).join(" ") || h.title.split(" ").slice(-1)[0]}
              p={p}
              inStart={tIn + 0.03}
              inEnd={tIn + 0.12}
              outStart={tOut + 0.01}
              outEnd={tOut + 0.06}
              className="font-normal"
              italic
            />
          </div>
        </div>

        {/* Línea roja que se traza */}
        <DrawLine p={p} start={tIn + 0.08} end={tIn + 0.18} />

        {/* Descripción técnica */}
        <motion.p
          style={{
            opacity: useTransform(p, [tIn + 0.14, tIn + 0.22, tOut + 0.01, tOut + 0.07], [0, 1, 1, 0]),
            y: useTransform(p, [tIn + 0.14, tIn + 0.22, tOut, tOut + 0.07], [24, 0, 0, -16]),
          }}
          className="font-sans-tech max-w-sm text-[13px] leading-[1.9] text-neutral-300 md:max-w-md"
        >
          {h.detail}
        </motion.p>

        {/* Stats en rojo */}
        <div className="mt-10 flex items-end gap-10">
          <RedStat value={`0${index + 1}`} label="Perspectiva" p={p} inStart={tIn + 0.16} inEnd={tIn + 0.26} />
          <motion.div
            style={{
              opacity: useTransform(p, [tIn + 0.2, tIn + 0.3, tOut, tOut + 0.04], [0, 1, 1, 0]),
            }}
            className="mb-2 h-16 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
          />
          <motion.div
            style={{
              opacity: useTransform(p, [tIn + 0.22, tIn + 0.32, tOut, tOut + 0.04], [0, 1, 1, 0]),
              y: useTransform(p, [tIn + 0.22, tIn + 0.32], [20, 0]),
            }}
          >
            <span className="font-serif-lux text-6xl font-light text-chalk md:text-8xl">{frame.angle}</span>
            <p className="font-sans-tech mt-2 text-[9px] uppercase tracking-[0.35em] text-neutral-400">Ángulo de captura</p>
          </motion.div>
        </div>
      </div>

      {/* ── Hotspot flotante sobre la imagen ── */}
      <motion.div
        style={{
          left: `${h.x}%`,
          top: `${h.y}%`,
          opacity: badgeO,
          y: badgeY,
        }}
        className="absolute z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block"
      >
        <span className="relative block h-4 w-4">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#FF0033]/60" />
          <span className="absolute inset-0 rounded-full border-2 border-white/40 bg-[#FF0033]" />
        </span>
        <div
          className={`absolute top-1/2 hidden h-px w-12 bg-gradient-to-r from-[#FF0033] to-white/20 md:block ${
            h.side === "left" ? "right-full rotate-180" : "left-full"
          }`}
        />
        <div
          className={`absolute top-1/2 w-52 -translate-y-1/2 border border-white/15 bg-neutral-950/70 px-5 py-4 backdrop-blur-lg ${
            h.side === "left" ? "right-full mr-14" : "left-full ml-14"
          }`}
        >
          <p className="font-sans-tech text-[9px] uppercase tracking-[0.3em] text-[#FF0033]">
            {String(index + 1).padStart(2, "0")} · {frame.angle}
          </p>
          <p className="font-serif-lux mt-2 text-xl font-light leading-tight text-chalk">{h.title}</p>
          <p className="font-sans-tech mt-2 text-[11px] leading-[1.75] text-neutral-400">{h.detail}</p>
        </div>
      </motion.div>

      {/* ── Cortina de entrada (wipe negro que sube) ── */}
      <motion.div
        style={{ y: curtainY }}
        className="pointer-events-none absolute inset-0 z-30 bg-[#050505]"
      />

      {/* ── Overlay de salida ── */}
      <motion.div
        style={{ opacity: exitOverlay }}
        className="pointer-events-none absolute inset-0 z-20 bg-[#050505]"
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SHOWROOM STORY — componente principal
───────────────────────────────────────────────────────────── */
export default function ShowroomStory() {
  const reduce = useReducedMotion();
  const outer = useRef<HTMLElement>(null);

  // Hydration guard: evita que el showroom aparezca en negro mientras el JS carga.
  // Hasta que el componente se monta en el cliente, se muestra el primer panel estático.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: outer,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4, restDelta: 0.0005 });
  // Barras fijas solo visibles mientras estamos dentro de la sección
  const fixedO = useTransform(scrollYProgress, [0, 0.01, 0.985, 1], [0, 1, 1, 0]);

  /* Barra de progreso global */
  const barW = useTransform(p, [0, 1], ["0%", "100%"]);

  /* Texto del ángulo activo */
  const activeAngle = useTransform(p, (v) => {
    const i = Math.min(N - 1, Math.floor(v * N));
    return ROTATOR[i].angle;
  });

  // Mientras el JS no está listo, mostrar el primer panel estático.
  // Esto evita la pantalla negra en la primera carga en móviles lentos.
  if (!isMounted) {
    const f0 = ROTATOR[0];
    return (
      <section
        id="showroom"
        className="relative border-t border-white/10 bg-[#050505]"
        style={{ minHeight: "100vh" }}
      >
        <Image
          src={f0.src}
          alt={`Vista ${f0.angle}`}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
          style={{ objectPosition: f0.pos }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/30 to-[#050505]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/75 via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-20 md:px-10 md:pb-28">
          <p className="font-sans-tech mb-6 text-[9px] uppercase tracking-[0.4em] text-neutral-400">
            <span className="mr-3 inline-block h-1.5 w-1.5 rounded-full bg-[#FF0033] align-middle" />
            Showroom — 01 / 04 · {f0.angle}
          </p>
          <div className="font-serif-lux text-[clamp(42px,8vw,110px)] leading-[0.95] text-chalk" role="heading" aria-level={2}>
            <div className="font-light">{f0.hotspot.title.split(" ").slice(0, Math.ceil(f0.hotspot.title.split(" ").length / 2)).join(" ")}</div>
            <div className="font-normal italic">{f0.hotspot.title.split(" ").slice(Math.ceil(f0.hotspot.title.split(" ").length / 2)).join(" ")}</div>
          </div>
          <div className="my-6 h-px w-full max-w-[260px] bg-[#FF0033]/60" />
          <p className="font-sans-tech max-w-sm text-[13px] leading-[1.9] text-neutral-300">{f0.hotspot.detail}</p>
        </div>
        <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 md:left-10 md:right-10">
          <div className="h-px flex-1 bg-white/10" />
          <span className="font-sans-tech text-[9px] uppercase tracking-[0.35em] text-neutral-500">Scroll para explorar</span>
        </div>
      </section>
    );
  }

  if (reduce) {
    /* ── Versión estática reduced-motion ── */
    return (
      <section id="showroom" className="border-t border-white/10 bg-[#050505] px-6 py-28 md:px-10 md:py-36">
        <p className="font-sans-tech mb-16 text-xs uppercase tracking-[0.35em] text-neutral-400">
          <span className="mr-3 inline-block h-2 w-2 rounded-full bg-[#FF0033] align-middle" />
          Showroom & Detalles
        </p>
        <div className="grid gap-16 md:grid-cols-2">
          {ROTATOR.map((f, i) => (
            <div key={f.angle} className="border border-white/10">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={f.src} alt={`Vista ${f.angle}`} fill sizes="50vw" className="object-cover" style={{ objectPosition: f.pos }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 to-transparent" />
              </div>
              <div className="p-8">
                <p className="font-sans-tech text-[9px] uppercase tracking-[0.35em] text-[#FF0033]">
                  {String(i + 1).padStart(2, "0")} · {f.angle}
                </p>
                <p className="font-serif-lux mt-3 text-3xl font-light text-chalk">{f.hotspot.title}</p>
                <p className="font-sans-tech mt-4 text-[13px] leading-relaxed text-neutral-400">{f.hotspot.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={outer}
      id="showroom"
      className="relative border-t border-white/10 bg-[#050505]"
      style={{ height: `${N * 130}vh` }}
    >
      {/* ── Barra de progreso top ── */}
      <motion.div style={{ opacity: fixedO }} className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent">
        <motion.div style={{ width: barW }} className="h-full origin-left bg-[#FF0033]" />
      </motion.div>

      {/* ── HUD: ángulo activo + counter ── */}
      <motion.div
        style={{ opacity: fixedO }}
        className="pointer-events-none fixed bottom-8 right-6 z-50 hidden text-right md:block"
      >
        <motion.p className="font-serif-lux text-6xl font-light tabular-nums text-white/10">
          {activeAngle}
        </motion.p>
      </motion.div>

      {/* ── Sticky wrapper — empieza bajo la navbar (80px) ── */}
      <div className="sticky top-20 h-[calc(100vh-80px)] overflow-hidden bg-[#050505]">

        {/* Encabezado que entra sólo la primera vez */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.4, ease: EASE }}
          className="absolute left-6 top-28 z-40 md:left-10"
        >
          <p className="font-sans-tech text-[9px] uppercase tracking-[0.4em] text-neutral-400">
            <span className="mr-3 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF0033] align-middle" />
            Showroom & Detalles
          </p>
        </motion.div>

        {/* Paneles superpuestos — cada uno se activa con su ventana de p */}
        <div className="relative h-full w-full">
          {ROTATOR.map((frame, i) => (
            <StoryPanel key={frame.angle} frame={frame} index={i} p={p} />
          ))}
        </div>

        {/* Barra de progreso inferior */}
        <div className="absolute bottom-6 left-6 right-6 z-50 flex items-center gap-4 md:left-10 md:right-10">
          <div className="relative h-px flex-1 bg-white/10">
            <motion.div style={{ width: barW }} className="absolute left-0 top-0 h-px bg-[#FF0033]" />
          </div>
          <span className="font-sans-tech text-[9px] uppercase tracking-[0.35em] text-neutral-500">
            Scroll para explorar
          </span>
        </div>
      </div>
    </section>
  );
}
