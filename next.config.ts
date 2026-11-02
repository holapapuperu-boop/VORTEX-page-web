import type { NextConfig } from "next";

const securityHeaders = [
  // Evita que el navegador "adivine" tipos de archivo.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Impide que otra web muestre este sitio dentro de un iframe (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // No filtra la URL completa a otros sitios al hacer clic en enlaces externos.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // El sitio no necesita cámara, micrófono ni ubicación.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  // No anuncia que el sitio usa Next.js.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
