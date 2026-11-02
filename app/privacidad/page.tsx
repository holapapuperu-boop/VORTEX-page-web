import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { CONTACT, mailUrl } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Aviso de privacidad | VORTEX",
  description: "Qué datos recopila VORTEX Digital Solutions a través de este sitio, para qué los usa y cómo puedes ejercer tus derechos.",
  alternates: { canonical: "/privacidad" },
};

export default function Privacidad() {
  return (
    <LegalPage title="Aviso de privacidad" updated="2 de noviembre de 2026">
      <p>En VORTEX Digital Solutions queremos que sepas con claridad qué datos recibimos cuando usas este sitio, para qué los usamos y qué puedes hacer con ellos.</p>

      <h2>1. Quién es el responsable</h2>
      <p>VORTEX Digital Solutions, con base en {CONTACT.location}. Puedes escribirnos a <a href={mailUrl}>{CONTACT.email}</a> para cualquier consulta sobre este aviso.</p>

      <h2>2. Qué datos recopilamos</h2>
      <ul>
        <li><strong>Formulario de contacto:</strong> tu nombre, tu correo electrónico y el mensaje que escribas.</li>
        <li><strong>Correo electrónico:</strong> si nos escribes directamente, recibimos tu dirección y el contenido del mensaje.</li>
        <li><strong>WhatsApp:</strong> si nos escribes por ahí, recibimos tu número de teléfono, tu nombre de perfil y el contenido de la conversación.</li>
        <li><strong>Asistente de ideas:</strong> las preguntas que escribas en el asistente (ver el apartado 5).</li>
        <li><strong>Datos técnicos básicos:</strong> como cualquier sitio web, el servicio de alojamiento puede registrar datos como la dirección IP, el navegador y la fecha de la visita, con fines de seguridad y funcionamiento.</li>
      </ul>
      <p>No te pedimos datos sensibles ni financieros. Te pedimos que no los incluyas en tus mensajes.</p>

      <h2>3. Para qué los usamos</h2>
      <ul>
        <li>Responder tu consulta y darle seguimiento.</li>
        <li>Orientarte con ideas para tu página mediante el asistente automático.</li>
        <li>Preparar una cotización o propuesta si nos la solicitas.</li>
        <li>Mantener la comunicación durante un proyecto, si llegamos a trabajar juntos.</li>
        <li>Proteger el sitio contra spam y usos indebidos.</li>
      </ul>
      <p>No vendemos ni alquilamos tus datos, y no te enviamos publicidad que no hayas pedido.</p>

      <h2>4. Con quién se comparten</h2>
      <p>Para que el sitio funcione usamos servicios de terceros, que pueden procesar tus datos en sus propios sistemas, incluso fuera de El Salvador:</p>
      <ul>
        <li><strong>Web3Forms:</strong> recibe lo que escribes en el formulario y nos lo reenvía por correo.</li>
        <li><strong>Google (Gmail):</strong> recibe y almacena los correos que llegan a nuestra cuenta.</li>
        <li><strong>Meta (WhatsApp):</strong> gestiona las conversaciones que inicies por esa vía.</li>
        <li><strong>Groq:</strong> procesa lo que escribes al asistente de ideas para generar la respuesta.</li>
        <li><strong>Vercel:</strong> aloja el sitio web.</li>
        <li><strong>Google Fonts:</strong> sirve las tipografías de la página, por lo que tu navegador se conecta a Google al cargarla.</li>
      </ul>
      <p>Cada proveedor tiene sus propias políticas de privacidad. Fuera de estos casos, solo compartiríamos tus datos si una autoridad competente nos lo exigiera.</p>

      <h2>5. VORTEX AI y asistente (inteligencia artificial)</h2>
      <p>La página incluye VORTEX AI (versión beta), que analiza la información de tu negocio y recomienda un plan, y un asistente que responde preguntas sobre ideas para tu página web. Las respuestas las genera una inteligencia artificial, son experimentales, pueden contener errores y no constituyen una cotización, propuesta ni asesoría profesional.</p>
      <ul>
        <li>Lo que escribas en VORTEX AI o en el asistente (por ejemplo, la descripción de tu negocio) se envía a nuestro proveedor de IA (Groq) para generar la respuesta.</li>
        <li>VORTEX AI no te pide datos de contacto para analizar tu negocio. Solo si decides pulsar &ldquo;Guardar mi propuesta&rdquo; nos envías tu nombre, correo y, opcionalmente, tu WhatsApp junto con la propuesta, para que podamos revisarla y contactarte.</li>
        <li>No guardamos esas conversaciones en una base de datos propia. Para evitar abusos, limitamos temporalmente el número de preguntas por visitante usando tu dirección IP, sin asociarla a tu identidad.</li>
        <li>Por favor, no escribas datos personales, financieros ni confidenciales en el asistente.</li>
        <li>Si decides enviarnos un resumen de tu conversación con el botón del asistente, ese texto pasa al formulario de contacto y solo se envía si tú pulsas &ldquo;Enviar consulta&rdquo;. Puedes editarlo antes.</li>
      </ul>

      <h2>6. Cookies y analítica</h2>
      <p>Este sitio no utiliza cookies publicitarias ni de seguimiento, ni herramientas de analítica. Si esto cambia, actualizaremos este aviso y pediremos tu consentimiento cuando corresponda.</p>

      <h2>7. Cuánto tiempo conservamos tus datos</h2>
      <p>Conservamos tus datos mientras sea necesario para atender tu consulta o mantener una relación de trabajo contigo. Después podemos eliminarlos o, si prefieres, los eliminamos antes cuando nos lo pidas.</p>

      <h2>8. Tus derechos</h2>
      <p>Puedes pedirnos en cualquier momento que:</p>
      <ul>
        <li>te informemos qué datos tuyos tenemos,</li>
        <li>corrijamos datos incorrectos,</li>
        <li>eliminemos tus datos, o</li>
        <li>dejemos de usarlos para un fin determinado.</li>
      </ul>
      <p>Escríbenos a <a href={mailUrl}>{CONTACT.email}</a> indicando qué necesitas y te responderemos lo antes posible.</p>

      <h2>9. Seguridad</h2>
      <p>El sitio se publica con conexión cifrada (HTTPS) y usamos proveedores reconocidos. Aun así, ningún sistema en internet es completamente infalible, por lo que no podemos garantizar seguridad absoluta.</p>

      <h2>10. Menores de edad</h2>
      <p>Este sitio está dirigido a negocios y personas adultas. No recopilamos de forma intencional datos de menores de edad.</p>

      <h2>11. Cambios en este aviso</h2>
      <p>Podemos actualizar este aviso cuando sea necesario. La fecha de la última actualización aparece al inicio de la página.</p>
    </LegalPage>
  );
}
