"use client";

/* Hero para móvil — cero Framer Motion, cero springs, cero blur animado.
   Animaciones con CSS puro (@keyframes) → el navegador las maneja en la GPU
   sin que React intervenga. Se ve premium, carga instantáneo. */

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { IMG } from "./data";

export default function HeroMobile() {
  return (
    <>
      <style>{`
        @keyframes af-fade-up {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes af-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes af-pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes af-scroll-line {
          0%   { transform: scaleY(0); opacity: 1; }
          80%  { transform: scaleY(1); opacity: 1; }
          100% { transform: scaleY(1); opacity: 0; }
        }
        .af-eyebrow   { animation: af-fade-up 0.9s cubic-bezier(.16,1,.3,1) 0.2s both; }
        .af-title-1   { animation: af-fade-up 1.1s cubic-bezier(.16,1,.3,1) 0.4s both; }
        .af-title-2   { animation: af-fade-up 1.1s cubic-bezier(.16,1,.3,1) 0.6s both; }
        .af-sub       { animation: af-fade-up 1.0s cubic-bezier(.16,1,.3,1) 0.9s both; }
        .af-btns      { animation: af-fade-up 1.0s cubic-bezier(.16,1,.3,1) 1.1s both; }
        .af-img       { animation: af-fade-in 1.4s ease 0s both; }
        .af-dot       { animation: af-pulse-dot 2s ease-in-out infinite; }
        .af-scroll    { animation: af-scroll-line 2s ease-in-out 1.5s infinite; }
      `}</style>

      <section
        id="top"
        className="relative h-[100svh] w-full overflow-hidden bg-[#050505]"
      >
        {/* Imagen de fondo — estática, sin zoom */}
        <div className="af-img absolute inset-0">
          <Image
            src={IMG.hero}
            alt="Superdeportivo A-FORCE"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Gradientes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,0,51,0.10)_0%,_transparent_70%)]" />

        {/* Contenido */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-20">

          {/* Eyebrow */}
          <p className="af-eyebrow font-sans-tech mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-neutral-400">
            <span className="af-dot inline-block h-2 w-2 rounded-full bg-[#FF0033]" />
            High-End · Detailing · Modificaciones
          </p>

          {/* Título */}
          <div
            role="heading"
            aria-level={1}
            className="font-serif-lux text-[clamp(60px,18vw,96px)] leading-[0.9] text-chalk"
          >
            <div className="af-title-1 overflow-hidden pb-[0.06em] font-light">REFUSE</div>
            <div className="af-title-2 overflow-hidden pb-[0.06em] font-normal italic">ORDINARY.</div>
          </div>

          {/* Subtítulo */}
          <p className="af-sub font-sans-tech mt-6 text-[11px] leading-[2] text-neutral-400">
            Ingeniería, escape y protección para los autos<br />que no admiten versión estándar.
          </p>

          {/* Botones */}
          <div className="af-btns mt-8 flex flex-col gap-3">
            <a
              href="#inventario"
              className="font-sans-tech flex items-center justify-center gap-2 border border-white/20 bg-white/5 px-6 py-4 text-xs uppercase tracking-widest text-white active:bg-white/10"
            >
              Explore builds <ArrowUpRight size={14} />
            </a>
            <a
              href="#contacto"
              className="font-sans-tech flex items-center justify-center border border-[#FF0033]/60 bg-[#FF0033]/10 px-6 py-4 text-xs uppercase tracking-widest text-white active:bg-[#FF0033]/20"
            >
              Start your project
            </a>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="h-10 w-px origin-top bg-gradient-to-b from-[#FF0033] to-transparent af-scroll" />
        </div>
      </section>
    </>
  );
}
