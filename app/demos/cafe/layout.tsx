import type { Metadata } from "next";
import "./cafe.css";

export const metadata: Metadata = {
  title: "ORIGEN — Café de Especialidad | Demo VORTEX Digital Solutions",
  description:
    "Demo de landing page para cafetería de especialidad ORIGEN. Diseñado y desarrollado por VORTEX Digital Solutions — El Salvador.",
};

export default function CafeDemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
