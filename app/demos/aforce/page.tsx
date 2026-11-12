import { headers } from "next/headers";
import ShowroomCarousel from "./ShowroomCarousel";
import HeroMobile from "./HeroMobile";
import { Navbar, Hero, Stats, Atelier, Inventario, Contacto, VortexPromo, Footer } from "./sections";

export default async function AForcePage() {
  const h = await headers();
  const isMobile = h.get("x-is-mobile") === "1";

  return (
    <main className="min-h-screen overflow-x-clip bg-ink font-sans-tech text-chalk antialiased">
      <Navbar />
      {isMobile ? <HeroMobile /> : <Hero />}
      <Stats />
      {/* Carrusel fullscreen: mismo en móvil y desktop — sin sticky scroll */}
      <ShowroomCarousel />
      <Atelier />
      <Inventario />
      <Contacto />
      <VortexPromo />
      <Footer />
    </main>
  );
}
