/** Planes comerciales. Los precios son de referencia: el precio final depende del alcance. */
export type Plan = {
  name: string;
  price: string;
  priceNote: string;
  description: string;
  lead?: string;
  items: string[];
  cta: string;
  message: string;
};

export const DEV_PLANS: Plan[] = [
  {
    name: "VORTEX Basic",
    price: "$80",
    priceNote: "Pago único",
    description: "Para negocios que necesitan una presencia digital sencilla y profesional.",
    items: [
      "Sitio web informativo",
      "Secciones de inicio, servicios, nosotros y contacto, organizadas según las necesidades",
      "Botón de contacto por WhatsApp",
      "Información del negocio, horarios y ubicación",
      "Diseño adaptable a celulares, tablets y computadoras",
      "Publicación del sitio web",
    ],
    cta: "Solicitar información",
    message: "Hola VORTEX, quiero información sobre el plan VORTEX Basic.",
  },
  {
    name: "VORTEX Plus",
    price: "$150",
    priceNote: "Pago único",
    description: "Para negocios que necesitan una página más completa y personalizada.",
    items: [
      "Todo lo incluido en Basic",
      "Varias páginas independientes",
      "Galería de fotografías",
      "Catálogo sencillo de productos o servicios",
      "Formulario de contacto",
      "Optimización SEO básica",
      "Diseño más personalizado",
      "Publicación y pruebas de funcionamiento",
    ],
    cta: "Solicitar información",
    message: "Hola VORTEX, quiero información sobre el plan VORTEX Plus.",
  },
  {
    name: "VORTEX Core",
    price: "$250+",
    priceNote: "Inversión ajustada según la complejidad, alcance y funcionalidades",
    description: "Para proyectos que necesitan soluciones digitales más específicas.",
    lead: "Puede incluir, dependiendo de la evaluación:",
    items: [
      "Desarrollo de funcionalidades personalizadas",
      "Sistemas y herramientas para negocios",
      "Automatizaciones",
      "Integraciones con servicios externos",
      "Desarrollo de soluciones a medida",
    ],
    cta: "Solicitar cotización",
    message: "Hola VORTEX, quiero solicitar una cotización para un proyecto VORTEX Core.",
  },
];

export const CARE_PLANS: Plan[] = [
  {
    name: "VORTEX Care",
    price: "$15/mes",
    priceNote: "Precio de referencia",
    description: "Mantenimiento esencial.",
    items: [
      "Revisión mensual del sitio",
      "Comprobación de enlaces y botones",
      "Revisión de formularios",
      "Pequeños cambios de texto",
    ],
    cta: "Solicitar información",
    message: "Hola VORTEX, quiero información sobre el plan de mantenimiento VORTEX Care.",
  },
  {
    name: "VORTEX Care Plus",
    price: "$25/mes",
    priceNote: "Precio de referencia",
    description: "Mantenimiento más completo.",
    items: [
      "Todo lo incluido en Care",
      "Actualización de imágenes y contenido",
      "Revisión de funcionamiento en dispositivos móviles",
      "Mayor disponibilidad para pequeños ajustes",
      "Soporte prioritario",
    ],
    cta: "Solicitar información",
    message: "Hola VORTEX, quiero información sobre el plan de mantenimiento VORTEX Care Plus.",
  },
];

export const QUOTE_MESSAGE =
  "Hola VORTEX, no sé qué plan elegir. Me gustaría solicitar una cotización personalizada para mi negocio.";
