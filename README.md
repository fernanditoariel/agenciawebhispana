# Agencia Web Hispana — Landing + Test

Sitio estático + función serverless (Vercel) del lead magnet para agentes inmobiliarios.

## Estructura
- `index.html` — landing de venta (nicho inmobiliario).
- `test.html` + `app.js` — test de 7 preguntas, captura (WhatsApp+mail) y resultado.
- `api/devolucion.js` — serverless: genera la devolución con la API de Claude y (opcional) guarda el lead.
- `styles.css` — estilos con la paleta de marca.

## Variables de entorno (en Vercel → Project → Settings → Environment Variables)
- `ANTHROPIC_API_KEY` **(requerida)** — tu API key de Claude (la misma del test de liderazgo).
- `MODEL` (opcional) — por defecto `claude-sonnet-5`.
- `LEADS_WEBHOOK_URL` (opcional) — URL de Google Apps Script para guardar leads en una Sheet
  (reutilizar el patrón del ebook). Si no está, el test funciona igual pero no guarda el lead.

Sin `ANTHROPIC_API_KEY` el test igual muestra una devolución de respaldo por banda (no personalizada).

## Deploy
1. Subir esta carpeta a un repo de GitHub (o deploy directo).
2. Importar en Vercel. Framework preset: **Other** (sitio estático + /api).
3. Cargar las env vars de arriba y desplegar.
4. Conectar el dominio `agenciawebhispana.com` cuando esté recomprado.

## Pendientes
- [ ] Colocar `assets/logo.png` (logo real de la marca).
- [ ] Instalar el Pixel de Meta en `index.html` y `test.html` (evento `Lead` al enviar el form).
- [ ] Recomprar dominio y conectarlo.
- [ ] Cargar `ANTHROPIC_API_KEY` y (opcional) `LEADS_WEBHOOK_URL`.
