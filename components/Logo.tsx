type Props = { light?: boolean; compact?: boolean; href?: string };
export function Mark({ light = false }: { light?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 56 46" className="mark"><path d="M3 4h13.8L28 27.3 39.3 4H53L28 42z" fill={light ? "#fff" : "#0B0F14"}/><path d="M39.3 4H53L42.4 17.1H28.6z" fill="#2563EB"/></svg>;
}
export default function Logo({ light = false, compact = false, href = "#inicio" }: Props) {
  return <a className={`logo ${light ? "logo-light" : ""}`} href={href} aria-label="VORTEX, inicio"><Mark light={light}/>{!compact && <span><strong>VORTEX</strong><small>DIGITAL SOLUTIONS</small></span>}</a>;
}
