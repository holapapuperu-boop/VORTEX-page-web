import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Check, Mail, MapPin, MessageCircle, MoveRight, ExternalLink, Clock } from "lucide-react";
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

      {/* ── Demos / Ejemplos ── */}
      <section id="demos" className="demos">
        <div className="container">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow blue"><i /> Ejemplos de proyectos</p>
              <h2>Así se ven<br /><em>nuestras webs.</em></h2>
            </div>
            <p>Demostraciones reales del tipo de páginas que podemos crear para tu negocio. Cada demo es un ejemplo funcional con diseño completo.</p>
          </Reveal>
          <div className="demo-grid">

            {/* Demo 1 — A-FORCE (disponible) */}
            <Reveal>
              <article className="demo-card">
                <div className="demo-thumb">
                  {/* Mini preview del hero de A-FORCE */}
                  <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" width="260" height="130" aria-hidden>
                    <rect width="400" height="200" fill="#0A0A0A"/>
                    <path d="M 42 145 Q 55 110 90 92 Q 145 72 200 70 Q 240 68 265 70 L 335 78 Q 390 90 410 108 L 428 140 Q 435 158 420 164 L 42 164 Q 28 158 42 145Z" fill="none" stroke="rgba(196,164,74,.35)" strokeWidth="1.5"/>
                    <path d="M 115 92 Q 150 55 215 46 L 300 46 Q 345 48 368 78 L 115 92Z" fill="rgba(196,164,74,.06)" stroke="rgba(196,164,74,.22)" strokeWidth="1.2"/>
                    <circle cx="118" cy="164" r="20" fill="none" stroke="rgba(196,164,74,.35)" strokeWidth="1.5"/>
                    <circle cx="118" cy="164" r="10" fill="rgba(196,164,74,.1)" stroke="rgba(196,164,74,.4)" strokeWidth="1.2"/>
                    <circle cx="316" cy="164" r="20" fill="none" stroke="rgba(196,164,74,.35)" strokeWidth="1.5"/>
                    <circle cx="316" cy="164" r="10" fill="rgba(196,164,74,.1)" stroke="rgba(196,164,74,.4)" strokeWidth="1.2"/>
                    <text x="200" y="30" textAnchor="middle" fill="rgba(196,164,74,.7)" fontSize="11" fontFamily="Georgia,serif" letterSpacing="4" fontWeight="600">A-FORCE</text>
                    <text x="200" y="186" textAnchor="middle" fill="rgba(196,164,74,.3)" fontSize="7" fontFamily="Arial,sans-serif" letterSpacing="3">REFUSE ORDINARY</text>
                  </svg>
                </div>
                <div className="demo-body">
                  <p className="demo-industry">Concesionaria · Detailing</p>
                  <span className="demo-badge">Demo disponible</span>
                  <h3>A-FORCE</h3>
                  <p>Landing completa para concesionaria de lujo. Dark mode editorial, catálogo de builds, showcase de servicios y formulario de proyectos.</p>
                  <Link href="/demos/aforce" className="demo-cta">
                    Ver demo <ExternalLink />
                  </Link>
                </div>
              </article>
            </Reveal>

            {/* Demo 2 — ORIGEN (disponible) */}
            <Reveal delay={0.1}>
              <article className="demo-card">
                <div className="demo-thumb">
                  {/* Mini preview del hero de ORIGEN */}
                  <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" width="260" height="130" aria-hidden>
                    <rect width="400" height="200" fill="#F7F4EF"/>
                    {/* Watermark gigante */}
                    <text x="200" y="140" textAnchor="middle" fill="#E6E0D6" fontSize="118" fontFamily="Georgia,serif" fontWeight="700" letterSpacing="-4">ORIGEN</text>
                    {/* Copa de café estilizada */}
                    <ellipse cx="260" cy="80" rx="30" ry="38" fill="#C4916A" opacity=".85"/>
                    <ellipse cx="260" cy="58" rx="22" ry="8" fill="#8B5E3C" opacity=".7"/>
                    <ellipse cx="260" cy="58" rx="16" ry="5" fill="#6B3F20" opacity=".5"/>
                    {/* Vapor */}
                    <path d="M250 50 Q252 40 250 32" fill="none" stroke="#D6CFC7" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
                    <path d="M260 48 Q262 36 260 28" fill="none" stroke="#D6CFC7" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
                    <path d="M270 50 Q272 40 270 32" fill="none" stroke="#D6CFC7" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
                    {/* Texto editorial */}
                    <text x="90" y="75" fill="#1C1917" fontSize="11" fontFamily="Georgia,serif" letterSpacing="3">CAFÉ DE</text>
                    <text x="90" y="92" fill="#1C1917" fontSize="11" fontFamily="Georgia,serif" letterSpacing="3">ESPECIALIDAD</text>
                    <line x1="90" y1="100" x2="180" y2="100" stroke="#E2DDD5" strokeWidth="1"/>
                    <text x="90" y="115" fill="#B45309" fontSize="8" fontFamily="Arial,sans-serif" letterSpacing="2">TUESTE · ORIGEN · SABOR</text>
                  </svg>
                </div>
                <div className="demo-body">
                  <p className="demo-industry">Cafetería · Especialidad</p>
                  <span className="demo-badge">Demo disponible</span>
                  <h3>ORIGEN</h3>
                  <p>Landing editorial para cafetería de especialidad. Estética cálida, carta interactiva con carrito WhatsApp, ficha de tueste y espacio de trabajo.</p>
                  <Link href="/demos/cafe" className="demo-cta">
                    Ver demo <ExternalLink />
                  </Link>
                </div>
              </article>
            </Reveal>

            {/* Demo 3 — Próximamente */}
            <Reveal delay={0.2}>
              <article className="demo-card">
                <div className="demo-thumb" style={{ background: "linear-gradient(135deg,#0a0a0a,#1a1210)" }}>
                  <svg viewBox="0 0 400 200" width="200" height="100" aria-hidden>
                    <rect x="140" y="60" width="120" height="80" rx="4" fill="none" stroke="rgba(196,164,74,.2)" strokeWidth="1.5"/>
                    <rect x="155" y="75" width="90" height="12" rx="2" fill="rgba(196,164,74,.08)" stroke="rgba(196,164,74,.2)" strokeWidth="1"/>
                    <rect x="155" y="95" width="70" height="8" rx="2" fill="rgba(196,164,74,.05)"/>
                    <rect x="155" y="108" width="80" height="8" rx="2" fill="rgba(196,164,74,.05)"/>
                    <rect x="155" y="121" width="50" height="8" rx="2" fill="rgba(196,164,74,.05)"/>
                  </svg>
                </div>
                <div className="demo-body">
                  <p className="demo-industry">Hotel · Hospedaje</p>
                  <div className="demo-coming">
                    <Clock />
                    <span>Próximamente</span>
                  </div>
                </div>
              </article>
            </Reveal>

          </div>
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
