import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A-FORCE | Demo Concesionaria Luxury — VORTEX Digital Solutions",
  description:
    "Demo de landing page para concesionaria de lujo A-FORCE. Creado por VORTEX Digital Solutions — diseño y desarrollo web de alto impacto en El Salvador.",
};

export default function AForceDemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
