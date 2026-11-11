import { HeroClient, ShowroomClient } from "./ClientSections";
import { Navbar, Stats, Atelier, Inventario, Contacto, VortexPromo, Footer } from "./sections";

export default function AForcePage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-ink font-sans-tech text-chalk antialiased">
      <Navbar />
      <HeroClient />
      <Stats />
      <ShowroomClient />
      <Atelier />
      <Inventario />
      <Contacto />
      <VortexPromo />
      <Footer />
    </main>
  );
}
