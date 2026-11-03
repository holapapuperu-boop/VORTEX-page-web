"use client";
import { useState } from "react";
import s from "./cafe.module.css";

const DRINKS = [
  { name: "Espresso doble", price: "2.00", note: "Chocolate amargo, panela y un final largo de naranja. Corto, denso y sin azúcar.", a: 3, c: 5, d: 3 },
  { name: "Capuchino", price: "3.25", note: "Leche texturizada a mano, cacao y avellana tostada. El más pedido por la mañana.", a: 2, c: 4, d: 4 },
  { name: "Café de olla", price: "2.75", note: "Café filtrado con panela, canela y clavo. La receta de la casa, servida en jarro.", a: 1, c: 3, d: 5 },
  { name: "Filtrado del día", price: "3.50", note: "Cambia cada semana. Esta semana: durazno, jazmín y miel, preparado en V60.", a: 5, c: 2, d: 4 },
  { name: "Cold brew", price: "3.75", note: "Infusión en frío de 18 horas. Suave, con cacao y caramelo, servido con hielo grande.", a: 1, c: 4, d: 4 },
] as const;

function Meter({ label, v }: { label: string; v: number }) {
  return (
    <div className={s.meter}>
      <span>{label}</span>
      <div aria-label={`${label}: ${v} de 5`} role="img">{[1, 2, 3, 4, 5].map((n) => <i key={n} data-on={n <= v} style={{ transitionDelay: `${n * 45}ms` }} />)}</div>
    </div>
  );
}

export default function TastingMenu() {
  const [i, setI] = useState(0);
  const d = DRINKS[i];
  return (
    <section id="menu" className={s.menuSec}>
      <div className={s.menuIn}>
        <h2 className={s.menuTitle}>Qué tomar</h2>
        <div className={s.menuGrid}>
          <div role="tablist" aria-label="Bebidas" className={s.drinkList}>
            {DRINKS.map((x, n) => (
              <button key={x.name} role="tab" id={`d${n}`} aria-selected={i === n} aria-controls="dpanel" className={i === n ? s.drinkOn : ""} onClick={() => setI(n)}>
                <span>{x.name}</span><em>${x.price}</em>
              </button>
            ))}
          </div>
          <div id="dpanel" role="tabpanel" aria-labelledby={`d${i}`} className={s.drinkPanel}>
            <h3 key={d.name}>{d.name}</h3>
            <p key={d.note}>{d.note}</p>
            <div className={s.meters}>
              <Meter label="Acidez" v={d.a} />
              <Meter label="Cuerpo" v={d.c} />
              <Meter label="Dulzor" v={d.d} />
            </div>
            <b className={s.price}>${d.price}</b>
          </div>
        </div>
        <p className={s.fine}>Precios y recetas ilustrativos de un negocio ficticio.</p>
      </div>
    </section>
  );
}
