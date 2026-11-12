"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ORIGEN — Café de Especialidad  |  Demo page para VORTEX
// Stack: Next.js App Router · Tailwind CSS v4 · framer-motion v14 · lucide-react
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  MapPin,
  Clock,
  Wifi,
  Zap,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  X,
} from "lucide-react";

// ─── Rutas centralizadas de las 6 fotos ───────────────────────────────────────
const PHOTOS = {
  heroDrink:    "/images/cafe/hero-drink.jpg",
  heroDetail:   "/images/cafe/hero-detail.jpg",
  favFlatWhite: "/images/cafe/fav-flatwhite.jpg",
  favCroissant: "/images/cafe/fav-croissant.jpg",
  espacioSalon:  "/images/cafe/espacio-salon.jpg",
  espacioTrabajo:"/images/cafe/espacio-trabajo.jpg",
};

// ─── Paleta ───────────────────────────────────────────────────────────────────
// bg: #F7F4EF  superficie: #EFECE6  typo-bg: #E6E0D6  bloque-final: #241C18
// texto: #1C1917  secundario: #57534E  acento: #B45309  divisor: #E2DDD5

// ─── Tipografía — Google Fonts via <style> ────────────────────────────────────
const FontLink = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    {/* eslint-disable-next-line @next/next/no-page-custom-font */}
    <link
      href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </>
);

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface MenuItem {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: "espresso" | "filtrados" | "panaderia";
}

interface CartItem extends MenuItem {
  qty: number;
}

// ─── Datos del menú ───────────────────────────────────────────────────────────
const MENU_ITEMS: MenuItem[] = [
  // Espresso
  { id: "e1", nombre: "Espresso",       descripcion: "Extracción pura, 25 ml",          precio: 2.50, categoria: "espresso" },
  { id: "e2", nombre: "Flat White",     descripcion: "Doble ristretto, leche texturizada",precio: 4.50, categoria: "espresso" },
  { id: "e3", nombre: "Cortado",        descripcion: "Equilibrio espresso y leche caliente",precio: 3.00, categoria: "espresso" },
  { id: "e4", nombre: "Cappuccino",     descripcion: "Espuma sedosa, cacao al final",    precio: 4.00, categoria: "espresso" },
  { id: "e5", nombre: "Latte",          descripcion: "Cremoso, suave, con arte latte",   precio: 4.50, categoria: "espresso" },
  { id: "e6", nombre: "Iced Latte",     descripcion: "Latte frío sobre hielo artesanal", precio: 5.00, categoria: "espresso" },
  // Filtrados
  { id: "f1", nombre: "V60",            descripcion: "Filtrado manual, origen Etiopía",  precio: 4.50, categoria: "filtrados" },
  { id: "f2", nombre: "Chemex",         descripcion: "Claridad brillante, cuerpo ligero",precio: 5.00, categoria: "filtrados" },
  { id: "f3", nombre: "Cold Brew",      descripcion: "12 h de extracción en frío",       precio: 5.50, categoria: "filtrados" },
  { id: "f4", nombre: "Aeropress",      descripcion: "Concentrado, versátil y directo",  precio: 4.00, categoria: "filtrados" },
  // Panadería
  { id: "p1", nombre: "Croissant",      descripcion: "Mantequilla europea, hojaldrado",  precio: 3.00, categoria: "panaderia" },
  { id: "p2", nombre: "Banana Bread",   descripcion: "Húmedo, con nueces tostadas",      precio: 3.50, categoria: "panaderia" },
  { id: "p3", nombre: "Pain au Choc.",  descripcion: "Chocolate 70% Cacao de Altura",    precio: 3.50, categoria: "panaderia" },
];

