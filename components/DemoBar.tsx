import { whatsappLink } from "@/lib/contact";
import styles from "./DemoBar.module.css";

export default function DemoBar({ name }: { name: string }) {
  return (
    <div className={styles.bar} role="note">
      <p><strong>Página de ejemplo</strong> hecha por VORTEX. {name} es un negocio ficticio.</p>
      <span>
        <a href="/#ejemplos">← Volver a VORTEX</a>
        <a className={styles.cta} href={whatsappLink(`Hola VORTEX, vi el ejemplo de ${name} y quiero una página así para mi negocio.`)}>Quiero una así</a>
      </span>
    </div>
  );
}
