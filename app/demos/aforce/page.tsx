import { headers } from "next/headers";
import ShowroomStory from "./ShowroomStory";
import HeroMobile from "./HeroMobile";
import ShowroomMobile from "./ShowroomMobile";
import { Navbar, Hero, Stats, Atelier, Inventario, Contacto, VortexPromo, Footer } from "./sections";

export default async function AForcePage() {
  // El middleware escribe x-is-mobile: 1 | 0 en cada request.
  // En PC → Hero y Showroom completos con Framer Motion (import directo, sin dynamic).
  // En móvil → versiones CSS puras sin springs ni sticky scroll.
  const h = await headers();
  const isMobile = h.get("x-is-mobile") === "1";

  return (
    <main className="min-h-screen overflow-x-clip bg-ink font-sans-tech text-chalk antialiased">
      <Navbar />
      {isMobile ? <HeroMobile /> : <Hero />}
      <Stats />
      {isMobile ? <ShowroomMobile /> : <ShowroomStory />}
      <Atelier />
      <Inventario />
      <Contacto />
      <VortexPromo />
      <Footer />
    </main>
  );
}
