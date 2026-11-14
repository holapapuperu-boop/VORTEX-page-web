import type { Metadata } from "next";
import "./laboratorio.css";

export const metadata: Metadata = {
  title: "VERITAS LAB · Diagnóstico Clínico — Demo VORTEX Digital Solutions",
  description:
    "Demo de landing page para laboratorio clínico moderno en San Salvador. Creado por VORTEX Digital Solutions — diseño y desarrollo web en El Salvador.",
};

export default function LaboratorioDemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
