import type { Metadata } from "next";
import DemoBar from "@/components/DemoBar";
import s from "./cafe.module.css";

export const metadata: Metadata = {
  title: "Ejemplo: Café Volcán | VORTEX",
  robots: { index: false, follow: false },
};

const menu = [
  { cat: "Café", items: [["Espresso", "1.50"], ["Capuchino", "2.75"], ["Café de olla", "2.25"], ["Cold brew", "3.25"]] },
  { cat: "Para acompañar", items: [["Croissant de mantequilla", "2.50"], ["Pan de yema", "1.75"], ["Sándwich de pollo", "4.50"], ["Tarta del día", "3.50"]] },
];

export default function Cafeteria() {
  return (
    <div className={s.page}>
      <DemoBar name="Café Volcán" />
      <header className={s.header}>
        <b className={s.brand}>Café Volcán</b>
        <nav><a href="#menu">Menú</a><a href="#historia">Historia</a><a href="#horarios">Horarios</a></nav>
      </header>
      <main>
        <section className={s.hero}>
          <p className={s.kicker}>Café de altura · Tostado en casa</p>
          <h1>Un buen café <em>no tiene prisa.</em></h1>
          <p className={s.lead}>Granos de la región, tostados en pequeños lotes y servidos en un rincón tranquilo para conversar, trabajar o simplemente parar un rato.</p>
          <a className={s.btn} href="#menu">Ver el menú</a>
          <div className={s.cup} aria-hidden="true"><i /><i /><i /><b /></div>
        </section>

        <section id="menu" className={s.section}>
          <h2>El menú</h2>
          <div className={s.menu}>
            {menu.map((g) => (
              <div key={g.cat}>
                <h3>{g.cat}</h3>
                <ul>{g.items.map(([n, pr]) => <li key={n}><span>{n}</span><i /><b>${pr}</b></li>)}</ul>
              </div>
            ))}
          </div>
          <p className={s.note}>Precios ilustrativos de un negocio ficticio.</p>
        </section>

        <section id="historia" className={`${s.section} ${s.story}`}>
          <div className={s.blocks} aria-hidden="true"><span /><span /><span /></div>
          <div>
            <h2>Nuestra historia</h2>
            <p>Café Volcán nació de una idea simple: que el café local se sirva con el cuidado que merece. Trabajamos con productores de la zona y tostamos cada semana para que lo que llega a tu taza esté fresco.</p>
            <p>Este texto es de ejemplo. En una página real aquí va la historia verdadera de tu negocio, contada con tus palabras.</p>
          </div>
        </section>

        <section id="horarios" className={s.section}>
          <div className={s.visit}>
            <div><h2>Horarios</h2><p>Lunes a sábado · 7:00 a. m. a 7:00 p. m.<br />Domingo · 8:00 a. m. a 2:00 p. m.</p></div>
            <div><h2>Dónde estamos</h2><p>Calle Ejemplo, San Salvador.<br /><span className={s.note}>Datos ilustrativos.</span></p></div>
          </div>
        </section>
      </main>
      <footer className={s.footer}>© Café Volcán · Sitio de ejemplo creado por VORTEX</footer>
    </div>
  );
}
