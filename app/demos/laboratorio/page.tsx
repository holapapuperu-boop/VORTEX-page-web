"use client";

import { useState, useMemo } from "react";
import {
  FlaskConical,
  Clock,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  MessageCircle,
  MapPin,
  Phone,
  FileText,
  Search,
  Microscope,
  Droplets,
  Thermometer,
  Activity,
  Users,
  Shield,
  Home,
  X,
} from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────
// DATA — preparado para escalar a Supabase
// ─────────────────────────────────────────────

type Categoria = "Rutina" | "Hematología" | "Química Clínica" | "Hormonas";

interface Examen {
  id: string;
  nombre: string;
  categoria: Categoria;
  precio: number;
  ayuno: number; // horas; 0 = sin ayuno
  tiempoEntrega: string;
  descripcion?: string;
}

interface Perfil {
  id: string;
  nombre: string;
  precio: number;
  examenes: string[];
  ayuno: number;
  descripcion: string;
  badge?: string;
}

const EXAMENES: Examen[] = [
  {
    id: "hem",
    nombre: "Hemograma Completo (BHC)",
    categoria: "Hematología",
    precio: 8,
    ayuno: 0,
    tiempoEntrega: "2–3 hrs",
    descripcion: "Recuento completo de células sanguíneas.",
  },
  {
    id: "glu",
    nombre: "Glucosa en Ayunas",
    categoria: "Química Clínica",
    precio: 5,
    ayuno: 8,
    tiempoEntrega: "1–2 hrs",
    descripcion: "Control de azúcar en sangre.",
  },
  {
    id: "lip",
    nombre: "Perfil Lipídico",
    categoria: "Química Clínica",
    precio: 14,
    ayuno: 12,
    tiempoEntrega: "2–4 hrs",
    descripcion: "Colesterol total, HDL, LDL y triglicéridos.",
  },
  {
    id: "tsh",
    nombre: "TSH Tiroidea",
    categoria: "Hormonas",
    precio: 16,
    ayuno: 0,
    tiempoEntrega: "3–4 hrs",
    descripcion: "Función tiroidea básica.",
  },
  {
    id: "ori",
    nombre: "Examen General de Orina (EGO)",
    categoria: "Rutina",
    precio: 6,
    ayuno: 0,
    tiempoEntrega: "1–2 hrs",
    descripcion: "Análisis físico, químico y microscópico.",
  },
  {
    id: "cre",
    nombre: "Creatinina Sérica",
    categoria: "Química Clínica",
    precio: 7,
    ayuno: 8,
    tiempoEntrega: "2–3 hrs",
    descripcion: "Función renal.",
  },
  {
    id: "ast",
    nombre: "Transaminasas (AST/ALT)",
    categoria: "Química Clínica",
    precio: 12,
    ayuno: 8,
    tiempoEntrega: "2–3 hrs",
    descripcion: "Función hepática.",
  },
  {
    id: "acl",
    nombre: "Ácido Úrico",
    categoria: "Química Clínica",
    precio: 7,
    ayuno: 8,
    tiempoEntrega: "2–3 hrs",
    descripcion: "Gota y función renal.",
  },
  {
    id: "pcr",
    nombre: "Proteína C Reactiva (PCR)",
    categoria: "Rutina",
    precio: 10,
    ayuno: 0,
    tiempoEntrega: "2–3 hrs",
    descripcion: "Marcador de inflamación.",
  },
  {
    id: "t4f",
    nombre: "T4 Libre",
    categoria: "Hormonas",
    precio: 18,
    ayuno: 0,
    tiempoEntrega: "3–4 hrs",
    descripcion: "Tiroxina libre, complementa TSH.",
  },
];

