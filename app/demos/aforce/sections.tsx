"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import { ArrowUpRight, Menu, X, Gauge, Zap, CalendarDays, MessageCircle, Send } from "lucide-react";
import { ATELIER, BUILDS, IMG, NAV, STATS, VORTEX_URL, WHATSAPP } from "./data";

const EASE = [0.16, 1, 0.3, 1] as const;

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};
const view = { once: true, amount: 0.25 } as const;

const eyebrow =
  "font-sans-tech text-[11px] font-semibold uppercase tracking-[0.32em] text-gold";

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
        <a href="#top" className="font-serif-lux text-2xl font-semibold tracking-[0.18em] text-chalk">
          A<span className="text-gold">—</span>FORCE
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="font-sans-tech group relative text-[11px] font-medium uppercase tracking-[0.28em] text-chalk/70 transition-colors hover:text-chalk"
            >
              {n.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <a
          href="#contacto"
          className="font-sans-tech relative hidden overflow-hidden rounded-full p-px text-[11px] font-semibold uppercase tracking-[0.25em] text-chalk md:inline-block"
        >
          <motion.span
            aria-hidden
            className="absolute inset-[-100%]"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0 70%, #c9a961 85%, transparent 100%)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, ease: "linear", repeat: Infinity }}
          />
          <span className="relative block rounded-full bg-[#0b0b0b] px-6 py-3 transition-colors hover:bg-[#141414]">
            Cotizar proyecto
          </span>
        </a>

        <button
          aria-label="Menú"
          onClick={() => setOpen((o) => !o)}
          className="text-chalk md:hidden"
          style={{ background: "none", border: 0 }}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="overflow-hidden md:hidden"
      >
        <div className="flex flex-col gap-5 px-6 pb-8 pt-2">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="font-serif-lux text-3xl text-chalk"
            >
              {n.label}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.header>
  );
}

