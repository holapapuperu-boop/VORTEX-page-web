import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VORTEX | Páginas web y soluciones digitales en El Salvador",
  description: "Diseñamos y desarrollamos páginas web profesionales para negocios en El Salvador. También software a medida y automatización.",
  keywords: ["páginas web en El Salvador", "desarrollo web en El Salvador", "diseño de páginas web para negocios", "software a medida", "automatización empresarial"],
  openGraph: {
    title: "VORTEX | Páginas web profesionales para tu negocio",
    description: "Diseño y desarrollo web, software a medida y automatización para negocios en El Salvador.",
    locale: "es_SV",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