const PERFILES: Perfil[] = [
  {
    id: "general",
    nombre: "Chequeo General Completo",
    precio: 35,
    examenes: [
      "Hemograma Completo",
      "Glucosa en Ayunas",
      "Colesterol Total",
      "Triglicéridos",
      "Creatinina",
      "Transaminasas (AST/ALT)",
      "Examen General de Orina",
    ],
    ayuno: 12,
    descripcion:
      "El perfil más completo para un chequeo anual preventivo. Cubre sangre, azúcar, lípidos, riñón, hígado y orina en un solo proceso.",
    badge: "Más solicitado",
  },
  {
    id: "tiroides",
    nombre: "Perfil Tiroideo Completo",
    precio: 42,
    examenes: ["TSH", "T4 Libre", "T3 Total"],
    ayuno: 0,
    descripcion:
      "Evalúa la función tiroidea de forma integral. Indicado en fatiga inexplicable, cambios de peso o antecedentes familiares.",
  },
  {
    id: "diabetes",
    nombre: "Control Metabólico y Diabetes",
    precio: 24,
    examenes: [
      "Glucosa en Ayunas",
      "Hemoglobina Glucosilada (HbA1c)",
      "Insulina",
    ],
    ayuno: 8,
    descripcion:
      "Control de glucemia y resistencia a la insulina para pacientes con diabetes o prediabetes diagnosticada.",
  },
  {
    id: "prenatal",
    nombre: "Perfil Prenatal Básico",
    precio: 38,
    examenes: [
      "Hemograma",
      "Grupo Sanguíneo y Rh",
      "VDRL",
      "Glucosa",
      "Orina",
    ],
    ayuno: 8,
    descripcion:
      "Exámenes esenciales al inicio del embarazo según protocolo de control prenatal en El Salvador.",
  },
];

const WHATSAPP_NUMBER = "50373831623";
const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}?text=`;

function buildWALink(text: string) {
  return WHATSAPP_BASE + encodeURIComponent(text);
}

// ─────────────────────────────────────────────
// COMPONENTES PEQUEÑOS
// ─────────────────────────────────────────────

function AyunoBadge({ horas }: { horas: number }) {
  if (horas === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        Sin ayuno
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
      Ayuno {horas}h
    </span>
  );
}

function CategoriaBadge({ cat }: { cat: Categoria }) {
  const styles: Record<Categoria, string> = {
    Rutina: "bg-slate-100 text-slate-600",
    Hematología: "bg-red-50 text-red-700",
    "Química Clínica": "bg-blue-50 text-blue-700",
    Hormonas: "bg-purple-50 text-purple-700",
  };
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${styles[cat]}`}
    >
      {cat}
    </span>
  );
}

// ─────────────────────────────────────────────
// SECCIÓN 1 — COTIZADOR (Hero Derecha)
// ─────────────────────────────────────────────

