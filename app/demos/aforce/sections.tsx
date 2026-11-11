"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  type MotionValue,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
  easeOut,
  useInView,
  animate as fmAnimate,
  type Variants,
} from "framer-motion";
import { ArrowUpRight, Menu, X, Gauge, Zap, CalendarDays, MessageCircle, Send } from "lucide-react";
import { ATELIER, BUILDS, IMG, NAV, STATS, VORTEX_URL, WHATSAPP } from "./data";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ───────────── CountUp: número anima al entrar en viewport ───────────── */
function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView || !ref.current || reduce) return;
    const ctrl = fmAnimate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        if (ref.current) ref.current.textContent = Math.round(v) + suffix;
      },
    });
    return () => ctrl.stop();
  }, [inView, value, suffix, reduce]);
  return <span ref={ref}>{reduce ? value + suffix : "0" + suffix}</span>;
}

/* ───────────── MagBtn: botón con glow magnético en hover ───────────── */
function MagBtn({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 18 });
  const sy = useSpring(my, { stiffness: 180, damping: 18 });
  const move = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.18);
    my.set((e.clientY - r.top - r.height / 2) * 0.18);
  };
  const leave = () => { mx.set(0); my.set(0); };
  const btn =
    "font-sans-tech inline-flex items-center justify-center gap-3 border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:border-[#FF0033] hover:shadow-[0_0_28px_rgba(255,0,51,0.4)] hover:text-white transition-all duration-500 uppercase tracking-widest text-xs px-8 py-4 cursor-pointer";
  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={move}
      onMouseLeave={leave}
      className={`${btn} ${className}`}
    >
      {children}
    </motion.a>
  );
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 64, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.1, ease: EASE } },
};
const chip: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: EASE } },
};
const view = { once: true, amount: 0.2 } as const;

/* Reglas de sistema de diseño */
const label = "font-sans-tech text-[10px] md:text-xs uppercase tracking-[0.35em] text-neutral-400";
const glass = "bg-neutral-950/60 backdrop-blur-md border border-white/10 rounded-none";
const btn =
  "font-sans-tech inline-flex items-center justify-center gap-3 border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:border-[#FF0033] hover:shadow-[0_0_20px_rgba(255,0,51,0.3)] hover:text-white transition-all duration-500 uppercase tracking-widest text-xs px-8 py-4";
const section = "px-6 py-28 md:px-10 md:py-36";

