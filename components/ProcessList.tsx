"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

type Step = readonly [string, string, string];

/** Lista de proceso: una línea azul se dibuja con el scroll y activa cada etapa. */
export default function ProcessList({ steps }: { steps: readonly Step[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ol = ref.current;
    if (!ol) return;
    setReady(true);
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = ol.getBoundingClientRect();
      const line = window.innerHeight * 0.65;
      const progress = Math.min(1, Math.max(0, (line - rect.top) / rect.height));
      ol.style.setProperty("--p", String(progress));
      let reached = 0;
      ol.querySelectorAll("li").forEach((li, i) => {
        if (li.getBoundingClientRect().top + 30 < line) reached = i + 1;
      });
      setActive(reached);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <ol ref={ref} data-js={ready ? "" : undefined}>
      {steps.map(([num, title, text], i) => (
        <li key={num} className={i < active ? "on" : undefined}>
          <span>{num}</span>
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
          <ArrowUpRight aria-hidden="true" />
        </li>
      ))}
    </ol>
  );
}