/* ───────────── HERO ───────────── */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const words1 = ["REFUSE"];
  const words2 = ["ORDINARY."];

  return (
    <section id="top" ref={ref} className="relative h-[110vh] min-h-[760px] overflow-hidden bg-ink">
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0">
        <Image src={IMG.hero} alt="Superdeportivo en la oscuridad, faros traseros rojos" fill priority sizes="100vw" className="object-cover" style={{ objectPosition: "50% 52%" }} />
      </motion.div>
      {/* gradientes de profundidad */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_0%,rgba(11,11,11,0.55)_55%,#0b0b0b_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-[#0b0b0b]" />

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 mx-auto flex h-screen min-h-[760px] max-w-[1400px] flex-col justify-end px-6 pb-24 md:px-10 md:pb-28"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.6em" }}
          animate={{ opacity: 1, letterSpacing: "0.32em" }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}
          className={eyebrow + " mb-8"}
        >
          High-End · Detailing · Modificaciones
        </motion.p>

        <div
          role="heading"
          aria-level={1}
          className="font-serif-lux text-[clamp(64px,14vw,230px)] font-medium leading-[0.86] tracking-[-0.02em] text-chalk"
        >
          {[words1, words2].map((line, li) => (
            <div key={li} className="overflow-hidden pb-[0.06em]">
              {line.map((w) => (
                <motion.span
                  key={w}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 1.3, ease: EASE, delay: 0.5 + li * 0.18 }}
                  className={"inline-block " + (li === 1 ? "italic text-chalk/90" : "")}
                >
                  {w}
                </motion.span>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.4 }}
            className="font-sans-tech max-w-md text-[12px] uppercase leading-[2] tracking-[0.22em] text-chalk/60"
          >
            Ingeniería, tapicería y protección para los autos que no admiten versión estándar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.6 }}
            className="flex flex-wrap gap-4"
          >
            <motion.a
              href="#inventario"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="font-sans-tech inline-flex items-center gap-3 bg-chalk px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink"
            >
              Explore builds <ArrowUpRight size={15} />
            </motion.a>
            <motion.a
              href="#contacto"
              whileHover={{ scale: 1.04, borderColor: "#c9a961", color: "#c9a961" }}
              whileTap={{ scale: 0.97 }}
              className="font-sans-tech inline-flex items-center gap-3 border border-white/30 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-chalk"
            >
              Start your project
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="h-10 w-px bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>
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
      className="border-y border-white/10 bg-ink-2"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-10 px-6 py-14 md:grid-cols-4 md:px-10">
        {STATS.map((s) => (
          <motion.div key={s.l} variants={rise} className="text-center md:text-left">
            <div className="font-serif-lux text-6xl text-chalk md:text-7xl">{s.v}</div>
            <div className="font-sans-tech mt-2 text-[10px] uppercase tracking-[0.3em] text-chalk/50">
              {s.l}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

/* ───────────── SHOWCASE (split-grid editorial) ───────────── */
function AtelierRow({ item, flip }: { item: (typeof ATELIER)[number]; flip: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className="grid items-center gap-10 md:grid-cols-12 md:gap-16">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={view}
        className={"md:col-span-5 " + (flip ? "md:order-2" : "")}
      >
        <motion.div variants={rise} className="font-serif-lux text-8xl leading-none text-white/10">
          {item.n}
        </motion.div>
        <motion.p variants={rise} className={eyebrow + " mt-4"}>
          {item.eyebrow}
        </motion.p>
        <motion.div
          variants={rise}
          role="heading"
          aria-level={2}
          className="font-serif-lux mt-6 whitespace-pre-line text-5xl leading-[1.02] text-chalk md:text-6xl"
        >
          {item.title}
        </motion.div>
        <motion.p variants={rise} className="font-sans-tech mt-7 max-w-md text-[15px] leading-[1.9] text-chalk/60">
          {item.body}
        </motion.p>
        <motion.ul variants={rise} className="mt-8 flex flex-wrap gap-3" style={{ padding: 0, listStyle: "none" }}>
          {item.specs.map((sp) => (
            <li
              key={sp}
              className="font-sans-tech border border-white/15 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-chalk/70"
            >
              {sp}
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.div
        initial={{ clipPath: "inset(12% 12% 12% 12%)", opacity: 0 }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
        viewport={view}
        transition={{ duration: 1.4, ease: EASE }}
        className={"relative aspect-[4/5] overflow-hidden md:col-span-7 md:aspect-[5/4] " + (flip ? "md:order-1" : "")}
      >
        <motion.div style={{ y }} className="absolute inset-[-10%]">
          <Image src={item.img} alt={item.eyebrow} fill sizes="(min-width:768px) 58vw, 100vw" className="object-cover" style={{ objectPosition: item.pos, transform: `scale(${item.zoom})`, transformOrigin: item.pos }} />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="pointer-events-none absolute inset-4 border border-white/10" />
      </motion.div>
    </div>
  );
}

export function Atelier() {
  return (
    <section id="atelier" className="bg-ink px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={view} className="mb-24 max-w-3xl">
          <motion.p variants={rise} className={eyebrow}>El Atelier</motion.p>
          <motion.div
            variants={rise}
            role="heading"
            aria-level={2}
            className="font-serif-lux mt-6 text-6xl leading-[0.98] text-chalk md:text-8xl"
          >
            Obsesión por el <span className="italic text-gold">detalle</span>.
          </motion.div>
        </motion.div>
        <div className="flex flex-col gap-32 md:gap-44">
          {ATELIER.map((it, i) => (
            <AtelierRow key={it.id} item={it} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── CATÁLOGO ───────────── */
function BuildCard({ b }: { b: (typeof BUILDS)[number] }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const imgX = useTransform(sx, [-0.5, 0.5], [14, -14]);
  const imgY = useTransform(sy, [-0.5, 0.5], [10, -10]);

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
    b.tag === "Disponible" ? "text-gold border-gold/50" : b.tag === "En proceso" ? "text-chalk border-white/40" : "text-chalk/40 border-white/15";

  return (
    <motion.article variants={rise} style={{ perspective: 1000 }}>
      <motion.div
        onMouseMove={move}
        onMouseLeave={leave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.02, boxShadow: "0 0 0 1px rgba(201,169,97,0.55), 0 30px 80px -20px rgba(201,169,97,0.25)" }}
        transition={{ duration: 0.4, ease: EASE }}
        className="group relative overflow-hidden border border-white/10 bg-[#101011]"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.div style={{ x: imgX, y: imgY }} className="absolute inset-[-6%]">
            <Image
              src={b.img}
              alt={`${b.make} ${b.name}`}
              fill
              sizes="(min-width:1024px) 33vw, 100vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              style={{ objectPosition: b.pos }}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#101011] via-black/10 to-transparent" />
          <span
            className={`font-sans-tech absolute left-5 top-5 border bg-black/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] backdrop-blur ${tagColor}`}
          >
            {b.tag}
          </span>
        </div>

        <div className="p-7">
          <p className="font-sans-tech text-[10px] uppercase tracking-[0.3em] text-chalk/40">{b.make}</p>
          <div role="heading" aria-level={3} className="font-serif-lux mt-2 text-4xl text-chalk">
            {b.name}
          </div>

          <div className="font-sans-tech mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-5">
            {[
              { i: <Gauge size={14} />, l: "0-100", v: b.zero },
              { i: <Zap size={14} />, l: "Potencia", v: b.hp },
              { i: <CalendarDays size={14} />, l: "Año", v: b.year },
            ].map((m) => (
              <div key={m.l}>
                <div className="flex items-center gap-1.5 text-gold">{m.i}<span className="text-[9px] uppercase tracking-[0.2em] text-chalk/40">{m.l}</span></div>
                <div className="mt-1.5 text-[15px] font-semibold text-chalk">{m.v}</div>
              </div>
            ))}
          </div>

          <a
            href="#contacto"
            className="font-sans-tech mt-7 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.25em] text-chalk/70 transition-colors group-hover:text-gold"
          >
            Consultar <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
        </div>
      </motion.div>
    </motion.article>
  );
}

export function Inventario() {
  return (
    <section id="inventario" className="border-t border-white/10 bg-ink-2 px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={view} className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <motion.p variants={rise} className={eyebrow}>Inventario & Builds</motion.p>
            <motion.div variants={rise} role="heading" aria-level={2} className="font-serif-lux mt-6 text-6xl leading-none text-chalk md:text-8xl">
              Colección <span className="italic text-gold">actual</span>
            </motion.div>
          </div>
          <motion.p variants={rise} className="font-sans-tech max-w-xs text-[13px] leading-[1.9] text-chalk/50">
            Piezas seleccionadas y proyectos en taller. Cada unidad, inspeccionada y documentada.
          </motion.p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={view} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {BUILDS.map((b) => (
            <BuildCard key={b.name} b={b} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────── CTA + FORM ───────────── */
export function Contacto() {
  const [f, setF] = useState({ nombre: "", auto: "", servicio: "Tapicería a medida", msg: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hola A-FORCE, soy ${f.nombre}. Auto: ${f.auto}. Servicio: ${f.servicio}. ${f.msg}`;
    window.open(`${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const field =
    "font-sans-tech w-full border-0 border-b border-white/20 bg-transparent px-0 py-4 text-[14px] text-chalk outline-none transition-colors placeholder:text-chalk/30 focus:border-gold";

  return (
    <section id="contacto" className="relative overflow-hidden bg-ink px-6 py-28 md:px-10 md:py-40">
      <div className="absolute inset-0 opacity-30">
        <Image src={IMG.porsche} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0b] via-[#0b0b0b]/85 to-[#0b0b0b]" />

      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={view} className="relative mx-auto grid max-w-[1400px] gap-16 md:grid-cols-2">
        <div>
          <motion.p variants={rise} className={eyebrow}>Start your project</motion.p>
          <motion.div variants={rise} role="heading" aria-level={2} className="font-serif-lux mt-6 text-6xl leading-[0.98] text-chalk md:text-8xl">
            Tu auto, <span className="italic text-gold">sin límites.</span>
          </motion.div>
          <motion.p variants={rise} className="font-sans-tech mt-8 max-w-md text-[15px] leading-[1.9] text-chalk/60">
            Cuéntanos qué tienes en mente. Te respondemos con una propuesta y fecha de taller en menos de 24 horas.
          </motion.p>
          <motion.a
            variants={rise}
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="font-sans-tech mt-10 inline-flex items-center gap-3 border border-gold/60 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold"
          >
            <MessageCircle size={16} /> Agendar por WhatsApp
          </motion.a>
        </div>

        <motion.form variants={rise} onSubmit={send} className="border border-white/10 bg-black/40 p-8 backdrop-blur-md md:p-12">
          <input required value={f.nombre} onChange={set("nombre")} placeholder="Nombre" className={field} />
          <input required value={f.auto} onChange={set("auto")} placeholder="Auto (marca, modelo, año)" className={field} />
          <select value={f.servicio} onChange={set("servicio")} className={field + " [&>option]:bg-[#0b0b0b]"}>
            <option>Tapicería a medida</option>
            <option>Escape & performance</option>
            <option>PPF & cerámico</option>
            <option>Proyecto completo</option>
          </select>
          <textarea rows={3} value={f.msg} onChange={set("msg")} placeholder="Cuéntanos tu idea" className={field + " resize-none"} />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="font-sans-tech mt-8 flex w-full cursor-pointer items-center justify-center gap-3 border-0 bg-chalk px-8 py-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink"
          >
            Solicitar cotización <Send size={15} />
          </motion.button>
        </motion.form>
      </motion.div>
    </section>
  );
}

/* ───────────── PROMO VORTEX + FOOTER ───────────── */
export function VortexPromo() {
  return (
    <section className="border-t border-white/10 bg-[#0a0a0b] px-6 py-24 md:px-10">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={view} className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-10 md:flex-row md:items-center">
        <div>
          <motion.p variants={rise} className="font-sans-tech text-[11px] font-semibold uppercase tracking-[0.32em] text-[#4f8cff]">
            Demo creado por VORTEX Digital Solutions
          </motion.p>
          <motion.div variants={rise} role="heading" aria-level={2} className="font-serif-lux mt-4 text-4xl leading-tight text-chalk md:text-6xl">
            ¿Quieres algo similar? <span className="italic text-chalk/60">Contáctanos.</span>
          </motion.div>
          <motion.p variants={rise} className="font-sans-tech mt-4 max-w-lg text-[14px] leading-[1.9] text-chalk/50">
            Diseñamos páginas web de alto impacto para tu negocio: animaciones, fotografía y conversión.
          </motion.p>
        </div>
        <motion.div variants={rise} className="flex flex-wrap gap-4">
          <motion.a href={`${VORTEX_URL}/#contacto`} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="font-sans-tech inline-flex items-center gap-3 bg-[#2f6bff] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white">
            Quiero mi web <ArrowUpRight size={15} />
          </motion.a>
          <motion.a href={VORTEX_URL} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="font-sans-tech inline-flex items-center gap-3 border border-white/25 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-chalk">
            Ver VORTEX
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink px-6 py-10 md:px-10">
      <div className="font-sans-tech mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 text-[10px] uppercase tracking-[0.25em] text-chalk/40 md:flex-row">
        <span>© A-FORCE — Demo ficticio</span>
        <a href={VORTEX_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-chalk">
          Web by VORTEX Digital Solutions
        </a>
      </div>
    </footer>
  );
}
