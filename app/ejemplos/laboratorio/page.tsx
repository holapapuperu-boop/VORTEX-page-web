import type { Metadata } from "next";
import DemoBar from "@/components/DemoBar";
import s from "./lab.module.css";

export const metadata: Metadata = {
  title: "Ejemplo: Laboratorio Santa Lucía | VORTEX",
  robots: { index: false, follow: false },
};

const exams = [
  ["Hematología", "Hemograma completo y pruebas de coagulación."],
  ["Química sanguínea", "Glucosa, colesterol, función renal y hepática."],
  ["Orina y heces", "Exámenes generales y de parásitos."],
  ["Perfiles preventivos", "Paquetes por edad para chequeos periódicos."],
];
const steps = [
  ["Agenda", "Elige el examen y tu horario por WhatsApp."],
  ["Visítanos", "Toma de muestra rápida, con indicaciones claras de ayuno."],
  ["Recibe tus resultados", "Te avisamos cuando estén listos, en sede o en línea."],
];

export default function Laboratorio() {
  return (
    <div className={s.page}>
      <DemoBar name="Laboratorio Santa Lucía" />
      <header className={s.header}>
        <b className={s.brand}><i />Santa Lucía <small>Laboratorio clínico</small></b>
        <nav><a href="#examenes">Exámenes</a><a href="#proceso">Cómo funciona</a><a href="#visitanos">Visítanos</a></nav>
      </header>
      <main>
        <section className={s.hero}>
          <div>
            <p className={s.tag}>Laboratorio clínico</p>
            <h1>Tus exámenes, <em>claros y a tiempo.</em></h1>
            <p className={s.lead}>Atención cercana, indicaciones simples y resultados explicados con calma, para que cuides tu salud sin complicaciones.</p>
            <p><a className={s.btn} href="#visitanos">Agendar mi cita</a> <a className={s.btnGhost} href="#examenes">Ver exámenes</a></p>
          </div>
          <div className={s.art} aria-hidden="true">
            <div className={s.tube} /><div className={s.tube2} /><div className={s.drop} />
            <div className={s.card}><span>Hemograma</span><b>Listo para entrega</b></div>
          </div>
        </section>

        <section id="examenes" className={s.section}>
          <h2>Exámenes que realizamos</h2>
          <div className={s.grid}>
            {exams.map(([t, d]) => <article key={t} className={s.tile}><h3>{t}</h3><p>{d}</p></article>)}
          </div>
        </section>

        <section id="proceso" className={`${s.section} ${s.soft}`}>
          <h2>Así de sencillo</h2>
          <ol className={s.steps}>
            {steps.map(([t, d], i) => <li key={t}><span>{i + 1}</span><h3>{t}</h3><p>{d}</p></li>)}
          </ol>
        </section>

        <section id="visitanos" className={s.section}>
          <div className={s.visit}>
            <div>
              <h2>Visítanos</h2>
              <p>Lunes a viernes · 6:30 a. m. a 4:00 p. m.<br />Sábados · 7:00 a. m. a 12:00 m.</p>
              <p>Colonia Ejemplo, San Salvador.</p>
              <p className={s.note}>Datos ilustrativos: este es un sitio de muestra.</p>
            </div>
            <div className={s.cta}>
              <h3>¿Dudas sobre tu examen?</h3>
              <p>Escríbenos y te indicamos si necesitas ayuno u otra preparación.</p>
              <span className={s.btn}>Botón de WhatsApp (ejemplo)</span>
            </div>
          </div>
        </section>
      </main>
      <footer className={s.footer}>© Laboratorio Santa Lucía · Sitio de ejemplo creado por VORTEX</footer>
    </div>
  );
}
