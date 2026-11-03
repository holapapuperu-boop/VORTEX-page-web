import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Check, Mail, MapPin, MessageCircle, MoveRight } from "lucide-react";
import Header from "@/components/Header";
import Logo, { Mark } from "@/components/Logo";
import ContactForm from "@/components/ContactForm";
import HeroArt from "@/components/HeroArt";
import ServiceArt, { type ServiceKind } from "@/components/ServiceArt";
import ProcessList from "@/components/ProcessList";
import Reveal from "@/components/Reveal";
import VortexAI from "@/components/VortexAI";
import { CONTACT, mailUrl, whatsappLink, whatsappUrl } from "@/lib/contact";
import { CARE_PLANS, DEV_PLANS, QUOTE_MESSAGE, type Plan } from "@/lib/plans";

function PlanCard({ plan, delay }: { plan: Plan; delay: number }) {
  return (
    <Reveal delay={delay}>
      <article className="plan-card">
        <h3>{plan.name}</h3>
        <p className="plan-price">{plan.price}</p>
        <p className="plan-price-note">{plan.priceNote}</p>
        <p className="plan-desc">{plan.description}</p>
        {plan.lead && <p className="plan-lead">{plan.lead}</p>}
        <ul className="feature-list">
          {plan.items.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}
        </ul>
        <a className="button button-ghost" href={whatsappLink(plan.message)} target="_blank" rel="noopener noreferrer">
          {plan.cta} <ArrowUpRight />
        </a>
      </article>
    </Reveal>
  );
}

const webIncludes = [
  "Diseño moderno que se adapta a celular, tablet y computadora",
  "Sitios empresariales, páginas institucionales y catálogos digitales",
  "Contacto directo por WhatsApp, correo y formulario",
  "Publicación en línea y acompañamiento en la entrega",
];

const otherAreas: { kind: ServiceKind; number: string; title: string; text: string }[] = [
  { kind: "soft", number: "02", title: "Software a medida", text: "Sistemas y herramientas pensadas alrededor de necesidades específicas." },
  { kind: "ia", number: "03", title: "IA y automatización", text: "Automatización de tareas y soluciones inteligentes para negocios." },
  { kind: "digital", number: "04", title: "Soluciones digitales", text: "Integraciones, procesos más ágiles y herramientas tecnológicas." },
];

const steps = [
  ["01", "Conversación", "Entendemos tus necesidades y el contexto de tu negocio."],
  ["02", "Planificación", "Definimos objetivos, alcance y una ruta clara."],
  ["03", "Desarrollo", "Construimos y probamos la solución con atención al detalle."],
  ["04", "Entrega", "Revisamos el resultado y coordinamos su publicación."],
] as const;

