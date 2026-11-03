"use client";
import { useEffect, useState } from "react";
import s from "./cafe.module.css";
import { HOURS } from "./hours";

const DAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const fmt = (h: number) => `${h % 12 || 12}:00 ${h < 12 ? "a. m." : "p. m."}`;

function status(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/El_Salvador", weekday: "short", hour: "numeric", hour12: false, minute: "numeric" }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const time = (Number(get("hour")) % 24) + Number(get("minute")) / 60;
  const [open, close] = HOURS[day];
  if (time >= open && time < close) return { open: true, text: `Cerramos a las ${fmt(close)}` };
  if (time < open) return { open: false, text: `Abrimos hoy a las ${fmt(open)}` };
  const next = (day + 1) % 7;
  return { open: false, text: `Abrimos mañana ${DAYS[next]} a las ${fmt(HOURS[next][0])}` };
}

export default function OpenNow({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [st, setSt] = useState<ReturnType<typeof status> | null>(null);
  useEffect(() => {
    const tick = () => setSt(status(new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  return (
    <p className={`${s.now} ${tone === "dark" ? s.nowDark : ""}`} aria-live="polite">
      <i className={st?.open ? s.dotOpen : s.dotClosed} />
      <b>{st ? (st.open ? "Abierto ahora" : "Cerrado ahora") : "Horario"}</b>
      <span>{st ? st.text : "Lunes a sábado de 7:00 a. m. a 7:00 p. m."}</span>
    </p>
  );
}
