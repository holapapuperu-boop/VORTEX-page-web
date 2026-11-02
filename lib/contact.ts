/**
 * Datos de contacto de VORTEX.
 * Es el único lugar donde hay que cambiarlos: la página los lee de aquí.
 */
export const CONTACT = {
  email: "vortexsmbz@gmail.com",
  /** Solo dígitos, con código de país (503 = El Salvador). Se usa en wa.me. */
  whatsappNumber: "50373831623",
  /** Cómo se muestra en pantalla. */
  whatsappDisplay: "+503 7383 1623",
  whatsappMessage: "Hola VORTEX, me gustaría cotizar una página web.",
  location: "San Salvador, El Salvador",
} as const;

export const whatsappUrl = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`;
/** Enlace de WhatsApp con un mensaje ya escrito. */
export const whatsappLink = (message: string) =>
  `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
export const mailUrl = `mailto:${CONTACT.email}?subject=${encodeURIComponent("Consulta desde la web de VORTEX")}`;