function Cotizador() {
  const QUICK_EXAMS = EXAMENES.slice(0, 6);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedExams = EXAMENES.filter((e) => selected.has(e.id));
  const total = selectedExams.reduce((s, e) => s + e.precio, 0);
  const maxAyuno = selectedExams.reduce((m, e) => Math.max(m, e.ayuno), 0);
  const ayunoLabel =
    maxAyuno === 0
      ? "No requiere ayuno"
      : maxAyuno <= 8
      ? `Requiere ${maxAyuno}h de ayuno`
      : `Requiere 8–12h de ayuno`;

  const waMessage =
    selectedExams.length > 0
      ? `Hola VERITAS LAB, deseo agendar los siguientes exámenes:\n${selectedExams
          .map((e) => `• ${e.nombre} ($${e.precio}.00)`)
          .join("\n")}\nTotal estimado: $${total}.00`
      : "";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 h-full flex flex-col gap-5">
      <div>
        <p className="text-xs font-semibold tracking-widest text-teal-600 uppercase mb-1">
          Cotizador Rápido
        </p>
        <h3 className="text-base font-semibold text-[#0F172A] leading-tight">
          Selecciona tus exámenes
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Calcula el costo y requisito de ayuno al instante.
        </p>
      </div>

      {/* Chips de selección */}
      <div className="flex flex-wrap gap-2">
        {QUICK_EXAMS.map((ex) => {
          const active = selected.has(ex.id);
          return (
            <button
              key={ex.id}
              onClick={() => toggle(ex.id)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                active
                  ? "bg-[#114232] border-[#114232] text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:border-teal-500 hover:text-teal-700"
              }`}
            >
              {active && <X size={10} strokeWidth={2.5} />}
              {ex.nombre.split("(")[0].trim()}
              <span className={active ? "text-teal-300" : "text-slate-400"}>
                ${ex.precio}
              </span>
            </button>
          );
        })}
      </div>

      {/* Resultado */}
      <div className="mt-auto space-y-3">
        <div className="bg-[#F9FAF9] rounded-xl border border-slate-200 p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Total estimado</span>
            <span className="text-xl font-bold text-[#114232] tabular-nums">
              ${total.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Preparación</span>
            <span
              className={`text-sm font-medium ${
                maxAyuno > 0 ? "text-amber-700" : "text-emerald-700"
              }`}
            >
              {selectedExams.length > 0 ? ayunoLabel : "—"}
            </span>
          </div>
          {selectedExams.length > 0 && (
            <div className="pt-2 border-t border-slate-200">
              <p className="text-xs text-slate-400 mb-1">Incluye:</p>
              <ul className="space-y-0.5">
                {selectedExams.map((e) => (
                  <li key={e.id} className="text-xs text-slate-600 flex items-center gap-1.5">
                    <CheckCircle2 size={10} className="text-teal-500 shrink-0" strokeWidth={2} />
                    {e.nombre}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <a
          href={selectedExams.length > 0 ? buildWALink(waMessage) : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
            selectedExams.length > 0
              ? "bg-[#114232] text-white hover:bg-[#0d3326] shadow-sm hover:shadow-md active:scale-[0.98]"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          <MessageCircle size={16} strokeWidth={1.75} />
          Agendar selección por WhatsApp
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SECCIÓN 2 — CATÁLOGO FILTRABLE
// ─────────────────────────────────────────────

function CatalogoExamenes() {
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState<"Todos" | Categoria>("Todos");

  const categorias: Array<"Todos" | Categoria> = [
    "Todos",
    "Rutina",
    "Hematología",
    "Química Clínica",
    "Hormonas",
  ];

  const filtered = useMemo(
    () =>
      EXAMENES.filter((e) => {
        const matchCat = catFilter === "Todos" || e.categoria === catFilter;
        const matchQ = e.nombre.toLowerCase().includes(query.toLowerCase());
        return matchCat && matchQ;
      }),
    [query, catFilter]
  );

  const waMsg = (e: Examen) =>
    `Hola VERITAS LAB, me gustaría cotizar:\n• ${e.nombre} ($${e.precio}.00)`;

  return (
    <div>
      {/* Barra de búsqueda + filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            strokeWidth={1.75}
          />
          <input
            type="text"
            placeholder="Buscar examen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-100 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categorias.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`text-xs font-medium px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                catFilter === c
                  ? "bg-[#114232] border-[#114232] text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:border-teal-500"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Lista editorial */}
      <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white">
        {filtered.length === 0 && (
          <div className="py-10 text-center text-slate-400 text-sm">
            No se encontraron exámenes con ese criterio.
          </div>
        )}
        {filtered.map((ex) => (
          <div
            key={ex.id}
            className="flex items-center gap-4 px-5 py-4 hover:bg-[#F9FAF9] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0F172A] truncate">
                {ex.nombre}
              </p>
              {ex.descripcion && (
                <p className="text-xs text-slate-400 mt-0.5 truncate">
                  {ex.descripcion}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <CategoriaBadge cat={ex.categoria} />
                <AyunoBadge horas={ex.ayuno} />
                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={11} strokeWidth={1.75} />
                  {ex.tiempoEntrega}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-base font-bold text-[#114232] tabular-nums">
                ${ex.precio.toFixed(2)}
              </span>
              <a
                href={buildWALink(waMsg(ex))}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#F0FDFA] text-teal-700 border border-teal-200 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all"
              >
                Cotizar
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SECCIÓN 4 — FORMULARIO DOMICILIO
// ─────────────────────────────────────────────

function FormularioDomicilio() {
  const [form, setForm] = useState({
    nombre: "",
    zona: "",
    examen: "",
    horario: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hola VERITAS LAB, quisiera solicitar toma de muestra a domicilio:\n\n• Paciente: ${form.nombre}\n• Zona/Colonia: ${form.zona}\n• Examen o perfil: ${form.examen}\n• Horario preferido: ${form.horario}\n\nPor favor confirmar disponibilidad. Gracias.`;
    window.open(buildWALink(msg), "_blank");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide uppercase">
          Nombre del paciente
        </label>
        <input
          name="nombre"
          type="text"
          required
          value={form.nombre}
          onChange={handleChange}
          placeholder="Ej. María García"
          className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-100 transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide uppercase">
          Zona o Colonia en San Salvador
        </label>
        <input
          name="zona"
          type="text"
          required
          value={form.zona}
          onChange={handleChange}
          placeholder="Ej. Col. Escalón, Miraflores…"
          className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-100 transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide uppercase">
          Examen o perfil deseado
        </label>
        <input
          name="examen"
          type="text"
          required
          value={form.examen}
          onChange={handleChange}
          placeholder="Ej. Hemograma, Chequeo General…"
          className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-100 transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide uppercase">
          Horario matutino preferido
        </label>
        <select
          name="horario"
          required
          value={form.horario}
          onChange={handleChange}
          className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-100 transition-all appearance-none cursor-pointer"
        >
          <option value="">Seleccionar horario…</option>
          <option value="6:00–7:00 a.m.">6:00–7:00 a.m.</option>
          <option value="7:00–8:00 a.m.">7:00–8:00 a.m.</option>
          <option value="8:00–9:00 a.m.">8:00–9:00 a.m.</option>
          <option value="9:00–10:00 a.m.">9:00–10:00 a.m.</option>
        </select>
      </div>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold bg-[#114232] text-white hover:bg-[#0d3326] transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
      >
        <MessageCircle size={16} strokeWidth={1.75} />
        Solicitar por WhatsApp
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────
// SECCIÓN 5 — ACORDEÓN FAQ
// ─────────────────────────────────────────────

const FAQS = [
  {
    pregunta: "¿Cuántas horas de ayuno necesito?",
    respuesta:
      "Depende del examen. La glucosa y los lípidos requieren 8–12 horas de ayuno completo. El hemograma, orina y la mayoría de hormonas no requieren ayuno. Al confirmar tu orden te indicamos exactamente qué aplica.",
  },
  {
    pregunta: "¿Puedo tomar agua simple antes del examen?",
    respuesta:
      "Sí. El agua simple no afecta ningún examen de laboratorio. Lo que debe evitarse son jugos, café, té, bebidas azucaradas y alimentos sólidos durante el período de ayuno.",
  },
  {
    pregunta: "¿Qué necesito llevar si voy sin cita previa?",
    respuesta:
      "Solo tu DUI o documento de identificación y, si tienes, la orden médica. Si no tienes orden, podemos orientarte. Atendemos sin cita de lunes a viernes de 6:30 a.m. a 4:00 p.m. y sábados de 7:00 a.m. a 12:00 m.d.",
  },
  {
    pregunta: "¿Cómo descargo mis resultados?",
    respuesta:
      "Tus resultados en PDF llegan directamente a tu WhatsApp en el tiempo acordado. No es necesario regresar al laboratorio. También puedes solicitarlos por correo electrónico si prefieres.",
  },
];

function Acordeon() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white">
      {FAQS.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-[#F9FAF9] transition-colors cursor-pointer"
          >
            <span className="text-sm font-semibold text-[#0F172A]">
              {faq.pregunta}
            </span>
            <ChevronDown
              size={16}
              strokeWidth={1.75}
              className={`text-teal-600 shrink-0 transition-transform duration-300 ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {open === i && (
            <div className="px-6 pb-5">
              <p className="text-sm text-slate-500 leading-relaxed">
                {faq.respuesta}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE PRINCIPAL
// ─────────────────────────────────────────────

export default function LaboratorioPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen bg-[#F9FAF9]"
      style={{ fontFamily: "'DM Sans', 'Geist', system-ui, sans-serif" }}
    >
      {/* ══════════════════════════════════════════════
          BARRA VORTEX
      ══════════════════════════════════════════════ */}
      <div className="fixed top-0 left-0 right-0 z-50 h-9 bg-[#0F172A] flex items-center justify-center px-4">
        <p className="text-white text-xs text-center">
          Muestra demostrativa creada por VORTEX Digital Solutions · Sector
          Salud&nbsp;&nbsp;
          <Link
            href="/"
            className="underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            Volver al portafolio
          </Link>
        </p>
      </div>

      {/* ══════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════ */}
      <header className="fixed top-9 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-[#114232] rounded-lg flex items-center justify-center">
              <FlaskConical
                size={16}
                strokeWidth={1.75}
                className="text-white"
              />
            </div>
            <div className="font-jakarta">
              <span className="text-sm font-bold text-[#114232] tracking-tight">
                VERITAS
              </span>
              <span className="text-sm font-medium text-slate-400 ml-1 tracking-tight">
                LAB
              </span>
            </div>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-500">
            <a href="#examenes" className="hover:text-[#114232] transition-colors">
              Exámenes
            </a>
            <a href="#perfiles" className="hover:text-[#114232] transition-colors">
              Perfiles
            </a>
            <a href="#domicilio" className="hover:text-[#114232] transition-colors">
              Domicilio
            </a>
            <a href="#ubicacion" className="hover:text-[#114232] transition-colors">
              Ubicación
            </a>
          </nav>

          {/* CTA */}
          <a
            href={buildWALink(
              "Hola VERITAS LAB, deseo enviar una orden médica para cotización."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-[#114232] text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0d3326] transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] shrink-0"
          >
            <MessageCircle size={14} strokeWidth={1.75} />
            Enviar orden por WhatsApp
          </a>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-slate-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menú"
          >
            {mobileMenuOpen ? (
              <X size={20} strokeWidth={1.75} />
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path d="M3 6h14M3 10h14M3 14h14" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-3">
            {["examenes", "perfiles", "domicilio", "ubicacion"].map((s) => (
              <a
                key={s}
                href={`#${s}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-slate-600 capitalize py-1"
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            ))}
            <a
              href={buildWALink(
                "Hola VERITAS LAB, deseo enviar una orden médica."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#114232] text-white text-sm font-semibold px-4 py-3 rounded-xl justify-center mt-2"
            >
              <MessageCircle size={15} strokeWidth={1.75} />
              Enviar orden por WhatsApp
            </a>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════════
          SECCIÓN 1 — HERO
      ══════════════════════════════════════════════ */}
      <section
        className="min-h-[100svh] flex items-center pt-[6.5rem] pb-16 px-6"
        style={{ background: "linear-gradient(135deg, #F9FAF9 0%, #f0faf8 100%)" }}
      >
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[52fr_48fr] gap-12 items-center">
          {/* Izquierda */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-slate-600">
                Abierto hoy · 6:30 a.m. – 4:00 p.m. · Sin cita previa
              </span>
            </div>

            {/* H1 */}
            <div>
              <h1
                className="font-jakarta text-4xl lg:text-5xl xl:text-[3.25rem] font-bold text-[#0F172A] leading-[1.1] tracking-tight"
              >
                Resultados clínicos precisos,{" "}
                <span className="text-[#114232]">listos el mismo día</span> en tu
                WhatsApp.
              </h1>
              <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-lg">
                Atendemos en nuestra sucursal en San Salvador sin cita previa, o
                enviamos una enfermera directamente a tu domicilio. Tus reportes en
                PDF llegan verificados por profesionales certificados.
              </p>
            </div>

            {/* Métricas */}
            <div className="flex flex-wrap items-center gap-0 border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden divide-x divide-slate-200">
              {[
                { valor: "99.8%", etiqueta: "Precisión analítica" },
                { valor: "2–4 hrs", etiqueta: "Entrega estándar" },
                { valor: "+45", etiqueta: "Pruebas disponibles" },
              ].map((m) => (
                <div
                  key={m.etiqueta}
                  className="flex-1 min-w-0 px-5 py-4 text-center"
                >
                  <p className="font-dm text-xl font-bold text-[#114232] tabular-nums">
                    {m.valor}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-tight">
                    {m.etiqueta}
                  </p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                href={buildWALink(
                  "Hola VERITAS LAB, me gustaría agendar un examen. ¿Podrían orientarme?"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#114232] text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-[#0d3326] transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                <MessageCircle size={16} strokeWidth={1.75} />
                Agendar por WhatsApp
              </a>
              <a
                href="#examenes"
                className="flex items-center gap-2 border border-slate-200 text-slate-600 text-sm font-semibold px-5 py-3 rounded-xl hover:border-teal-500 hover:text-teal-700 transition-all bg-white"
              >
                Ver exámenes
                <ArrowRight size={15} strokeWidth={1.75} />
              </a>
            </div>
          </div>

          {/* Derecha — Cotizador */}
          <div className="w-full">
            <Cotizador />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECCIÓN 2 — BENTO + CATÁLOGO
      ══════════════════════════════════════════════ */}
      <section id="examenes" className="py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-widest text-teal-600 uppercase mb-2">
              Diagnóstico clínico
            </p>
            <h2 className="font-jakarta text-3xl font-bold text-[#0F172A] tracking-tight">
              Tecnología y proceso que respaldan cada resultado
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-4">
            {/* Bloque grande — Diagnóstico Automatizado */}
            <div className="col-span-12 lg:col-span-7 bg-[#114232] rounded-2xl overflow-hidden relative min-h-[320px]">
              <img
                src="/demos/laboratorio/foto-tubos-fondo-florescente.jpg"
                alt="Tubos de muestra en laboratorio"
                className="absolute inset-0 w-full h-full object-cover opacity-25 hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 mb-5">
                    <Activity size={12} strokeWidth={1.75} className="text-teal-300" />
                    <span className="text-xs font-medium text-white/80">
                      Automatización total
                    </span>
                  </div>
                  <h3 className="font-jakarta text-2xl font-bold text-white leading-tight">
                    Diagnóstico Automatizado y Control de Calidad
                  </h3>
                  <p className="text-white/60 text-sm mt-3 leading-relaxed max-w-md">
                    Cada muestra tiene trazabilidad digital desde la recepción hasta
                    la validación final. Nuestro equipo de profesionales en
                    laboratorio clínico verifica cada resultado antes de
                    entregarlo.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 mt-6">
                  {[
                    "Trazabilidad digital",
                    "Validación profesional",
                    "Control de calidad ISO",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
              {/* Entrega Digital */}
              <div className="bg-[#F0FDFA] border border-[#CCFBF1] rounded-2xl p-6 overflow-hidden relative">
                <img
                  src="/demos/laboratorio/foto microscopio-me gusta y podria quedar bien en algun sitio.jpg"
                  alt="Microscopio de laboratorio"
                  className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-15 hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="relative z-10">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center mb-4">
                    <FileText size={16} strokeWidth={1.75} className="text-white" />
                  </div>
                  <h3 className="font-jakarta text-lg font-bold text-[#0F172A] leading-tight">
                    Entrega Digital en PDF
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Recibe tus resultados directo en tu celular sin regresar a hacer
                    fila. Documento firmado digitalmente.
                  </p>
                </div>
              </div>

              {/* Envío de orden */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#114232]/10 flex items-center justify-center">
                  <MessageCircle
                    size={16}
                    strokeWidth={1.75}
                    className="text-[#114232]"
                  />
                </div>
                <div>
                  <h3 className="font-jakarta text-lg font-bold text-[#0F172A] leading-tight">
                    Envío de Orden Médica
                  </h3>
                  <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Manda la foto de tu receta y recibe cotización en minutos, sin
                    salir de tu casa.
                  </p>
                </div>
                <a
                  href={buildWALink(
                    "Hola VERITAS LAB, adjunto mi orden médica para cotización:"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors"
                >
                  Enviar receta por WhatsApp
                  <ArrowRight size={14} strokeWidth={2} />
                </a>
              </div>
            </div>
          </div>

          {/* Catálogo */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-jakarta text-xl font-bold text-[#0F172A]">
                Catálogo de Exámenes
              </h3>
              <span className="text-xs text-slate-400">
                {EXAMENES.length} exámenes disponibles
              </span>
            </div>
            <CatalogoExamenes />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECCIÓN 3 — PERFILES PREVENTIVOS
      ══════════════════════════════════════════════ */}
      <section id="perfiles" className="py-20 px-6 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-10">
            <p className="text-xs font-semibold tracking-widest text-teal-600 uppercase mb-2">
              Perfiles preventivos
            </p>
            <h2 className="font-jakarta text-3xl font-bold text-[#0F172A] tracking-tight">
              Paquetes diseñados para tu control de salud
            </h2>
          </div>

          <div className="grid lg:grid-cols-[45fr_55fr] gap-6 items-start">
            {/* Perfil destacado */}
            <div className="border-2 border-teal-500 rounded-2xl p-7 bg-white relative">
              <div className="absolute -top-3 left-6">
                <span className="bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Más solicitado
                </span>
              </div>
              <div className="mt-2">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <h3 className="font-jakarta text-xl font-bold text-[#0F172A] leading-tight">
                    {PERFILES[0].nombre}
                  </h3>
                  <span className="font-dm text-2xl font-bold text-[#114232] tabular-nums shrink-0">
                    ${PERFILES[0].precio.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-5">
                  {PERFILES[0].descripcion}
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Incluye
                  </p>
                  <ul className="grid grid-cols-1 gap-1.5">
                    {PERFILES[0].examenes.map((ex) => (
                      <li
                        key={ex}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <CheckCircle2
                          size={14}
                          strokeWidth={1.75}
                          className="text-teal-500 shrink-0"
                        />
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-2 mb-6 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <Thermometer size={15} strokeWidth={1.75} className="text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-700 font-medium">
                    Requiere ayuno de {PERFILES[0].ayuno} horas
                  </p>
                </div>
                <a
                  href={buildWALink(
                    `Hola VERITAS LAB, deseo reservar el perfil "${PERFILES[0].nombre}" por $${PERFILES[0].precio.toFixed(2)}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#114232] text-white text-sm font-semibold rounded-xl hover:bg-[#0d3326] transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <MessageCircle size={15} strokeWidth={1.75} />
                  Reservar por WhatsApp
                </a>
              </div>
            </div>

            {/* Lista de perfiles */}
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {PERFILES.slice(1).map((p) => (
                <div key={p.id} className="p-6 hover:bg-[#F9FAF9] transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-jakarta text-base font-bold text-[#0F172A] leading-tight">
                      {p.nombre}
                    </h3>
                    <span className="font-dm text-lg font-bold text-[#114232] tabular-nums shrink-0">
                      ${p.precio.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-3">
                    {p.descripcion}
                  </p>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <AyunoBadge horas={p.ayuno} />
                    <a
                      href={buildWALink(
                        `Hola VERITAS LAB, deseo agendar el perfil "${p.nombre}" por $${p.precio.toFixed(2)}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 transition-colors"
                    >
                      Agendar
                      <ArrowRight size={12} strokeWidth={2} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECCIÓN 4 — DOMICILIO
      ══════════════════════════════════════════════ */}
      <section id="domicilio" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-10">
            <p className="text-xs font-semibold tracking-widest text-teal-600 uppercase mb-2">
              Servicio a domicilio
            </p>
            <h2 className="font-jakarta text-3xl font-bold text-[#0F172A] tracking-tight">
              La muestra llega a ti, los resultados también
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Izquierda: 3 pasos + foto */}
            <div className="space-y-8">
              <div className="space-y-6">
                {[
                  {
                    num: "01",
                    titulo: "Cotiza o ven sin cita",
                    desc: "Usa el cotizador de esta página, envíanos tu orden médica por WhatsApp o preséntate directamente en nuestra sucursal. No necesitas cita previa.",
                  },
                  {
                    num: "02",
                    titulo: "Toma de muestra rápida y segura",
                    desc: "Una enfermera certificada llega a tu domicilio en San Salvador con todo el material estéril necesario. Proceso rápido, higiénico y sin complicaciones.",
                  },
                  {
                    num: "03",
                    titulo: "Recibe tu PDF por WhatsApp",
                    desc: "En 2 a 4 horas recibes tus resultados en un PDF firmado digitalmente directamente en tu WhatsApp. Sin colas, sin esperas.",
                  },
                ].map((paso) => (
                  <div key={paso.num} className="flex gap-5">
                    <div className="shrink-0">
                      <span className="font-jakarta text-3xl font-bold text-slate-200 leading-none">
                        {paso.num}
                      </span>
                    </div>
                    <div className="pt-1">
                      <h4 className="font-jakarta text-base font-bold text-[#0F172A] mb-1">
                        {paso.titulo}
                      </h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {paso.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Foto domicilio */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 aspect-[4/5] max-h-80">
                <img
                  src="/demos/laboratorio/podria-quedar.jpg"
                  alt="Servicio de toma de muestra a domicilio"
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-white text-xs font-semibold bg-[#114232]/90 px-3 py-1.5 rounded-full">
                    Atención personalizada · San Salvador
                  </span>
                </div>
              </div>
            </div>

            {/* Derecha: Formulario */}
            <div>
              <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#114232] flex items-center justify-center">
                    <Home size={18} strokeWidth={1.75} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-jakarta text-lg font-bold text-[#0F172A]">
                      Solicitar Enfermera a Domicilio
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Solo para San Salvador y área metropolitana
                    </p>
                  </div>
                </div>
                <FormularioDomicilio />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECCIÓN 5 — FAQ + UBICACIÓN
      ══════════════════════════════════════════════ */}
      <section id="ubicacion" className="py-20 px-6 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* FAQ */}
            <div>
              <p className="text-xs font-semibold tracking-widest text-teal-600 uppercase mb-2">
                Preguntas frecuentes
              </p>
              <h2 className="font-jakarta text-3xl font-bold text-[#0F172A] tracking-tight mb-8">
                Preparación para tus exámenes
              </h2>
              <Acordeon />
            </div>

            {/* Ubicación + foto */}
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold tracking-widest text-teal-600 uppercase mb-2">
                  Nuestra sucursal
                </p>
                <h2 className="font-jakarta text-3xl font-bold text-[#0F172A] tracking-tight">
                  Visítanos sin cita
                </h2>
              </div>

              {/* Foto instalaciones */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 aspect-[4/5] max-h-72">
                <img
                  src="/demos/laboratorio/tambien podria quedar como ubicacion o instalaciones.jpg"
                  alt="Instalaciones VERITAS LAB"
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="bg-[#F9FAF9] border border-slate-200 rounded-2xl p-6 space-y-5">
                <div className="flex gap-3">
                  <MapPin
                    size={18}
                    strokeWidth={1.75}
                    className="text-teal-600 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">
                      Dirección
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Colonia Escalón, San Salvador
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 italic">
                      Dirección demostrativa
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock
                    size={18}
                    strokeWidth={1.75}
                    className="text-teal-600 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">
                      Horarios
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Lunes – Viernes · 6:30 a.m. – 4:30 p.m.
                    </p>
                    <p className="text-sm text-slate-500">
                      Sábados · 7:00 a.m. – 12:00 m.d.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone
                    size={18}
                    strokeWidth={1.75}
                    className="text-teal-600 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">
                      WhatsApp
                    </p>
                    <a
                      href={buildWALink("Hola VERITAS LAB, tengo una consulta.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-teal-600 hover:text-teal-700 mt-0.5 block transition-colors"
                    >
                      +503 7383-1623
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Shield
                    size={18}
                    strokeWidth={1.75}
                    className="text-teal-600 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">
                      Respaldo clínico
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Laboratorio clínico certificado · Profesionales registrados
                      en el Ministerio de Salud de El Salvador
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      <footer className="border-t border-slate-200 bg-[#F9FAF9] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#114232] rounded-lg flex items-center justify-center">
              <FlaskConical size={13} strokeWidth={1.75} className="text-white" />
            </div>
            <div className="font-jakarta">
              <span className="text-sm font-bold text-[#114232]">VERITAS</span>
              <span className="text-sm font-medium text-slate-400 ml-1">
                LAB
              </span>
              <span className="text-xs text-slate-400 ml-2">
                · Diagnóstico Clínico
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center">
            Demo creada por{" "}
            <Link
              href="/"
              className="font-semibold text-slate-600 hover:text-[#114232] transition-colors"
            >
              VORTEX Digital Solutions
            </Link>{" "}
            · Muestra sin valor comercial
          </p>

          <div className="flex items-center gap-5 text-xs text-slate-400">
            <a
              href={buildWALink("Hola, me interesa un sitio web para mi laboratorio.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-600 transition-colors"
            >
              Quiero un sitio así
            </a>
            <span>©{new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