/* ───────────── Contenedor de imagen: ratio estricto + object-cover + overlay ───────────── */
function Frame({
  src,
  alt,
  ratio,
  sizes,
  priority,
  className = "",
  children,
}: {
  src: string;
  alt: string;
  ratio: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`group relative overflow-hidden ${ratio} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />
      {children}
    </div>
  );
}

/* ───────────── NAVBAR ───────────── */
export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: EASE }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md"
    >
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 md:px-10">
        <a href="#top" className="font-serif-lux text-2xl tracking-[0.22em] text-chalk">
          <span className="font-light">A</span>
          <span className="text-crimson">—</span>
          <span className="font-semibold">FORCE</span>
        </a>

        <nav className="hidden items-center gap-12 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="font-sans-tech group relative text-xs uppercase tracking-[0.3em] text-neutral-400 transition-colors duration-300 hover:text-white"
            >
              {n.label}
              <span className="absolute -bottom-2 left-0 h-px w-0 bg-crimson transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <a
          href="#contacto"
          className="font-sans-tech relative hidden overflow-hidden p-px text-xs uppercase tracking-[0.3em] text-white md:inline-block"
        >
          <motion.span
            aria-hidden
            className="absolute inset-[-100%]"
            style={{ background: "conic-gradient(from 0deg, transparent 0 72%, #FF0033 86%, transparent 100%)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, ease: "linear", repeat: Infinity }}
          />
          <span className="relative block bg-[#050505] px-6 py-3 transition-colors duration-300 hover:bg-[#0F0F0F]">
            Cotizar proyecto
          </span>
        </a>

        <button aria-label="Menú" onClick={() => setOpen((o) => !o)} className="text-white md:hidden" style={{ background: "none", border: 0 }}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="overflow-hidden md:hidden"
      >
        <div className="flex flex-col gap-6 px-6 pb-10 pt-4">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="font-serif-lux text-4xl font-light text-chalk">
              {n.label}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.header>
  );
}

/* ───────────── HERO: aceleración al scroll ───────────── */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // spring más rígido y con restDelta: se asienta rápido y no arrastra inercia cuando el sticky se suelta
  const p = useSpring(scrollYProgress, { stiffness: 160, damping: 32, mass: 0.4, restDelta: 0.0005 });
  const ez = { ease: easeOut };

  // el auto "sale disparado": escala 1 → 1.5, avanza hacia arriba, desenfoque de movimiento y fundido
  // toda la animación termina en p=0.78; entre 0.62 y 0.86 una cortina negra cubre la escena,
  // así el despegue del sticky ocurre sobre negro y nunca se ve la "pelea" con el scroll
  const carScale = useTransform(p, [0, 0.78], [1, 1.5], ez);
  const carY = useTransform(p, [0, 0.78], ["0%", "-14%"], ez);
  const carOpacity = useTransform(p, [0, 0.45, 0.78], [1, 1, 0], ez);
  const carBlur = useTransform(p, [0, 0.12, 0.4], ["blur(0px)", "blur(4px)", "blur(0px)"]);
  const blackout = useTransform(p, [0.62, 0.86], [0, 1]);
  const glow = useTransform(p, [0, 0.6], [1, 1.8]);
  const titleOpacity = useTransform(p, [0, 0.32], [1, 0], ez);
  const titleY = useTransform(p, [0, 0.32], ["0px", "-70px"], ez);
  const titleSpacing = useTransform(p, [0, 0.32], ["-0.02em", "0.04em"]);
  const uiOpacity = useTransform(p, [0, 0.18], [1, 0]);

  const carStyle = reduce ? {} : { scale: carScale, y: carY, opacity: carOpacity, filter: carBlur };
  const titleStyle = reduce ? {} : { opacity: titleOpacity, y: titleY, letterSpacing: titleSpacing };

  return (
    <section id="top" ref={ref} className={`relative w-full bg-[#050505] ${reduce ? "h-[100svh]" : "h-[180vh]"}`}>
      <div className="sticky top-0 aspect-[16/9] h-[100svh] min-h-[100svh] w-full overflow-hidden">
        <motion.div style={carStyle} className="absolute inset-0 will-change-transform">
          <Image
            src={IMG.hero}
            alt="Superdeportivo en la oscuridad con faros traseros rojos"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>

        <motion.div style={reduce ? {} : { opacity: glow }} className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,0,51,0.12)_0%,_rgba(5,5,5,0.95)_95%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />

        <div className="absolute inset-0 z-10 mx-auto flex max-w-[1400px] flex-col justify-end px-6 pb-20 pt-32 md:px-10 md:pb-28">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.7em" }}
            animate={{ opacity: 1, letterSpacing: "0.35em" }}
            transition={{ duration: 1.8, ease: EASE, delay: 0.3 }}
            style={reduce ? {} : { opacity: uiOpacity }}
            className={label + " mb-8"}
          >
            <span className="mr-4 inline-block h-2 w-2 animate-pulse rounded-full bg-[#FF0033] align-middle" />
            High-End · Detailing · Modificaciones
          </motion.p>

          <motion.div
            role="heading"
            aria-level={1}
            style={titleStyle}
            className="font-serif-lux text-[clamp(56px,12.5vw,200px)] leading-[0.9] text-chalk"
          >
            <div className="overflow-hidden pb-[0.08em]">
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 1.4, ease: EASE, delay: 0.5 }}
                className="inline-block font-light"
              >
                REFUSE
              </motion.span>
            </div>
            <div className="overflow-hidden pb-[0.08em]">
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 1.4, ease: EASE, delay: 0.7 }}
                className="inline-block font-normal italic"
              >
                ORDINARY.
              </motion.span>
            </div>
          </motion.div>

          <motion.div style={reduce ? {} : { opacity: uiOpacity }} className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 1.5 }}
              className={label + " max-w-sm leading-[2]"}
            >
              Ingeniería, escape y protección para los autos que no admiten versión estándar.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 1.7 }}
              className="flex flex-wrap gap-4"
            >
              <MagBtn href="#inventario">
                Explore builds <ArrowUpRight size={14} />
              </MagBtn>
              <MagBtn href="#contacto">
                Start your project
              </MagBtn>
            </motion.div>
          </motion.div>
        </div>

        <motion.div style={reduce ? {} : { opacity: uiOpacity }} className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:block">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} className="h-10 w-px bg-gradient-to-b from-[#FF0033] to-transparent" />
        </motion.div>

        {/* cortina a negro: cubre el momento en que el sticky se suelta */}
        <motion.div
          aria-hidden
          style={{ opacity: reduce ? 0 : blackout }}
          className="pointer-events-none absolute inset-0 z-20 bg-[#050505]"
        />
      </div>
    </section>
  );
}

