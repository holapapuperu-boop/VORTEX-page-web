"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
const links = [["Inicio", "#inicio"], ["Servicios", "#servicios"], ["Planes", "#planes"], ["VORTEX AI", "#vortex-ai"], ["Nosotros", "#nosotros"], ["Contacto", "#contacto"]];
export default function Header() {
  const [open, setOpen] = useState(false);
  return <header className="header"><div className="nav-wrap"><Logo/><nav className={open ? "nav open" : "nav"} aria-label="Navegación principal">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}<a className="nav-cta" href="#contacto" onClick={() => setOpen(false)}>Hablemos <span>↗</span></a></nav><button className="menu-toggle" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div></header>;
}
