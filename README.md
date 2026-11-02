# VORTEX Digital Solutions

Sitio corporativo creado con Next.js, TypeScript y Lucide.

## Ejecutar localmente

1. Instala las dependencias: `npm install`
2. Copia `.env.example` como `.env.local` y completa las variables (ver abajo).
3. Inicia desarrollo: `npm run dev`
4. Abre `http://localhost:3000`

Si usas PowerShell y `npm` falla por la política de ejecución, ejecuta una vez:
`Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

Para una comprobación de producción: `npm run build` y luego `npm start`.

## Datos de contacto

Se editan en un solo lugar: `lib/contact.ts` (correo, WhatsApp, mensaje inicial y ubicación).

## Variables de entorno

| Variable | Para qué sirve |
|---|---|
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Clave de [Web3Forms](https://web3forms.com) para que el formulario llegue al correo de VORTEX. |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (por ejemplo `https://vortex.com`). La usan el sitemap y `robots.txt`. |

| `GROQ_API_KEY` | **Secreta.** Clave de [Groq](https://console.groq.com) para el asistente de ideas. En Vercel guárdala como tipo *Secreto* y sin el prefijo `NEXT_PUBLIC_`. |
| `GROQ_MODELS` | Opcional. Modelos de Groq en orden de preferencia, separados por coma. |

En Vercel se agregan en **Project Settings → Environment Variables**.
En Web3Forms hay que registrar también el dominio publicado, no solo `localhost`.

## Asistente de ideas (IA)

- Interfaz: `components/Assistant.tsx`. Servidor: `app/api/asistente/route.ts`.
- Todos los límites (preguntas por visitante, largo de mensajes, tokens) y las reglas que sigue la IA
  están en `lib/assistant.ts`.
- Usa Groq con una cadena de modelos: si uno agota su cuota o falla, prueba el siguiente.
  Si ninguno responde, la persona ve un aviso con el enlace a WhatsApp.
- La clave nunca llega al navegador. El límite por visitante es en memoria y de mejor esfuerzo;
  la protección real contra gasto es usar el plan gratuito de Groq **sin tarjeta**.
- No se guardan las conversaciones ni se registra su contenido.
- Si cambias proveedores o modelos, actualiza el Aviso de privacidad (`app/privacidad/page.tsx`).

## Planes, mantenimiento y VORTEX AI (BETA)

- Los textos y precios de los planes están en `lib/plans.ts` (se editan ahí, sin tocar el diseño). Los botones abren WhatsApp con un mensaje ya preparado.
- **VORTEX AI** (`/api/vortex-ai`): el visitante describe su negocio y la IA (Groq) recomienda un plan (Basic/Plus/Core), secciones y estilo. Límite: 2 usos por visitante al día, 500 caracteres en la descripción, validado en el servidor.
- **"Guardar mi propuesta"** envía la propuesta y los datos de contacto (nombre, correo, WhatsApp opcional) a tu correo por Web3Forms, solo si el visitante acepta.

### Qué funciona hoy y qué falta

| Funciona con lo que ya tienes | Necesita decisión o servicio externo |
| --- | --- |
| Secciones de planes, mantenimiento y cotización | Imagen conceptual de portada: requiere un servicio de generación de imágenes (probablemente de pago) |
| VORTEX AI: análisis y plan recomendado (requiere `GROQ_API_KEY`) | Demostración interactiva (aún no construida; aparece como "próximamente") |
| Guardar propuesta por correo (Web3Forms) | Límite de usos 100 % fiable: hoy es en memoria, por instancia. Para asegurarlo hace falta una base de datos (p. ej. Upstash Redis desde Vercel Marketplace) |

Sin `GROQ_API_KEY` la herramienta responde "no disponible" y el resto del sitio sigue funcionando.

## Páginas legales

- `/privacidad`: aviso de privacidad.
- `/terminos`: términos de uso.

Son textos generales y no constituyen asesoría legal. Conviene revisarlos con un abogado
y actualizarlos si cambian los servicios que se usan (analítica, cookies, nuevos proveedores)
o si VORTEX se constituye como empresa (razón social, datos de registro).

## Despliegue gratuito

Importa este repositorio en Vercel (detecta Next.js automáticamente), configura las variables
de entorno y obtendrás una URL HTTPS. Después puedes añadir tu dominio propio desde la
configuración del proyecto.