/* ───────────── STATS ───────────── */
export function Stats() {
  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={view}
      className="border-y border-white/10 bg-[#0A0A0A]"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-12 px-6 py-20 md:grid-cols-4 md:px-10">
        {STATS.map((s) => {
          // Separa número y sufijo ("240+" → 240, "+")
          const num = parseInt(s.v.replace(/\D/g, ""), 10);
          const suffix = s.v.replace(/[0-9]/g, "");
          const isNum = !isNaN(num);
          return (
            <motion.div key={s.l} variants={rise} className="text-center md:text-left">
              <div className="font-serif-lux text-6xl font-light text-chalk md:text-7xl">
                {isNum ? <CountUp value={num} suffix={suffix} /> : s.v}
              </div>
              <div className={label + " mt-3"}>{s.l}</div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

/* ───────────── ATELIER (split-grid editorial) ───────────── */
function AtelierRow({ item, flip }: { item: (typeof ATELIER)[number]; flip: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const [first, ...rest] = item.title.split("\n");

  return (
    <div ref={ref} className="grid items-center gap-12 md:grid-cols-12 md:gap-20">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={view}
        className={"md:col-span-5 " + (flip ? "md:order-2" : "")}
      >
        <motion.div variants={rise} className="font-serif-lux text-8xl font-light leading-none text-white/10">
          {item.n}
        </motion.div>
        <motion.p variants={rise} className={label + " mt-6"}>
          {item.eyebrow}
        </motion.p>
        <motion.div
          variants={rise}
          role="heading"
          aria-level={2}
          className="font-serif-lux mt-8 text-5xl leading-[1.05] text-chalk md:text-6xl"
        >
          <span className="font-light">{first}</span>
          <br />
          <span className="font-normal italic">{rest.join(" ")}</span>
        </motion.div>
        <motion.p variants={rise} className="font-sans-tech mt-8 max-w-md text-[15px] leading-[1.95] text-neutral-400">
          {item.body}
        </motion.p>
        <motion.ul variants={stagger} className="mt-10 flex flex-wrap gap-3" style={{ padding: 0, listStyle: "none" }}>
          {item.specs.map((sp) => (
            <motion.li variants={chip} key={sp} className={`${glass} font-sans-tech px-4 py-2 text-xs uppercase tracking-[0.2em] text-neutral-300`}>
              {sp}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.div
        initial={{ clipPath: "inset(10% 10% 10% 10%)", opacity: 0 }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
        viewport={view}
        transition={{ duration: 1.4, ease: EASE }}
        className={"md:col-span-7 " + (flip ? "md:order-1" : "")}
      >
        <motion.div style={{ y }}>
          <Frame src={item.img} alt={item.eyebrow} ratio="aspect-[4/3]" sizes="(min-width:768px) 58vw, 100vw">
            <div className="pointer-events-none absolute inset-4 border border-white/10" />
          </Frame>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Atelier() {
  return (
    <section id="atelier" className={`bg-[#050505] ${section}`}>
      <div className="mx-auto max-w-[1400px]">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={view} className="mb-28 max-w-3xl">
          <motion.p variants={rise} className={label}>El Atelier</motion.p>
          <motion.div
            variants={rise}
            role="heading"
            aria-level={2}
            className="font-serif-lux mt-8 text-6xl leading-[1] text-chalk md:text-8xl"
          >
            <span className="font-light">Obsesión por el </span>
            <span className="font-normal italic text-chalk">detalle</span>
            <span className="font-light">.</span>
          </motion.div>
        </motion.div>
        <div className="flex flex-col gap-32 md:gap-48">
          {ATELIER.map((it, i) => (
            <AtelierRow key={it.id} item={it} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── INVENTARIO ───────────── */
function BuildCard({ b, i, p }: { b: (typeof BUILDS)[number]; i: number; p: MotionValue<number> }) {
  const off = [10, 60, 110][i % 3];
  const lift = useTransform(p, [0, 1], [off, -off * 0.6]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 110, damping: 20 });
  const sy = useSpring(my, { stiffness: 110, damping: 20 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-4, 4]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [4, -4]);

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const leave = () => {
    mx.set(0);
    my.set(0);
  };

  const tagColor =
    b.tag === "Disponible" ? "text-crimson border-crimson/40" : b.tag === "En proceso" ? "text-white border-white/30" : "text-neutral-500 border-white/10";

  return (
    <motion.div style={{ y: lift }}>
    <motion.article variants={rise} style={{ perspective: 1200 }}>
      <motion.div
        onMouseMove={move}
        onMouseLeave={leave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ boxShadow: "0 0 0 1px rgba(255,0,51,0.45), 0 30px 80px -24px rgba(255,0,51,0.25)" }}
        transition={{ duration: 0.5, ease: EASE }}
        className={`group ${glass} overflow-hidden`}
      >
        <Frame src={b.img} alt={`${b.make} ${b.name}`} ratio="aspect-[4/3]" sizes="(min-width:1024px) 33vw, 100vw">
          <span className={`font-sans-tech absolute left-5 top-5 border bg-black/50 px-3 py-1.5 text-xs uppercase tracking-[0.2em] backdrop-blur-md ${tagColor}`}>
            {b.tag === "Disponible" && <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-[#FF0033] align-middle" />}
            {b.tag}
          </span>
        </Frame>

        <div className="p-8">
          <p className={label}>{b.make}</p>
          <div role="heading" aria-level={3} className="font-serif-lux mt-3 text-4xl font-light text-chalk">
            {b.name}
          </div>

          <div className="font-sans-tech mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
            {[
              { i: <Gauge size={14} />, l: "0-100", v: b.zero, hot: true },
              { i: <Zap size={14} />, l: "Potencia", v: b.hp, hot: true },
              { i: <CalendarDays size={14} />, l: "Año", v: b.year, hot: false },
            ].map((m) => (
              <div key={m.l}>
                <div className="flex items-center gap-1.5 text-neutral-400">
                  {m.i}
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">{m.l}</span>
                </div>
                <div className={`mt-2 text-[15px] font-semibold ${m.hot ? "text-[#FF0033]" : "text-chalk"}`}>{m.v}</div>
              </div>
            ))}
          </div>

          <a
            href="#contacto"
            className="font-sans-tech mt-8 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-neutral-400 transition-colors duration-300 group-hover:text-white"
          >
            Consultar
            <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
        </div>
      </motion.div>
    </motion.article>
    </motion.div>
  );
}

export function Inventario() {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ["start end", "end start"] });
  const sp = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.5 });
  const still = useMotionValue(0.5);
  return (
    <section id="inventario" className={`border-t border-white/10 bg-[#0A0A0A] ${section}`}>
      <div className="mx-auto max-w-[1400px]">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={view} className="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <motion.p variants={rise} className={label}>Inventario & Builds</motion.p>
            <motion.div variants={rise} role="heading" aria-level={2} className="font-serif-lux mt-8 text-6xl leading-none text-chalk md:text-8xl">
              <span className="font-light">Colección </span>
              <span className="font-normal italic text-chalk">actual</span>
            </motion.div>
          </div>
          <motion.p variants={rise} className="font-sans-tech max-w-xs text-[14px] leading-[1.95] text-neutral-400">
            Piezas seleccionadas y proyectos en taller. Cada unidad, inspeccionada y documentada.
          </motion.p>
        </motion.div>

        <motion.div ref={gridRef} variants={stagger} initial="hidden" whileInView="show" viewport={view} className="grid gap-8 pb-28 md:grid-cols-2 lg:grid-cols-3">
          {BUILDS.map((b, i) => (
            <BuildCard key={b.name} b={b} i={i} p={reduce ? still : sp} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────── CONTACTO ───────────── */
export function Contacto() {
  const [f, setF] = useState({ nombre: "", auto: "", servicio: "Escape & performance", msg: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hola A-FORCE, soy ${f.nombre}. Auto: ${f.auto}. Servicio: ${f.servicio}. ${f.msg}`;
    window.open(`${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const field =
    "font-sans-tech w-full rounded-none border-0 border-b border-white/20 bg-transparent px-0 py-4 text-[14px] text-chalk outline-none transition-colors duration-300 placeholder:text-neutral-500 focus:border-crimson";

  return (
    <section id="contacto" className={`relative overflow-hidden bg-[#050505] ${section}`}>
      <div className="absolute inset-0 opacity-40">
        <Image src={IMG.porsche} alt="" fill sizes="100vw" className="object-cover object-center" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-[#050505]" />

      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={view} className="relative mx-auto grid max-w-[1400px] gap-20 md:grid-cols-2">
        <div>
          <motion.p variants={rise} className={label}>Start your project</motion.p>
          <motion.div variants={rise} role="heading" aria-level={2} className="font-serif-lux mt-8 text-6xl leading-[1] text-chalk md:text-8xl">
            <span className="font-light">Tu auto, </span>
            <span className="font-normal italic text-chalk">sin límites.</span>
          </motion.div>
          <motion.p variants={rise} className="font-sans-tech mt-10 max-w-md text-[15px] leading-[1.95] text-neutral-400">
            Cuéntanos qué tienes en mente. Te respondemos con una propuesta y fecha de taller en menos de 24 horas.
          </motion.p>
          <motion.div variants={rise} className="mt-12">
            <MagBtn href={WHATSAPP}>
              <MessageCircle size={15} /> Agendar por WhatsApp
            </MagBtn>
          </motion.div>
        </div>

        <motion.form variants={rise} onSubmit={send} className={`${glass} p-8 md:p-12`}>
          <input required value={f.nombre} onChange={set("nombre")} placeholder="Nombre" className={field} />
          <input required value={f.auto} onChange={set("auto")} placeholder="Auto (marca, modelo, año)" className={field} />
          <select value={f.servicio} onChange={set("servicio")} className={field + " [&>option]:bg-[#050505]"}>
            <option>Escape & performance</option>
            <option>Llantas & frenos</option>
            <option>PPF & cerámico</option>
            <option>Proyecto completo</option>
          </select>
          <textarea rows={3} value={f.msg} onChange={set("msg")} placeholder="Cuéntanos tu idea" className={field + " resize-none"} />
          <button type="submit" className={btn + " mt-10 w-full cursor-pointer bg-transparent"}>
            Solicitar cotización <Send size={14} />
          </button>
        </motion.form>
      </motion.div>
    </section>
  );
}

/* ───────────── PROMO VORTEX + FOOTER ───────────── */
export function VortexPromo() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  /* el texto respira: sube levemente al hacer scroll sobre la sección */
  const breathY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const breathO = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const lineW = useTransform(scrollYProgress, [0.1, 0.55], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-white/10 bg-[#0A0A0A] px-6 py-28 md:px-10 md:py-36">
      {/* línea roja animada de fondo */}
      <motion.div style={{ width: lineW }} className="absolute left-0 top-0 h-px bg-gradient-to-r from-[#FF0033] to-transparent" />

      <motion.div
        style={{ y: breathY, opacity: breathO }}
        className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-12 md:flex-row md:items-center"
      >
        <div>
          <p className="font-sans-tech text-xs uppercase tracking-[0.35em] text-neutral-400">
            <span className="mr-3 inline-block h-2 w-2 animate-pulse rounded-full bg-[#FF0033] align-middle" />
            Demo creado por VORTEX Digital Solutions
          </p>
          <div role="heading" aria-level={2} className="font-serif-lux mt-6 text-4xl leading-tight text-chalk md:text-6xl">
            <span className="font-light">¿Quieres algo </span>
            <span className="font-normal italic text-neutral-400">similar?</span>
          </div>
          {/* separador con línea animada */}
          <div className="relative mt-6 h-px w-full max-w-[180px] bg-white/10">
            <motion.div
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.4, ease: EASE }}
              className="absolute left-0 top-0 h-px bg-[#FF0033]"
            />
          </div>
          <p className="font-sans-tech mt-6 max-w-lg text-[14px] leading-[1.95] text-neutral-400">
            Diseñamos páginas web de alto impacto para tu negocio: animaciones, fotografía y conversión.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <MagBtn href={`${VORTEX_URL}/#contacto`}>
            Quiero mi web <ArrowUpRight size={14} />
          </MagBtn>
          <MagBtn href={VORTEX_URL}>
            Ver VORTEX
          </MagBtn>
        </div>
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505] px-6 py-10 md:px-10">
      <div className="font-sans-tech mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-neutral-500 md:flex-row">
        <span>© A-FORCE — Demo ficticio</span>
        <a href={VORTEX_URL} target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 hover:text-white">
          Web by VORTEX Digital Solutions
        </a>
      </div>
    </footer>
  );
}