const TAB_LABELS: { key: MenuItem["categoria"]; label: string }[] = [
  { key: "espresso",  label: "Espresso" },
  { key: "filtrados", label: "Filtrados" },
  { key: "panaderia", label: "Panadería" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n.toLocaleString("es-SV", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

function buildWhatsApp(cart: CartItem[]): string {
  const lines = cart
    .map((i) => `• ${i.qty}× ${i.nombre} — ${fmt(i.precio * i.qty)}`)
    .join("%0A");
  const total = fmt(cart.reduce((s, i) => s + i.precio * i.qty, 0));
  const text = `Hola ORIGEN, quiero ordenar:%0A%0A${lines}%0A%0ATotal: ${total}`;
  return `https://wa.me/50300000000?text=${text}`;
}

// ─── Curvas ───────────────────────────────────────────────────────────────────
const EASE_EDITORIAL = [0.23, 1, 0.32, 1] as [number, number, number, number];
const EASE_DRAWER    = [0.32, 0.72, 0, 1]  as [number, number, number, number];

// ─────────────────────────────────────────────────────────────────────────────
// 1. NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
function Navbar({ onCarta }: { onCarta: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Carta",     action: onCarta },
    { label: "Tueste",    action: () => document.getElementById("tueste")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "El Espacio",action: () => document.getElementById("espacio")?.scrollIntoView({ behavior: "smooth" }) },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(247,244,239,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #E2DDD5" : "none",
      }}
    >
      <nav className="max-w-[1120px] mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <span
          className="text-[22px] tracking-tight select-none"
          style={{ fontFamily: "'Newsreader', serif", color: scrolled ? "#1C1917" : "#F7F4EF" }}
        >
          ORIGEN.
        </span>

        {/* Links desktop */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {links.map((l) => (
            <li key={l.label}>
              <button
                onClick={l.action}
                className="text-sm font-medium transition-opacity duration-200 hover:opacity-70 bg-transparent border-0 cursor-pointer"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: scrolled ? "#57534E" : "rgba(247,244,239,0.85)" }}
              >
                {l.label}
              </button>
            </li>
          ))}
          <li>
            <a
              href="https://wa.me/50300000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-[0.97]"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                backgroundColor: "#B45309",
                color: "#F7F4EF",
              }}
            >
              Pedir por WhatsApp
            </a>
          </li>
        </ul>

        {/* Burger móvil */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 min-h-[44px] min-w-[44px] flex flex-col justify-center items-center gap-1.5 bg-transparent border-0 cursor-pointer"
          aria-label="Menú"
        >
          <span className="block w-5 h-0.5 transition-all duration-200" style={{ backgroundColor: scrolled ? "#1C1917" : "#F7F4EF", transform: menuOpen ? "rotate(45deg) translate(2px,2px)" : "none" }} />
          <span className="block w-5 h-0.5 transition-all duration-200" style={{ backgroundColor: scrolled ? "#1C1917" : "#F7F4EF", opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-5 h-0.5 transition-all duration-200" style={{ backgroundColor: scrolled ? "#1C1917" : "#F7F4EF", transform: menuOpen ? "rotate(-45deg) translate(2px,-2px)" : "none" }} />
        </button>
      </nav>

      {/* Menú móvil desplegable */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_EDITORIAL }}
            className="md:hidden overflow-hidden"
            style={{ backgroundColor: "#F7F4EF", borderBottom: "1px solid #E2DDD5" }}
          >
            <div className="px-5 pb-5 pt-2 flex flex-col gap-3">
              {links.map((l) => (
                <button
                  key={l.label}
                  onClick={() => { l.action(); setMenuOpen(false); }}
                  className="text-left text-base font-medium py-2 bg-transparent border-0 cursor-pointer min-h-[44px]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#57534E" }}
                >
                  {l.label}
                </button>
              ))}
              <a
                href="https://wa.me/50300000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold mt-1 min-h-[44px]"
                style={{ backgroundColor: "#B45309", color: "#F7F4EF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Pedir por WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. HERO EDITORIAL SPLIT
// ─────────────────────────────────────────────────────────────────────────────
function Hero({ onCarta }: { onCarta: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Capas a distinta velocidad (GPU via transform)
  const yTitle = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const yPhoto = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const yCard  = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative overflow-hidden"
      style={{ minHeight: "100svh", backgroundColor: "#1C1917" }}
    >
      {/* Capa 1 — Texto gigante de fondo */}
      <motion.div
        style={{ y: yTitle, willChange: "transform" }}
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
      >
        <span
          className="text-[22vw] md:text-[18vw] font-light leading-none tracking-tighter"
          style={{
            fontFamily: "'Newsreader', serif",
            color: "#2C2420",
            whiteSpace: "nowrap",
          }}
        >
          ORIGEN
        </span>
      </motion.div>

      {/* Overlay gradiente */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(28,25,23,0.3) 0%, rgba(28,25,23,0.1) 40%, rgba(28,25,23,0.6) 100%)",
        }}
      />

      {/* Layout principal */}
      <div className="relative z-10 max-w-[1120px] mx-auto px-5 min-h-[100svh] flex flex-col md:flex-row items-center md:items-end pb-16 pt-32 gap-8 md:gap-16">

        {/* Columna izq — Copy */}
        <div className="flex-1 flex flex-col justify-end">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: EASE_EDITORIAL }}
            className="text-xs font-semibold tracking-[0.18em] uppercase mb-5"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#B45309" }}
          >
            Café de Especialidad · El Salvador
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: EASE_EDITORIAL }}
            className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] mb-6"
            style={{ fontFamily: "'Newsreader', serif", color: "#F7F4EF" }}
          >
            Donde el{" "}
            <em style={{ fontStyle: "italic", color: "#F7F4EF" }}>grano</em>
            <br />
            cuenta su historia.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: EASE_EDITORIAL }}
            className="text-base md:text-lg leading-relaxed mb-8 max-w-[480px]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "rgba(247,244,239,0.72)" }}
          >
            Cada taza es el resultado de semanas de trabajo entre el productor y el tostador.
            Espresso de altura, V60, Cold Brew y panadería artesanal.
          </motion.p>

          {/* CTA + métricas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7, ease: EASE_EDITORIAL }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6"
          >
            <button
              onClick={onCarta}
              className="inline-flex items-center gap-3 px-7 py-4 rounded-full text-sm font-semibold transition-all duration-[160ms] active:scale-[0.97] min-h-[44px]"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                backgroundColor: "#B45309",
                color: "#F7F4EF",
                transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)",
              }}
            >
              Explorar Carta <ArrowRight size={16} />
            </button>

            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-lg font-semibold tabular-nums" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F7F4EF" }}>4.9 ★</span>
                <span className="text-xs" style={{ color: "rgba(247,244,239,0.55)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>en Google</span>
              </div>
              <div className="w-px h-8" style={{ backgroundColor: "rgba(247,244,239,0.2)" }} />
              <div className="flex flex-col">
                <span className="text-lg font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F7F4EF" }}>100%</span>
                <span className="text-xs" style={{ color: "rgba(247,244,239,0.55)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Grano Altura</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Columna der — Composición fotográfica */}
        <div className="relative w-full md:w-[380px] lg:w-[420px] flex-shrink-0">

          {/* Foto principal — heroDrink */}
          <motion.div
            style={{ y: yPhoto, willChange: "transform" }}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ delay: 0.4, duration: 0.9, ease: EASE_EDITORIAL }}
            className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden"
          >
            <Image
              src={PHOTOS.heroDrink}
              alt="Bebida fría protagonista ORIGEN"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 768px) 100vw, 420px"
            />
          </motion.div>

          {/* Tarjeta flotante — heroDetail */}
          <motion.div
            style={{ y: yCard, willChange: "transform" }}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.7, ease: EASE_EDITORIAL }}
            className="absolute -left-4 md:-left-14 bottom-10 w-44 md:w-52 rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="relative aspect-[4/5]">
              <Image
                src={PHOTOS.heroDetail}
                alt="Extracción de espresso ORIGEN"
                fill
                className="object-cover object-center"
                sizes="208px"
              />
            </div>
            <div className="px-3 py-2.5" style={{ backgroundColor: "#F7F4EF" }}>
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[11px] font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1C1917" }}>
                  Abierto hoy
                </span>
              </div>
              <span className="text-[10px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#57534E" }}>
                Cierra 7:00 PM
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. FICHA DE TUESTE
// ─────────────────────────────────────────────────────────────────────────────
function Tueste() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const specs = [
    { num: "01", titulo: "Origen Santa Ana",    desc: "Fincas de 1 500–2 000 m s. n. m. en las laderas del volcán de Santa Ana, El Salvador. Varietales bourbon y pacamara seleccionados por el productor." },
    { num: "02", titulo: "Tueste Semanal",       desc: "Lote fresco cada lunes. Curvas de tueste diseñadas según el perfil de cada lote. Punto City+ para espresso, City para filtrados." },
    { num: "03", titulo: "Extracción Precisa",   desc: "Molino EK43 calibrado por turno. Receta de espresso 1 : 2 en 27 s. V60 con agua filtrada a 94 °C y agitación controlada." },
  ];

  return (
    <section id="tueste" className="py-20 md:py-28 overflow-x-clip" style={{ backgroundColor: "#F7F4EF" }}>
      <div className="max-w-[1120px] mx-auto px-5">
        {/* Encabezado */}
        <div className="mb-14" style={{ borderBottom: "1px solid #E2DDD5", paddingBottom: "2.5rem" }}>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#B45309" }}>
            Nuestro proceso
          </p>
          <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "'Newsreader', serif", color: "#1C1917" }}>
            Tostado con cuidado.
          </h2>
        </div>

        {/* Grid de especificaciones */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3">
          {specs.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.7, ease: EASE_EDITORIAL }}
              className="py-10 md:py-0 md:px-8 first:md:pl-0 last:md:pr-0"
              style={{
                borderRight: i < 2 ? "1px solid #E2DDD5" : "none",
                borderTop: i > 0 ? "1px solid #E2DDD5" : "none",
              }}
            >
              <span
                className="block text-5xl font-light mb-6 leading-none"
                style={{ fontFamily: "'Newsreader', serif", color: "#E6E0D6" }}
              >
                {s.num}
              </span>
              <h3 className="text-xl font-medium mb-3" style={{ fontFamily: "'Newsreader', serif", color: "#1C1917" }}>
                {s.titulo}
              </h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#57534E" }}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4a. FAVORITOS DE TEMPORADA
