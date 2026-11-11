// Imágenes y textos del demo. Para cambiar una foto: reemplaza el archivo en /public/demos/aforce/
export const VORTEX_URL = "https://vortexdigitalsolutions.vercel.app";
export const WHATSAPP = "https://wa.me/50300000000";

export const IMG = {
  hero: "/demos/aforce/hero-taillights.jpg",
  wheel: "/demos/aforce/f40-wheel.jpg",
  gtr: "/demos/aforce/gtr-front.jpg",
  porsche: "/demos/aforce/porsche-gt3rs.jpg",
};

export const NAV = [
  { label: "Builds", href: "#atelier" },
  { label: "Inventario", href: "#inventario" },
  { label: "Contacto", href: "#contacto" },
];

export const STATS = [
  { v: "240+", l: "Proyectos entregados" },
  { v: "12", l: "Años de oficio" },
  { v: "100%", l: "Hecho a mano" },
  { v: "0", l: "Atajos" },
];

export const ATELIER = [
  {
    id: "exhaust",
    n: "01",
    eyebrow: "Performance & Exhaust Engineering",
    title: "El sonido es\nparte del diseño.",
    body: "Sistemas de escape de titanio con válvulas activas, afinados en dinamómetro. Más caudal, menos peso y una firma sonora que se reconoce a una cuadra.",
    specs: ["Titanio grado 5", "Válvulas activas", "Mapa ECU"],
    img: IMG.hero,
  },
  {
    id: "wheels",
    n: "02",
    eyebrow: "Forged Wheels & Brake Systems",
    title: "Metal forjado,\nprecisión pura.",
    body: "Llantas forjadas monobloque, frenos de carbono-cerámica y suspensión calibrada a tu manera de conducir. Cada gramo no suspendido cuenta.",
    specs: ["Forjado 6061-T6", "Carbono-cerámico", "Coilovers ajustables"],
    img: IMG.wheel,
  },
  {
    id: "ppf",
    n: "03",
    eyebrow: "PPF & Ceramic Coating",
    title: "Blindaje invisible,\nbrillo permanente.",
    body: "Película de protección de pintura auto-regenerable y recubrimiento cerámico 9H. El acabado de fábrica, conservado por años.",
    specs: ["PPF 8 mil", "Cerámico 9H", "Garantía 10 años"],
    img: IMG.gtr,
  },
];

export const BUILDS = [
  { name: "911 GT3 RS", make: "Porsche", tag: "Disponible", year: "2016", hp: "500 HP", zero: "3.3 s", img: IMG.porsche },
  { name: "GT-R Nismo", make: "Nissan", tag: "En proceso", year: "2020", hp: "600 HP", zero: "2.9 s", img: IMG.gtr },
  { name: "F40", make: "Ferrari", tag: "Vendido", year: "1991", hp: "471 HP", zero: "4.1 s", img: IMG.wheel },
];

/* Secuencia del showroom 360°. Para un giro real, reemplaza `frames` por 24–72 fotos
   de plataforma giratoria del mismo auto: el componente interpola cualquier cantidad. */
export const ROTATOR = [
  {
    src: IMG.gtr,
    angle: "Frontal",
    pos: "50% 62%",
    hotspot: { x: 51, y: 58, side: "right", title: "Luces Matrix LED", detail: "Haz adaptativo que recorta el tráfico en sentido contrario sin apagar la luz alta." },
  },
  {
    src: IMG.porsche,
    angle: "Tres cuartos",
    pos: "50% 50%",
    hotspot: { x: 88, y: 24, side: "left", title: "Alerón de Carbono", detail: "Fibra de carbono pre-impregnada: carga aerodinámica real a velocidad de pista." },
  },
  {
    src: IMG.wheel,
    angle: "Lateral",
    pos: "50% 52%",
    hotspot: { x: 51, y: 50, side: "right", title: "Rines de Forja 21″", detail: "Monobloque forjado 6061-T6, 9 kg menos de masa no suspendida por eje." },
  },
  {
    src: IMG.hero,
    angle: "Trasera",
    pos: "50% 55%",
    hotspot: { x: 88, y: 74, side: "left", title: "Escape Deportivo Titanium", detail: "Titanio grado 5 con válvulas activas, afinado en dinamómetro." },
  },
];
