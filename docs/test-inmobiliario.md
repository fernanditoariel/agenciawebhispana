# Test lead magnet — "¿Tu presencia digital vende o espanta clientes?"

Público: agentes inmobiliarios (México). Objetivo: captar WhatsApp+mail + entregar devolución
automática (API de Claude) que nombra 3 agujeros y termina invitando a la llamada de auditoría.
Motor: reutilizar ~/app-test-liderazgo (PHP + API Claude).

## Preguntas (7) — cada opción suma puntos (0–3)

**1. ¿Tenés una página web propia como agente?**
- a) No, ninguna (0)
- b) Solo mi perfil en un portal (tipo Inmuebles24/Vivanuncios) (1)
- c) Sí, una web básica pero no capta clientes (2)
- d) Sí, web profesional que capta interesados (3)

**2. ¿Cómo te encuentran hoy la mayoría de tus clientes?**
- a) Solo por referidos / boca a boca (1)
- b) Por los portales inmobiliarios (1)
- c) Por mis redes sociales (2)
- d) Me buscan por mi nombre/marca (3)

**3. ¿Con qué frecuencia publicás en Instagram?**
- a) No tengo o está abandonado (0)
- b) Esporádico, cuando me acuerdo (1)
- c) 1–2 veces por semana (2)
- d) Casi a diario y con estrategia (3)

**4. ¿Tu perfil deja claro en 3 segundos quién sos, tu zona y qué ofrecés?**
- a) No, es genérico (0)
- b) Más o menos (1)
- c) Sí, totalmente claro (3)

**5. ¿Capturás los datos de los interesados (no solo esperar el DM)?**
- a) No capturo nada (0)
- b) Solo por mensaje directo (1)
- c) Tengo formulario de contacto (2)
- d) Tengo un sistema de captación (lead magnet/CRM) (3)

**6. ¿Usás video/reels mostrando propiedades y tu cara?**
- a) Nunca (0)
- b) A veces (1)
- c) Seguido y con intención (3)

**7. ¿Tenés un proceso para seguir a los que consultaron y no cerraron?**
- a) No, se pierden (0)
- b) A mano, cuando puedo (1)
- c) Sí, sistematizado (3)

Puntaje máximo: 21.

## Bandas de resultado
- **0–7 — "Presencia que espanta" 🔴**: sos casi invisible online; dependés 100% de referidos y
  se te escapan clientes que hoy te buscan en internet.
- **8–14 — "Presencia tibia" 🟡**: estás, pero no convertís. Tenés tráfico/atención que no se
  transforma en consultas ni operaciones. Dejás plata sobre la mesa.
- **15–21 — "Presencia que vende" 🟢**: buena base. Faltan ajustes de conversión y escala para
  que trabaje en piloto automático.

## Captura (antes de mostrar resultado)
Campos: Nombre · WhatsApp · Email · (opcional) Ciudad/Zona. Consentimiento simple.
Evento Pixel "Lead" al enviar.

## Prompt de devolución (API de Claude)
SYSTEM: Sos un consultor de marketing digital inmobiliario de Agencia Web Hispana. Tono cercano,
profesional, directo, español neutro para México. Nunca prometas resultados garantizados.

USER (variables): nombre={nombre}, ciudad={ciudad}, puntaje={score}/21, banda={banda},
respuestas={detalle a→d por pregunta}.

TAREA: Escribí una devolución personalizada de 180–250 palabras que:
1. Salude por su nombre y le diga su banda con empatía (sin humillar).
2. Nombre **exactamente 3 agujeros concretos** derivados de sus respuestas más flojas
   (ej. "no tenés web propia", "tu perfil no dice tu zona", "no capturás datos").
3. Por cada agujero, una frase de qué le está costando eso en clientes/operaciones.
4. Cierre con UN CTA claro a agendar una **llamada de auditoría gratuita de 15 min** por WhatsApp,
   sin vender el precio todavía.
Formato: 2–3 párrafos cortos + los 3 agujeros como bullets. Nada de markdown pesado.

## CTA final (post-devolución)
Botón WhatsApp (a +54 11 6905 3310 por ahora) con mensaje pre-cargado:
"Hola Fernando, hice el test y quiero mi llamada de auditoría gratis. Mi resultado fue: {banda}."