// ─────────────────────────────────────────────────────────────────────────────
function RevealPhoto({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={inView ? { clipPath: "inset(0 0 0% 0)" } : {}}
      transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
      className="w-full h-full"
    >
      <Image src={src} alt={alt} fill className="object-cover object-center" sizes={sizes} />
    </motion.div>
  );
}

function Favoritos({ onAddToCart }: { onAddToCart: (item: MenuItem) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const favs = [
    {
      foto: PHOTOS.favFlatWhite,
      nombre: "Flat White",
      notas: "Cremoso · Avellana · Caramelo",
      precio: 4.50,
      item: MENU_ITEMS.find(m => m.id === "e2")!,
    },
    {
      foto: PHOTOS.heroDrink,
      nombre: "Iced Latte",
      notas: "Frío · Suave · Citrus",
      precio: 5.00,
      item: MENU_ITEMS.find(m => m.id === "e6")!,
    },
    {
      foto: PHOTOS.favCroissant,
      nombre: "Croissant",
      notas: "Hojaldrado · Mantequilla · Crujiente",
      precio: 3.00,
      item: MENU_ITEMS.find(m => m.id === "p1")!,
    },
  ];

  return (
    <section className="py-20 md:py-28 overflow-x-clip" style={{ backgroundColor: "#EFECE6" }}>
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#B45309" }}>
              Lo más pedido
            </p>
            <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "'Newsreader', serif", color: "#1C1917" }}>
              Favoritos de{" "}
              <em style={{ fontStyle: "italic" }}>temporada.</em>
            </h2>
          </div>
          <p className="text-sm max-w-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#57534E" }}>
            Selección semanal basada en las cosechas disponibles y lo que más disfrutan nuestros clientes.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
          {favs.map((f, i) => (
            <motion.div
              key={f.nombre}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.7, ease: EASE_EDITORIAL }}
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: "#F7F4EF" }}
            >
              {/* Foto */}
              <div className="relative w-full aspect-[4/5] overflow-hidden">
                <RevealPhoto src={f.foto} alt={f.nombre} sizes="(max-width: 640px) 100vw, 33vw" />
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-xl font-medium mb-1" style={{ fontFamily: "'Newsreader', serif", color: "#1C1917" }}>
                  {f.nombre}
                </h3>
                <p className="text-xs mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#57534E" }}>
                  {f.notas}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-lg font-semibold tabular-nums"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1C1917" }}
                  >
                    {fmt(f.precio)}
                  </span>
                  <button
                    onClick={() => onAddToCart(f.item)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-[160ms] active:scale-[0.97] min-h-[44px]"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      backgroundColor: "#1C1917",
                      color: "#F7F4EF",
                      transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)",
                    }}
                  >
                    <Plus size={14} /> Agregar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4b. CARTA FILTRABLE
