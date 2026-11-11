"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { ROTATOR } from "./data";

const EASE = [0.16, 1, 0.3, 1] as const;
const label = "font-sans-tech text-[10px] md:text-xs uppercase tracking-[0.35em] text-neutral-400";

/* Cada panel: imagen + contenido textual, el paralaje corre a velocidades distintas  */
function StoryPanel({
  frame,
  index,
  total,
}: {
  frame: (typeof ROTATOR)[number];
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  /* imagen: se mueve levemente más lento que el scroll → paralaje natural */
  const imgY = useTransform(p, [0, 1], ["-8%", "8%"]);
  /* texto: sube al entrar y sale bajando (sentido opuesto) */
  const txtY = useTransform(p, [0, 0.35, 0.65, 1], ["4%", "0%", "0%", "-4%"]);
  const txtO = useTransform(p, [0.08, 0.28, 0.72, 0.92], [0, 1, 1, 0]);
  /* clip reveal: la imagen se desvela de arriba a abajo */
  const clipY = useTransform(p, [0.04, 0.3], ["100%", "0%"]);

  const sp = useSpring(useTransform(p, [0, 1], [0, 1]), {
    stiffness: 60,
    damping: 22,
  });
  const lineW = useTransform(sp, [0, 0.6], ["0%", "100%"]);

  const isEven = index % 2 === 0;
  const h = frame.hotspot;

  return (
    <div
      ref={ref}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 md:px-10"
    >
      {/* Número de fondo muy tenue */}
      <motion.span
        style={{ opacity: useTransform(p, [0.1, 0.4, 0.7, 1], [0, 0.06, 0.06, 0]) }}
        className="pointer-events-none absolute select-none font-serif-lux text-[30vw] font-light leading-none text-white"
        aria-hidden
      >
        {String(index + 1).padStart(2, "0")}
    </motion.span>

      <div
        className={`relative mx-auto grid w-full max-w-[1400px] items-center gap-10 md:grid-cols-12 md:gap-16 ${
          isEven ? "" : "md:[direction:rtl] [&>*]:[direction:ltr]"
        }`}
      >
        {/* Imagen */}
        <motion.div
          style={{
            clipPath: useTransform(
              clipY,
              (v) => `inset(${v} 0% 0% 0%)`
            ),
          }}
          className="relative md:col-span-7"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/10">
            <motion.div style={{ y: imgY }} className="absolute inset-[-8%] h-[116%]">
              <Image
                src={frame.src}
                alt={`Vista ${frame.angle}`}
                fill
                sizes="(min-width:768px) 58vw, 100vw"
                className="object-cover"
                style={{ objectPosition: frame.pos }}
                draggable={false}
              />
            </motion.div>
            {/* Overlay gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/70 via-transparent to-black/20" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,0,51,0.07)_0%,_transparent_70%)]" />

            {/* Hotspot badge en la imagen */}
            <motion.div
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                opacity: useTransform(p, [0.3, 0.55, 0.75, 0.92], [0, 1, 1, 0]),
                scale: useTransform(p, [0.3, 0.55], [0.8, 1]),
              }}
              className="absolute z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block"
            >
              <span className="relative block h-3 w-3">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#FF0033]/70" />
                <span className="absolute inset-0 rounded-full bg-[#FF0033]" />
              </span>
              <div
                className={`absolute top-1/2 w-56 -translate-y-1/2 border border-white/10 bg-neutral-950/70 px-5 py-4 backdrop-blur-md ${
                  h.side === "left" ? "right-full mr-10" : "left-full ml-10"
                }`}
              >
                <p className="font-sans-tech text-[9px] uppercase tracking-[0.3em] text-[#FF0033]">
                  {frame.angle}
                </p>
                <p className="font-serif-lux mt-2 text-xl font-light leading-tight text-chalk">
                  {h.title}
                </p>
                <p className="font-sans-tech mt-2 text-[11px] leading-[1.75] text-neutral-400">
                  {h.detail}
                </p>
              </div>
            </motion.div>

            {/* Contador de ángulo encima de la imagen */}
            <div className="absolute bottom-4 left-4 font-sans-tech text-[10px] uppercase tracking-[0.3em] text-white/50">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} — {frame.angle}
            </div>
          </div>
        </motion.div>

        {/* Texto */}
        <motion.div
          style={{ y: txtY, opacity: txtO }}
          className="md:col-span-5"
        >
          <p className={label + " flex items-center gap-3"}>
            <span className="inline-block h-2 w-2 rounded-full bg-[#FF0033]" />
            Showroom — Perspectiva {String(index + 1).padStart(2, "0")}
          </p>

          <div
            role="heading"
            aria-level={2}
            className="font-serif-lux mt-8 text-5xl leading-[1.02] text-chalk md:text-6xl"
          >
            <span className="font-light">{h.title.split(" ").slice(0, -1).join(" ")} </span>
            <span className="font-normal italic">{h.title.split(" ").slice(-1)[0]}</span>
          </div>

          {/* Línea roja animada */}
          <div className="relative mt-8 h-px w-full max-w-[200px] bg-white/10">
            <motion.div style={{ width: lineW }} className="absolute left-0 top-0 h-px bg-[#FF0033]" />
          </div>

          <p className="font-sans-tech mt-8 max-w-sm text-[14px] leading-[1.95] text-neutral-400">
            {h.detail}
          </p>

          {/* Specs del ángulo */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="border border-white/10 px-4 py-3">
              <p className={label + " text-[9px]"}>Perspectiva</p>
              <p className="font-serif-lux mt-2 text-xl font-light text-chalk">{frame.angle}</p>
            </div>
            <div className="border border-white/10 px-4 py-3">
              <p className={label + " text-[9px]"}>Detalle</p>
              <p className="font-serif-lux mt-2 text-xl font-light text-[#FF0033]">{h.title}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ShowroomStory() {
  const reduce = useReducedMotion();

  return (
    <section
      id="showroom"
      className="relative border-t border-white/10 bg-[#050505]"
    >
      {/* Encabezado de sección */}
      <div className="mx-auto max-w-[1400px] px-6 pt-28 pb-4 md:px-10 md:pt-36">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: EASE }}
          className={label}
        >
          <span className="mr-3 inline-block h-2 w-2 animate-pulse rounded-full bg-[#FF0033] align-middle" />
          Showroom & Detalles
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
          role="heading"
          aria-level={2}
          className="font-serif-lux mt-8 max-w-3xl text-6xl leading-[1] text-chalk md:text-8xl"
        >
          <span className="font-light">Cada ángulo </span>
          <span className="font-normal italic">cuenta su historia.</span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: EASE, delay: 0.25 }}
          className="font-sans-tech mt-8 max-w-md text-[14px] leading-[1.95] text-neutral-400"
        >
          Scroll para recorrer el auto en detalle. Cada perspectiva revela una pieza de ingeniería de primer nivel.
        </motion.p>
      </div>

      {/* Paneles — sin sticky, scroll natural, parallax suave */}
      {reduce ? (
        /* reduced-motion: grid estático de 4 paneles */
        <div className="mx-auto grid max-w-[1400px] gap-20 px-6 py-20 md:grid-cols-2 md:px-10">
          {ROTATOR.map((frame, i) => (
            <div key={frame.angle} className="border border-white/10">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={frame.src}
                  alt={`Vista ${frame.angle}`}
                  fill
                  sizes="(min-width:768px) 50vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: frame.pos }}
                />
              </div>
              <div className="p-6">
                <p className={label}>{frame.angle}</p>
                <p className="font-serif-lux mt-3 text-2xl font-light text-chalk">{frame.hotspot.title}</p>
                <p className="font-sans-tech mt-3 text-sm leading-relaxed text-neutral-400">{frame.hotspot.detail}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16">
          {ROTATOR.map((frame, i) => (
            <StoryPanel key={frame.angle} frame={frame} index={i} total={ROTATOR.length} />
          ))}
        </div>
      )}

      {/* Separador final */}
      <div className="mx-auto max-w-[1400px] px-6 pb-28 md:px-10 md:pb-36">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.4, ease: EASE }}
          className="h-px origin-left bg-gradient-to-r from-[#FF0033] to-transparent"
        />
      </div>
    </section>
  );
}
