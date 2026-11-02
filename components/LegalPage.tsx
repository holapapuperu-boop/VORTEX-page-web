import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

type Props = { title: string; updated: string; children: ReactNode };

/** Plantilla común de las páginas legales (privacidad y términos). */
export default function LegalPage({ title, updated, children }: Props) {
  return (
    <>
      <header className="legal-header">
        <div className="container legal-bar">
          <Logo light href="/" />
          <Link href="/" className="legal-back"><ArrowLeft aria-hidden="true" /> Volver al inicio</Link>
        </div>
      </header>
      <main className="legal">
        <div className="legal-inner">
          <p className="eyebrow blue"><i /> Información legal</p>
          <h1>{title}</h1>
          <p className="legal-updated">Última actualización: {updated}</p>
          {children}
        </div>
      </main>
      <footer className="legal-footer">
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} VORTEX DIGITAL SOLUTIONS</span>
          <span><Link href="/privacidad">Privacidad</Link> · <Link href="/terminos">Términos</Link></span>
        </div>
      </footer>
    </>
  );
}