// ─────────────────────────────────────────────────────────────────────────────
function Carta({
  cart,
  onAdd,
  onRemove,
}: {
  cart: CartItem[];
  onAdd: (item: MenuItem) => void;
  onRemove: (id: string) => void;
}) {
  const [tab, setTab] = useState<MenuItem["categoria"]>("espresso");
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const tabBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const btn = tabRefs.current[tab];
    const bar = tabBarRef.current;
    if (btn && bar) {
      const bRect = bar.getBoundingClientRect();
      const bBtn  = btn.getBoundingClientRect();
      setIndicatorStyle({ left: bBtn.left - bRect.left, width: bBtn.width });
    }
  }, [tab]);

  const visible = MENU_ITEMS.filter((m) => m.categoria === tab);

  return (
    <section id="carta" className="py-20 md:py-28 overflow-x-clip" style={{ backgroundColor: "#F7F4EF" }}>
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#B45309" }}>
            Lo que servimos
          </p>
          <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "'Newsreader', serif", color: "#1C1917" }}>
            Nuestra carta.
          </h2>
        </div>

        {/* Pestañas */}
        <div ref={tabBarRef} className="relative flex gap-2 mb-10 border-b" style={{ borderColor: "#E2DDD5" }}>
          {TAB_LABELS.map(({ key, label }) => (
            <button
              key={key}
              ref={(el) => { tabRefs.current[key] = el; }}
              onClick={() => setTab(key)}
              className="relative pb-3 px-1 mr-5 text-sm font-medium transition-colors duration-180 bg-transparent border-0 cursor-pointer min-h-[44px]"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: tab === key ? "#1C1917" : "#57534E",
                transitionTimingFunction: "ease-out",
              }}
            >
              {label}
            </button>
          ))}
          {/* Indicador animado */}
          <motion.div
            className="absolute bottom-0 h-0.5"
            animate={indicatorStyle}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ backgroundColor: "#1C1917" }}
          />
        </div>

        {/* Lista de ítems */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE_EDITORIAL }}
          >
            {visible.map((item, i) => {
              const cartItem = cart.find((c) => c.id === item.id);
              const qty = cartItem?.qty ?? 0;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4"
                  style={{ borderBottom: i < visible.length - 1 ? "1px solid #E2DDD5" : "none" }}
                >
                  <div className="flex-1 mr-4">
                    <h4 className="text-base font-medium" style={{ fontFamily: "'Newsreader', serif", color: "#1C1917" }}>
                      {item.nombre}
                    </h4>
                    <p className="text-xs mt-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#57534E" }}>
                      {item.descripcion}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-base font-semibold tabular-nums w-14 text-right" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1C1917" }}>
                      {fmt(item.precio)}
                    </span>

                    {qty === 0 ? (
                      <button
                        onClick={() => onAdd(item)}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-[160ms] active:scale-[0.97] min-h-[44px] min-w-[44px]"
                        style={{
                          backgroundColor: "#1C1917",
                          color: "#F7F4EF",
                          transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)",
                        }}
                        aria-label={`Agregar ${item.nombre}`}
                      >
                        <Plus size={16} />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onRemove(item.id)}
                          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-[160ms] active:scale-[0.97] min-h-[44px] min-w-[44px] border"
                          style={{
                            borderColor: "#E2DDD5",
                            color: "#1C1917",
                            transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)",
                          }}
                          aria-label={`Quitar ${item.nombre}`}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-base font-semibold tabular-nums w-5 text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#B45309" }}>
                          {qty}
                        </span>
                        <button
                          onClick={() => onAdd(item)}
                          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-[160ms] active:scale-[0.97] min-h-[44px] min-w-[44px]"
                          style={{
                            backgroundColor: "#B45309",
                            color: "#F7F4EF",
                            transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)",
                          }}
                          aria-label={`Sumar ${item.nombre}`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4c. BARRA INFERIOR (DRAWER) DEL CARRITO
// ─────────────────────────────────────────────────────────────────────────────
function CartDrawer({ cart, onClear }: { cart: CartItem[]; onClear: () => void }) {
  const total = cart.reduce((s, i) => s + i.precio * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const show  = count > 0;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.42, ease: EASE_DRAWER }}
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe"
          style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
        >
          <div
            className="max-w-lg mx-auto rounded-2xl p-4 shadow-2xl flex items-center gap-4"
            style={{ backgroundColor: "#1C1917" }}
          >
            {/* Icono y conteo */}
            <div className="relative flex-shrink-0">
              <ShoppingBag size={22} className="text-white" />
              <span
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center tabular-nums"
                style={{ backgroundColor: "#B45309", color: "#F7F4EF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {count}
              </span>
            </div>

            {/* Total */}
            <div className="flex-1">
              <p className="text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "rgba(247,244,239,0.6)" }}>
                Tu pedido
              </p>
              <p className="text-base font-semibold tabular-nums" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F7F4EF" }}>
                {fmt(total)}
              </p>
            </div>

            {/* Botón WhatsApp */}
            <a
              href={buildWhatsApp(cart)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-[160ms] active:scale-[0.97] min-h-[44px]"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                backgroundColor: "#B45309",
                color: "#F7F4EF",
                transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)",
              }}
            >
              Pedir por WhatsApp
            </a>

            {/* Limpiar */}
            <button
              onClick={onClear}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-opacity duration-200 hover:opacity-70 bg-transparent border-0 cursor-pointer"
              style={{ color: "rgba(247,244,239,0.5)" }}
              aria-label="Vaciar carrito"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EL ESPACIO Y UBICACIÓN (bloque oscuro)
// ─────────────────────────────────────────────────────────────────────────────
function Espacio() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const horarios = [
    { dia: "Lunes – Viernes", hora: "7:00 AM – 7:00 PM" },
    { dia: "Sábado",          hora: "8:00 AM – 7:00 PM" },
    { dia: "Domingo",         hora: "8:00 AM – 6:00 PM" },
  ];

  return (
    <section id="espacio" className="py-20 md:py-28 overflow-x-clip" style={{ backgroundColor: "#241C18" }}>
      <div className="max-w-[1120px] mx-auto px-5">

        {/* Encabezado */}
        <div className="mb-14" style={{ borderBottom: "1px solid rgba(226,221,213,0.15)", paddingBottom: "2.5rem" }}>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#B45309" }}>
            Nuestro lugar
          </p>
          <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "'Newsreader', serif", color: "#F7F4EF" }}>
            Un espacio para{" "}
            <em style={{ fontStyle: "italic" }}>trabajar, leer</em>
            <br className="hidden md:block" /> y quedarte.
          </h2>
        </div>

        {/* Grid asimétrico */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">

          {/* Foto salon — protagonista */}
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={inView ? { clipPath: "inset(0 0 0% 0)" } : {}}
            transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
            className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden md:row-span-2"
          >
            <Image
              src={PHOTOS.espacioSalon}
              alt="Salón principal ORIGEN"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          {/* Foto trabajo */}
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={inView ? { clipPath: "inset(0 0 0% 0)" } : {}}
            transition={{ delay: 0.15, duration: 0.8, ease: EASE_EDITORIAL }}
            className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden"
          >
            <Image
              src={PHOTOS.espacioTrabajo}
              alt="Ambiente de trabajo ORIGEN"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          {/* Bloque de info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.7, ease: EASE_EDITORIAL }}
            className="rounded-2xl p-6 md:p-8"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
            {/* Horarios */}
            <h3 className="text-base font-semibold mb-4 tracking-wide uppercase text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#B45309", letterSpacing: "0.14em" }}>
              Horario
            </h3>
            <div className="space-y-3 mb-7">
              {horarios.map((h) => (
                <div key={h.dia} className="flex justify-between items-center" style={{ borderBottom: "1px solid rgba(226,221,213,0.1)", paddingBottom: "0.75rem" }}>
                  <span className="text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#D6CFC7" }}>{h.dia}</span>
                  <span className="text-sm font-medium tabular-nums" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F7F4EF" }}>{h.hora}</span>
                </div>
              ))}
            </div>

            {/* Amenidades */}
            <div className="flex flex-wrap gap-4 mb-7">
              <div className="flex items-center gap-2">
                <Wifi size={16} style={{ color: "#B45309" }} />
                <span className="text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#D6CFC7" }}>Wi-Fi 300 Mbps</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} style={{ color: "#B45309" }} />
                <span className="text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#D6CFC7" }}>Barra con enchufes</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} style={{ color: "#B45309" }} />
                <span className="text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#D6CFC7" }}>Abierto 7 días</span>
              </div>
            </div>

            {/* Google Maps */}
            <a
              href="https://maps.google.com/?q=ORIGEN+Cafe+El+Salvador"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-[160ms] active:scale-[0.97] min-h-[44px]"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                backgroundColor: "#B45309",
                color: "#F7F4EF",
                transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)",
              }}
            >
              <MapPin size={15} /> Ver en Google Maps
            </a>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8" style={{ borderTop: "1px solid rgba(226,221,213,0.12)" }}>
          <span className="text-sm" style={{ fontFamily: "'Newsreader', serif", fontStyle: "italic", color: "rgba(214,207,199,0.6)" }}>
            ORIGEN — Café de Especialidad
          </span>
          <span className="text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "rgba(214,207,199,0.4)" }}>
            Sitio demo diseñado por{" "}
            <a href="/" className="underline underline-offset-2 hover:opacity-70 transition-opacity">VORTEX</a>
          </span>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function CafePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const cartaRef = useRef<HTMLElement | null>(null);

  const scrollToCarta = () => {
    document.getElementById("carta")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAdd = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleRemove = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter((c) => c.id !== id);
      return prev.map((c) => c.id === id ? { ...c, qty: c.qty - 1 } : c);
    });
  };

  const handleClear = () => setCart([]);

  return (
    <>
      <FontLink />
      <div
        className="overflow-x-clip"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          backgroundColor: "#F7F4EF",
          color: "#1C1917",
        }}
      >
        <Navbar onCarta={scrollToCarta} />
        <Hero onCarta={scrollToCarta} />
        <Tueste />
        <Favoritos onAddToCart={handleAdd} />
        <Carta cart={cart} onAdd={handleAdd} onRemove={handleRemove} />
        <Espacio />
        <CartDrawer cart={cart} onClear={handleClear} />
      </div>
    </>
  );
}