export default function Home() {
  const year = new Date().getFullYear();
  return (
    <main>
      <Header />

      <section id="inicio" className="hero">
        <div className="hero-grid" />
        <div className="container hero-inner">
          <div className="hero-text">
            <p className="eyebrow"><i /> Diseño y desarrollo web · San Salvador</p>
            <h1>Páginas web profesionales <em>para tu negocio.</em></h1>
            <p className="hero-copy">Diseñamos y desarrollamos sitios web modernos, adaptados a celular y listos para publicar. También construimos software y automatizaciones a la medida de cada negocio.</p>
            <div className="actions">
              <a className="button button-blue" href="#contacto">Cotiza tu página web <ArrowDownRight /></a>
              <a className="text-link light-link" href="#servicios">Ver qué hacemos <MoveRight /></a>
            </div>
          </div>
          <HeroArt />
          <p className="scroll-hint">DESLIZA PARA EXPLORAR <span>↓</span></p>
        </div>
      </section>

      <section id="servicios" className="section services">
        <div className="container">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow blue"><i /> Servicios</p>
              <h2>Tu página web,<br /><em>bien hecha.</em></h2>
            </div>
            <p>Empezamos por tu presencia en línea. Y VORTEX crece contigo hacia software, automatización e inteligencia artificial.</p>
          </Reveal>

          <Reveal>
            <article className="service-feature">
              <ServiceArt kind="web" />
              <div className="feature-body">
                <div className="card-top"><span>01</span></div>
                <h3>Desarrollo web</h3>
                <p>Sitios empresariales, páginas institucionales, catálogos digitales y plataformas web, pensados para que tus clientes te encuentren y te contacten.</p>
                <ul className="feature-list">
                  {webIncludes.map((item) => (
                    <li key={item}><Check aria-hidden="true" />{item}</li>
                  ))}
                </ul>
                <a className="button button-blue" href="#contacto">Cotiza tu página web <ArrowDownRight /></a>
              </div>
            </article>
          </Reveal>

          <Reveal>
            <p className="mini-label"><i /> Y también, en evolución</p>
          </Reveal>
          <div className="service-grid">
            {otherAreas.map(({ kind, number, title, text }, i) => (
              <Reveal key={number} delay={i * 0.1}>
                <article className="service-card">
                  <ServiceArt kind={kind} />
                  <div className="card-top"><span>{number}</span></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <a href="#contacto" aria-label={`Consultar sobre ${title}`}><ArrowUpRight /></a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="ejemplos" className="section examples">
        <div className="container">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow blue"><i /> Ejemplos</p>
              <h2>Mira cómo puede<br /><em>verse tu página.</em></h2>
            </div>
            <p>Dos páginas de muestra con negocios ficticios y estilos distintos. Cada negocio merece su propio diseño.</p>
          </Reveal>
          <div className="example-grid">
            {[
              { href: "/ejemplos/laboratorio", cls: "ex-lab", title: "Laboratorio clínico", text: "Limpio, cercano y fácil de entender." },
              { href: "/ejemplos/cafeteria", cls: "ex-cafe", title: "Cafetería", text: "Cálido, editorial y con carácter." },
            ].map((ex, i) => (
              <Reveal key={ex.href} delay={i * 0.1}>
                <Link href={ex.href} className={`example-card ${ex.cls}`}>
                  <span className="example-art" aria-hidden="true" />
                  <strong>{ex.title}</strong>
                  <span>{ex.text}</span>
                  <em>Ver ejemplo <ArrowUpRight size={15} /></em>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="planes" className="section plans">
        <div className="container">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow blue"><i /> Nuestros planes</p>
              <h2>Elige el plan<br />que <em>va contigo.</em></h2>
            </div>
            <p>Tres opciones de desarrollo web, de la presencia más sencilla a las soluciones a medida.</p>
          </Reveal>
          <div className="plan-grid">
            {DEV_PLANS.map((plan, i) => <PlanCard key={plan.name} plan={plan} delay={i * 0.1} />)}
          </div>
          <Reveal><p className="plan-note">Los precios de Basic y Plus son precios iniciales orientativos. El precio final depende del alcance y de las características del proyecto. Dominio, alojamiento y servicios externos se cotizan por separado, salvo acuerdo específico.</p></Reveal>
        </div>
      </section>

      <section id="mantenimiento" className="section care">
        <div className="container">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow blue"><i /> Mantenimiento web</p>
              <h2>¿Tienes una página web<br /><em>descuidada?</em></h2>
            </div>
            <p>No dejes que tu sitio se quede atrás. En VORTEX te ayudamos a mantener tu página web actualizada, funcional y presentable.</p>
          </Reveal>
          <div className="plan-grid">
            {CARE_PLANS.map((plan, i) => <PlanCard key={plan.name} plan={plan} delay={i * 0.1} />)}
            <Reveal delay={0.2} className="check-wrap">
              <aside className="check-card" aria-label="Ejemplo ilustrativo de una revisión de mantenimiento">
                <p className="check-title">Así revisamos tu página</p>
                <ul>
                  {["Enlaces y botones", "Formularios", "Vista en celular", "Textos e imágenes"].map((t, i) => (
                    <li key={t} style={{ ["--i" as string]: i }}><span className="check-dot"><Check size={12} /></span>{t}</li>
                  ))}
                </ul>
                <p className="check-foot"><i /> Revisión mensual · ilustración</p>
              </aside>
            </Reveal>
          </div>
          <Reveal><p className="plan-note">Los planes de mantenimiento tienen límites razonables de modificaciones. No incluyen rediseños completos, nuevas funcionalidades complejas ni desarrollo de nuevas páginas. Dominio, alojamiento y servicios externos se cotizan por separado, salvo acuerdo específico. Los precios son propuestas iniciales de referencia.</p></Reveal>
        </div>
      </section>

      <section id="cotizacion" className="quote">
        <div className="container">
          <Reveal className="quote-card">
            <div>
              <p className="eyebrow"><i /> Cotización personalizada</p>
              <h2>¿No sabes qué plan <em>elegir?</em></h2>
              <p>Cuéntanos qué necesita tu negocio. Nuestro equipo te ayudará a encontrar la solución adecuada para tus objetivos y presupuesto.</p>
            </div>
            <a className="button button-blue" href={whatsappLink(QUOTE_MESSAGE)} target="_blank" rel="noopener noreferrer">Cotizar por WhatsApp <ArrowDownRight /></a>
          </Reveal>
        </div>
      </section>

      <section id="vortex-ai" className="assistant-section">
        <div className="container assistant-wrap">
          <Reveal className="assistant-intro">
            <p className="eyebrow"><i /> VORTEX AI <span className="beta-badge">BETA</span></p>
            <h2>¿No sabes qué diseño <em>quieres?</em></h2>
            <p>Cuéntanos de tu negocio y VORTEX AI te propone qué plan te conviene, qué secciones incluir y qué estilo seguir. Es inteligencia artificial en versión beta: orienta, y después lo aterrizamos juntos.</p>
          </Reveal>
          <Reveal delay={0.12}>
            <VortexAI />
          </Reveal>
        </div>
      </section>

      <section id="nosotros" className="about">
        <div className="container about-grid">
          <Reveal className="about-visual">
            <div className="visual-logo"><Mark /><div className="visual-line" /></div>
            <p>Diseño +<br />funcionalidad</p>
            <div className="square s1" />
            <div className="square s2" />
          </Reveal>
          <Reveal className="about-copy" delay={0.12}>
            <p className="eyebrow blue"><i /> Sobre VORTEX</p>
            <h2>Construimos tecnología <em>con propósito.</em></h2>
            <p>VORTEX es un proyecto de soluciones digitales enfocado en ayudar a negocios y organizaciones a fortalecer su presencia en línea y aprovechar mejor la tecnología.</p>
            <p>Nuestro enfoque combina diseño, funcionalidad y soluciones adaptadas a las necesidades de cada proyecto.</p>
            <a className="text-link" href="#contacto">Conoce nuestro enfoque <MoveRight /></a>
          </Reveal>
        </div>
      </section>

      <section className="process">
        <div className="container">
          <Reveal className="process-head">
            <p className="eyebrow"><i /> Cómo trabajamos</p>
            <h2>Un proceso claro,<br /><em>sin complicaciones.</em></h2>
          </Reveal>
          <ProcessList steps={steps} />
        </div>
      </section>

      <section className="cta">
        <Reveal className="container cta-inner">
          <p className="eyebrow blue"><i /> Comencemos</p>
          <h2>¿Tienes una idea?<br /><em>Hagámosla realidad.</em></h2>
          <p>Cuéntanos qué necesita tu negocio y exploremos cómo podemos ayudarte.</p>
          <a className="button button-blue" href="#contacto">Contactar con VORTEX <ArrowDownRight /></a>
        </Reveal>
      </section>

      <section id="contacto" className="contact section">
        <div className="container contact-grid">
          <Reveal>
            <p className="eyebrow blue"><i /> Contacto</p>
            <h2>Conversemos<br />sobre tu <em>proyecto.</em></h2>
            <p className="contact-intro">Elige el canal que prefieras. Estamos listos para escuchar tu idea.</p>
            <div className="contact-details">
              <a href={mailUrl} aria-label={`Escribir a ${CONTACT.email}`}><Mail /><span><small>CORREO</small>{CONTACT.email}</span><ArrowUpRight /></a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={`Abrir WhatsApp con ${CONTACT.whatsappDisplay}`}><MessageCircle /><span><small>WHATSAPP</small>{CONTACT.whatsappDisplay}</span><ArrowUpRight /></a>
              <div><MapPin /><span><small>UBICACIÓN</small>{CONTACT.location}</span></div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="form-shell">
              <h3>Cuéntanos tu idea</h3>
              <p>Responderemos por el canal que nos indiques.</p>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>

      <footer>
        <div className="container footer-main">
          <div><Logo light /><p>Ideas que se convierten en tecnología.</p></div>
          <div><h4>Navegación</h4><a href="#inicio">Inicio</a><a href="#servicios">Servicios</a><a href="#nosotros">Nosotros</a><a href="#contacto">Contacto</a></div>
          <div><h4>Áreas de trabajo</h4><span>Desarrollo web</span><span>Software a medida</span><span>IA y automatización</span><span>Soluciones digitales</span></div>
          <div><h4>Contacto</h4><a href={mailUrl}>{CONTACT.email}</a><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">{CONTACT.whatsappDisplay}</a><span>{CONTACT.location}</span></div>
        </div>
        <div className="container footer-bottom">
          <span>© {year} VORTEX DIGITAL SOLUTIONS</span>
          <span className="legal-links"><Link href="/privacidad">Privacidad</Link><Link href="/terminos">Términos</Link></span>
          <span>El Salvador</span>
        </div>
      </footer>
    </main>
  );
}
