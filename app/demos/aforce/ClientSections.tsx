"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { IMG } from "./data";

/* Hero — cargado solo en cliente. Mientras llega el JS muestra
   la imagen estática con el título ya visible. */
export const HeroClient = dynamic(
  () => import("./sections").then((m) => ({ default: m.Hero })),
  {
    ssr: false,
    loading: () => (
      <section className="relative h-[100svh] w-full bg-[#050505]">
        <Image
          src={IMG.hero}
          alt="A-FORCE superdeportivo"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-black/50" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-20 md:px-10 md:pb-28">
          <p className="font-sans-tech mb-8 text-[10px] uppercase tracking-[0.35em] text-neutral-400">
            <span className="mr-4 inline-block h-2 w-2 rounded-full bg-[#FF0033] align-middle" />
            High-End · Detailing · Modificaciones
          </p>
          <div
            className="font-serif-lux text-[clamp(56px,12.5vw,200px)] leading-[0.9] text-white"
            role="heading"
            aria-level={1}
          >
            <div className="font-light">REFUSE</div>
            <div className="font-normal italic">ORDINARY.</div>
          </div>
        </div>
      </section>
    ),
  }
);

/* ShowroomStory — cargado solo en cliente. Mientras llega el JS muestra
   la primera imagen del showroom para que no haya pantalla en negro. */
export const ShowroomClient = dynamic(() => import("./ShowroomStory"), {
  ssr: false,
  loading: () => (
    <section
      className="relative border-t border-white/10 bg-[#050505]"
      style={{ minHeight: "100vh" }}
    >
      <Image
        src={IMG.gtr}
        alt="Showroom — Frontal"
        fill
        sizes="100vw"
        className="object-cover opacity-50"
        style={{ objectPosition: "50% 62%" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/30 to-[#050505]/20" />
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-20 md:px-10 md:pb-28">
        <p className="font-sans-tech mb-6 text-[9px] uppercase tracking-[0.4em] text-neutral-400">
          <span className="mr-3 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF0033] align-middle" />
          Showroom & Detalles
        </p>
        <div
          className="font-serif-lux text-[clamp(42px,8vw,110px)] leading-[0.95] text-white"
          role="heading"
          aria-level={2}
        >
          <span className="font-light">Luces </span>
          <span className="font-normal italic">Matrix LED</span>
        </div>
        <div className="mt-8 h-px w-full max-w-[260px] bg-[#FF0033]/40" />
        <p className="font-sans-tech mt-4 max-w-sm text-[13px] leading-[1.9] text-neutral-300">
          Haz adaptativo que recorta el tráfico en sentido contrario sin apagar la luz alta.
        </p>
      </div>
      {/* indicador de carga sutil */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
        <span className="font-sans-tech text-[9px] uppercase tracking-[0.35em] text-neutral-600">
          Scroll para explorar
        </span>
      </div>
    </section>
  ),
});
