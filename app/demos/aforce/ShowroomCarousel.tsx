"use client";

/**
 * ShowroomCarousel — reemplaza el sticky-scroll ShowroomStory.
 *
 * Mecánica:
 *  - Un panel fullscreen por frame. El activo se decide con useState, no con scroll.
 *  - Cambio de panel: botones laterales, teclas ← →, swipe táctil.
 *  - Transición: wipe horizontal (clipPath) + fade cruzado de imagen. Solo opacity +
 *    clipPath — lo más barato para la GPU, cero blur animado, cero spring.
 *  - Auto-avance cada 5 s (se pausa al interactuar).
 *  - Texto: stagger CSS con animationDelay inline, se reinicia con una key única.
 *  - Número gigante de fondo: fade con CSS transition.
 *  - Hotspot: aparece con delay tras el wipe.
 *  - Punto rojo pulsante en el indicador activo.
 *  - Sin useScroll, sin useSpring, sin sticky.
 */

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ROTATOR } from "./data";

const N = ROTATOR.length;
const AUTO_MS = 5000;

/* ── Variantes de transición ── */
const WIPE = {
  initial: (dir: number) => ({
    clipPath: dir > 0
      ? "inset(0% 100% 0% 0%)"
      : "inset(0% 0% 0% 100%)",
    opacity: 0,
  }),
  animate: {
    clipPath: "inset(0% 0% 0% 0%)",
    opacity: 1,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
  exit: (dir: number) => ({
    clipPath: dir > 0
      ? "inset(0% 0% 0% 100%)"
      : "inset(0% 100% 0% 0%)",
    opacity: 0,
    transition: { duration: 0.55, ease: [0.7, 0, 0.84, 0] as [number,number,number,number] },
  }),
};

const TEXT_WRAP = {
  initial: {},
  animate: { transition: { staggerChildren: 0.07 } },
  exit:    { transition: { staggerChildren: 0.04 } },
};

const WORD = {
  initial: { y: "110%", opacity: 0 },
  animate: { y: "0%",   opacity: 1, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
  exit:    { y: "-60%", opacity: 0, transition: { duration: 0.35, ease: [0.7, 0, 0.84, 0] as [number,number,number,number] } },
};

const DETAIL = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

const LINE = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1, transition: { duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
  exit:    { scaleX: 0, transition: { duration: 0.25 } },
};

const HOTSPOT = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.65, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
  exit:    { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

/* ── Split title: parte el título en dos mitades ── */
function SplitTitle({ text }: { text: string }) {
  const words = text.split(" ");
  const half = Math.ceil(words.length / 2);
  const line1 = words.slice(0, half);
  const line2 = words.slice(half);
  return (
    <div className="font-serif-lux text-[clamp(40px,7.5vw,108px)] leading-[0.93] text-chalk">
      <div className="overflow-hidden">
        <motion.div className="flex flex-wrap gap-x-[0.22em]" variants={TEXT_WRAP}>
          {line1.map((w, i) => (
            <motion.span key={i} variants={WORD}
              className={i === 0 ? "font-light" : "font-light"}>
              {w}
            </motion.span>
          ))}
        </motion.div>
      </div>
      {line2.length > 0 && (
        <div className="overflow-hidden">
          <motion.div className="flex flex-wrap gap-x-[0.22em]" variants={TEXT_WRAP}>
            {line2.map((w, i) => (
              <motion.span key={i} variants={WORD}
                className="font-normal italic">
                {w}
              </motion.span>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function ShowroomCarousel() {
  const [active, setActive] = useState(0);
  const [dir, setDir]       = useState(1);
  const timerRef            = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const touchX              = useRef<number | null>(null);
  const paused              = useRef(false);

  /* ── Navegar ── */
  const go = useCallback((next: number, d: number) => {
    setDir(d);
    setActive((next + N) % N);
  }, []);

  const prev = useCallback(() => { paused.current = true; go(active - 1, -1); }, [active, go]);
  const next = useCallback(() => { paused.current = true; go(active + 1,  1); }, [active, go]);

  /* ── Auto-avance ── */
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (!paused.current) go(active + 1, 1);
      else paused.current = false;
    }, AUTO_MS);
    return () => clearTimeout(timerRef.current);
  }, [active, go]);

  /* ── Teclado ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  /* ── Swipe táctil ── */
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchX.current = null;
  };

  const frame = ROTATOR[active];
  const h     = frame.hotspot;

  return (
    <section
      id="showroom"
      className="relative h-[100svh] overflow-hidden border-t border-white/10 bg-[#050505]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Showroom de detalles"
    >
      {/* ── Imagen de fondo con wipe ── */}
      <AnimatePresence initial={false} custom={dir} mode="sync">
        <motion.div
          key={active}
          custom={dir}
          variants={WIPE}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 will-change-[clip-path,opacity]"
        >
          <Image
            src={frame.src}
            alt={`Vista ${frame.angle}`}
            fill
            priority={active === 0}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: frame.pos }}
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradientes fijos */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/30 to-[#050505]/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050505]/70 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,_rgba(255,0,51,0.09)_0%,_transparent_65%)]" />

      {/* ── Número gigante de fondo ── */}
      <AnimatePresence initial={false} mode="sync">
        <motion.span
          key={`num-${active}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.055 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none font-serif-lux text-[28vw] font-light leading-none text-white md:right-8"
          aria-hidden
        >
          {String(active + 1).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>

      {/* ── Contenido textual ── */}
      <div className="absolute inset-0 z-10 mx-auto flex max-w-[1400px] flex-col justify-end px-6 pb-24 pt-32 md:px-10 md:pb-28">

        {/* eyebrow */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`eye-${active}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16,1,.3,1] as [number,number,number,number] } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="font-sans-tech mb-5 flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-neutral-300"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF0033]" />
            Showroom — {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            <span className="text-neutral-600">·</span>
            <span className="text-neutral-500">{frame.angle}</span>
          </motion.p>
        </AnimatePresence>

        {/* título split */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`title-${active}`}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <SplitTitle text={h.title} />
          </motion.div>
        </AnimatePresence>

        {/* línea roja */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`line-${active}`}
            variants={LINE}
            initial="initial"
            animate="animate"
            exit="exit"
            className="my-6 h-px w-full max-w-[260px] origin-left bg-[#FF0033]"
          />
        </AnimatePresence>

        {/* detalle técnico */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`detail-${active}`}
            variants={DETAIL}
            initial="initial"
            animate="animate"
            exit="exit"
            className="font-sans-tech max-w-sm text-[13px] leading-[1.9] text-neutral-300 md:max-w-md"
          >
            {h.detail}
          </motion.p>
        </AnimatePresence>

        {/* stat rojo */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`stat-${active}`}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.55, delay: 0.5, ease: [0.16,1,.3,1] as [number,number,number,number] } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="mt-8 origin-left"
          >
            <span className="font-serif-lux text-5xl font-normal text-[#FF0033] md:text-7xl">
              {frame.angle}
            </span>
            <p className="font-sans-tech mt-2 text-[9px] uppercase tracking-[0.35em] text-neutral-500">
              Ángulo de captura
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Hotspot flotante (desktop) ── */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`hs-${active}`}
          variants={HOTSPOT}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ left: `${h.x}%`, top: `${h.y}%` }}
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
            className={`absolute top-1/2 w-52 -translate-y-1/2 border border-white/15 bg-neutral-950/80 px-5 py-4 backdrop-blur-sm ${
              h.side === "left" ? "right-full mr-14" : "left-full ml-14"
            }`}
          >
            <p className="font-sans-tech text-[9px] uppercase tracking-[0.3em] text-[#FF0033]">
              {String(active + 1).padStart(2, "0")} · {frame.angle}
            </p>
            <p className="font-serif-lux mt-2 text-xl font-light leading-tight text-chalk">{h.title}</p>
            <p className="font-sans-tech mt-2 text-[11px] leading-[1.75] text-neutral-400">{h.detail}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Controles: flechas ── */}
      <div className="absolute bottom-8 right-6 z-20 hidden items-center gap-3 md:flex md:right-10">
        <button
          aria-label="Anterior"
          onClick={prev}
          className="flex h-11 w-11 items-center justify-center border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-all duration-300 hover:border-[#FF0033] hover:shadow-[0_0_20px_rgba(255,0,51,0.3)]"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          aria-label="Siguiente"
          onClick={next}
          className="flex h-11 w-11 items-center justify-center border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-all duration-300 hover:border-[#FF0033] hover:shadow-[0_0_20px_rgba(255,0,51,0.3)]"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ── Indicadores de panel + barra de progreso ── */}
      <div className="absolute bottom-8 left-6 z-20 flex items-center gap-4 md:left-10">
        <div className="flex items-center gap-2">
          {ROTATOR.map((_, i) => (
            <button
              key={i}
              aria-label={`Panel ${i + 1}: ${ROTATOR[i].angle}`}
              onClick={() => { paused.current = true; go(i, i > active ? 1 : -1); }}
              className="transition-all duration-400"
              style={{
                height: "2px",
                width: i === active ? "28px" : "8px",
                background: i === active ? "#FF0033" : "rgba(255,255,255,0.25)",
                transition: "width 0.4s ease, background 0.4s ease",
              }}
            />
          ))}
        </div>
        <span className="font-sans-tech text-[9px] uppercase tracking-[0.35em] text-neutral-500 hidden md:block">
          Swipe o usa las flechas
        </span>
      </div>

      {/* ── Barra de auto-avance (top) ── */}
      <div className="absolute inset-x-0 top-0 z-30 h-[2px] bg-white/5">
        <motion.div
          key={active}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
          className="h-full origin-left bg-[#FF0033]/60"
        />
      </div>

      {/* Navbar offset */}
      <div className="absolute inset-x-0 top-0 h-20" aria-hidden />
    </section>
  );
}
