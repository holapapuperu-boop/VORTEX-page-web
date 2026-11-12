"use client";

/* Showroom para móvil — carrusel swipeable nativo.
   Cero Framer Motion, cero sticky scroll, cero springs.
   El navegador maneja el touch y el snap. Se ve lujoso, funciona en cualquier teléfono. */

import Image from "next/image";
import { useRef, useState } from "react";
import { ROTATOR } from "./data";

const N = ROTATOR.length;

export default function ShowroomMobile() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  /* Detectar qué card está visible usando IntersectionObserver-lite:
     cuando el usuario suelta el dedo, miramos el scrollLeft */
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActive(Math.min(N - 1, Math.max(0, idx)));
  };

  return (
    <section
      id="showroom"
      className="relative border-t border-white/10 bg-[#050505]"
      aria-label="Showroom de detalles"
    >
      {/* Encabezado */}
      <div className="px-6 pb-6 pt-14">
        <p className="font-sans-tech flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-neutral-400">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF0033]" />
          Showroom & Detalles
        </p>
      </div>

      {/* Track swipeable — scroll-snap CSS nativo */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {ROTATOR.map((frame, i) => (
          <div
            key={frame.angle}
            className="relative shrink-0 snap-center"
            style={{ width: "100vw" }}
          >
            {/* Imagen */}
            <div className="relative mx-4 overflow-hidden" style={{ aspectRatio: "4/5" }}>
              <Image
                src={frame.src}
                alt={`Vista ${frame.angle}`}
                fill
                priority={i === 0}
                sizes="92vw"
                className="object-cover"
                style={{ objectPosition: frame.pos }}
              />
              {/* Gradiente sobre imagen */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,_rgba(255,0,51,0.09)_0%,_transparent_65%)]" />

              {/* Número de panel — grande, muy tenue */}
              <span
                className="pointer-events-none absolute right-4 top-4 select-none font-serif-lux text-[22vw] font-light leading-none text-white/[0.055]"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Punto rojo del hotspot */}
              <span
                className="absolute"
                style={{ left: `${frame.hotspot.x}%`, top: `${frame.hotspot.y}%` }}
              >
                <span className="relative block h-3 w-3 -translate-x-1/2 -translate-y-1/2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#FF0033]/60" />
                  <span className="absolute inset-0 rounded-full bg-[#FF0033]" />
                </span>
              </span>
            </div>

            {/* Texto debajo de la imagen */}
            <div className="px-6 pb-10 pt-6">
              <p className="font-sans-tech mb-3 text-[9px] uppercase tracking-[0.4em] text-[#FF0033]">
                {String(i + 1).padStart(2, "0")} · {frame.angle}
              </p>

              <div
                className="font-serif-lux text-[clamp(32px,9vw,52px)] leading-[0.95] text-chalk"
                role="heading"
                aria-level={2}
              >
                {/* Primera mitad */}
                <span className="font-light">
                  {frame.hotspot.title
                    .split(" ")
                    .slice(0, Math.ceil(frame.hotspot.title.split(" ").length / 2))
                    .join(" ")}{" "}
                </span>
                {/* Segunda mitad */}
                <span className="font-normal italic">
                  {frame.hotspot.title
                    .split(" ")
                    .slice(Math.ceil(frame.hotspot.title.split(" ").length / 2))
                    .join(" ") ||
                    frame.hotspot.title.split(" ").slice(-1)[0]}
                </span>
              </div>

              {/* Línea roja */}
              <div className="my-5 h-px w-full max-w-[200px] bg-[#FF0033]/50" />

              <p className="font-sans-tech text-[12px] leading-[1.9] text-neutral-400">
                {frame.hotspot.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Indicadores de paginación */}
      <div className="flex items-center justify-center gap-2 pb-10">
        {ROTATOR.map((_, i) => (
          <button
            key={i}
            aria-label={`Panel ${i + 1}`}
            onClick={() => {
              trackRef.current?.scrollTo({ left: i * trackRef.current.clientWidth, behavior: "smooth" });
              setActive(i);
            }}
            className="transition-all duration-300"
            style={{
              width: i === active ? "24px" : "6px",
              height: "2px",
              background: i === active ? "#FF0033" : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
