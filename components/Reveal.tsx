"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Props = { children: ReactNode; className?: string; delay?: number };

/**
 * Entrada suave al hacer scroll.
 * El contenido es visible por defecto (sin JS o ya en pantalla);
 * solo se oculta si está por debajo del pliegue y aparece al acercarse.
 */
export default function Reveal({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    el.dataset.reveal = "hidden";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "in";
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{ "--rd": `${delay}s` } as CSSProperties}>
      {children}
    </div>
  );
}
