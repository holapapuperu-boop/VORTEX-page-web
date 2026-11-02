import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { CONTACT, mailUrl } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Términos de uso | VORTEX",
  description: "Condiciones de uso del sitio web de VORTEX Digital Solutions.",
  alternates: { canonical: "/terminos" },
};

export default function Terminos() {
  return (
    <LegalPage title="Términos de uso" updated="2 de noviembre de 2026">
      <p>Al usar este sitio aceptas las condiciones que se describen a continuación. Si no estás de acuerdo con ellas, te pedimos que no lo utilices.</p>

      <h2>1. Sobre este sitio</h2>
      <p>Este sitio presenta de forma general a VORTEX Digital Solutions y las áreas en las que trabajamos. Su contenido es informativo.</p>

      <h2>2. Servicios, precios y plazos</h2>
      <p>Las descripciones de servicios que ves aquí son orientativas. El alcance, el precio, los plazos y las condiciones de cada proyecto se acuerdan por escrito con cada cliente antes de comenzar. Nada de lo publicado en el sitio constituye una oferta vinculante ni un contrato.</p>

      <h2>3. Consultas y cotizaciones</h2>
      <p>Enviar el formulario, un correo o un mensaje de WhatsApp no te obliga a contratar nada ni nos obliga a nosotros a aceptar un proyecto. Las cotizaciones son válidas solo cuando las confirmamos por escrito. El tratamiento de los datos que nos envíes se explica en el <Link href="/privacidad">Aviso de privacidad</Link>.</p>

      <h2>4. Asistente de ideas</h2>
      <p>El asistente de la página es una herramienta automática de inteligencia artificial. Sus respuestas son orientativas, pueden ser incompletas o incorrectas y no constituyen una oferta, una cotización, una promesa de resultados ni asesoría profesional. Cualquier propuesta se confirma por escrito con el equipo de VORTEX. Su uso puede limitarse o suspenderse en cualquier momento.</p>

      <h2>5. Uso adecuado</h2>
      <p>Te pedimos no usar el sitio ni el formulario para enviar spam, contenido ilegal u ofensivo, ni para intentar interrumpir o vulnerar su funcionamiento.</p>

      <h2>6. Propiedad intelectual</h2>
      <p>El nombre VORTEX, el logotipo, el diseño y los textos de este sitio pertenecen a VORTEX Digital Solutions. No puedes copiarlos, reproducirlos ni usarlos con fines comerciales sin nuestro permiso por escrito.</p>

      <h2>7. Enlaces y servicios de terceros</h2>
      <p>El sitio puede enlazar o apoyarse en servicios de terceros, como WhatsApp o Gmail. No controlamos esos servicios ni somos responsables de su contenido o de sus políticas.</p>

      <h2>8. Responsabilidad</h2>
      <p>Hacemos lo posible por mantener la información del sitio correcta y actualizada, pero no garantizamos que esté libre de errores ni que el sitio esté disponible sin interrupciones. Usas el sitio bajo tu propia responsabilidad.</p>

      <h2>9. Cambios</h2>
      <p>Podemos modificar estos términos cuando sea necesario. La versión vigente es la que aparece en esta página, con su fecha de actualización.</p>

      <h2>10. Ley aplicable y contacto</h2>
      <p>Estos términos se rigen por las leyes de la República de El Salvador. Si tienes dudas, escríbenos a <a href={mailUrl}>{CONTACT.email}</a>.</p>
    </LegalPage>
  );
}
