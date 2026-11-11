import AutoRotator360 from "./AutoRotator360";
import { Navbar, Hero, Stats, Atelier, Inventario, Contacto, VortexPromo, Footer } from "./sections";

export default function AForcePage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-ink font-sans-tech text-chalk antialiased">
      <Navbar />
      <Hero />
      <Stats />
      <AutoRotator360 />
      <Atelier />
      <Inventario />
      <Contacto />
      <VortexPromo />
      <Footer />
    </main>
  );
}
