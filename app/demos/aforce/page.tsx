import ShowroomStory from "./ShowroomStory";
import { Navbar, Hero, Stats, Atelier, Inventario, Contacto, VortexPromo, Footer } from "./sections";

export default function AForcePage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-ink font-sans-tech text-chalk antialiased">
      <Navbar />
      <Hero />
      <Stats />
      <ShowroomStory />
      <Atelier />
      <Inventario />
      <Contacto />
      <VortexPromo />
      <Footer />
    </main>
  );
}
