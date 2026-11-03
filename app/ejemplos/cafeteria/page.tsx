import type { Metadata } from "next";
import DemoBar from "@/components/DemoBar";
import Landscape from "./Landscape";
import TastingMenu from "./TastingMenu";
import OpenNow from "./OpenNow";
import { HOURS } from "./hours";
import s from "./cafe.module.css";

export const metadata: Metadata = {
  title: "Ejemplo: Café Volcán | VORTEX",
  robots: { index: false, follow: false },
};

export default function Cafeteria() {
  return (
    <div className={s.page}>
      <DemoBar name="Café Volcán" />
      <section className={s.hero}>
        <Landscape />
        <header className={s.header}>
          <a href="#" className={s.brand}>Café Volcán</a>
          <nav aria-label="Principal">
            <a href="#menu">Menú</a>
            <a href="#visita">Visítanos</a>
          </nav>
        </header>
        <div className={s.heroText}>
          <h1>Del volcán<br />a tu taza.</h1>
          <p>Café de altura, tostado cada semana en San Salvador y preparado al momento.</p>
          <div className={s.heroActions}>
            <a className={s.btn} href="#menu">Ver el menú</a>
            <a className={s.btnLine} href="#visita">Cómo llegar</a>
          </div>
        </div>
        <div className={s.heroNow}><OpenNow tone="dark" /></div>
      </section>

      <TastingMenu />

      <section id="visita" className={s.visit}>
        <div className={s.visitIn}>
          <h2>Pasa por una taza</h2>
          <OpenNow tone="dark" />
          <dl className={s.hours}>
            <div><dt>Lunes a sábado</dt><dd>{HOURS[1][0]}:00 a. m. a {HOURS[1][1] - 12}:00 p. m.</dd></div>
            <div><dt>Domingo</dt><dd>{HOURS[0][0]}:00 a. m. a {HOURS[0][1] - 12}:00 p. m.</dd></div>
          </dl>
          <p className={s.addr}>Calle Ejemplo 123, San Salvador.<br /><small>Dirección ilustrativa de un negocio ficticio.</small></p>
        </div>
        <p className={s.bigword} aria-hidden="true">Volcán</p>
      </section>
      <footer className={s.footer}>© Café Volcán. Sitio de ejemplo creado por VORTEX.</footer>
    </div>
  );
}
