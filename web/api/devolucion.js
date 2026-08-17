// Vercel serverless function — genera la devolución con la API de Claude
// y (opcional) reenvía el lead a un webhook (Google Apps Script / Sheet).
// Env vars requeridas: ANTHROPIC_API_KEY. Opcional: MODEL, LEADS_WEBHOOK_URL.

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { score, max = 21, banda, lead = {}, answers = [] } = req.body || {};
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const model = process.env.MODEL || "claude-sonnet-5";

    // Fire-and-forget: guardar el lead si hay webhook configurado.
    if (process.env.LEADS_WEBHOOK_URL) {
      fetch(process.env.LEADS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, score, banda, fecha: new Date().toISOString() }),
      }).catch(() => {});
    }

    if (!apiKey) return res.status(200).json({ devolucion: "" }); // el front usa su fallback

    const detalle = answers.map((a, i) => `P${i + 1}: ${a.q} → "${a.a}" (${a.pts} pts)`).join("\n");

    const system =
      "Sos un consultor de marketing digital inmobiliario de Agencia Web Hispana. " +
      "Tono cercano, profesional y directo. Español neutro para México. " +
      "Nunca prometas resultados garantizados ni menciones precios.";

    const userMsg =
      `Datos del agente:\n` +
      `Nombre: ${lead.nombre || "(sin nombre)"}\n` +
      `Ciudad: ${lead.ciudad || "(sin ciudad)"}\n` +
      `Puntaje: ${score}/${max} — Banda: ${banda}\n` +
      `Respuestas:\n${detalle}\n\n` +
      `Escribí una devolución personalizada de 180–250 palabras que:\n` +
      `1) Salude por su nombre y le diga su banda con empatía (sin humillar).\n` +
      `2) Nombre EXACTAMENTE 3 agujeros concretos derivados de sus respuestas más flojas.\n` +
      `3) Por cada agujero, una frase de qué le está costando en clientes u operaciones.\n` +
      `4) Cierre invitando a agendar una llamada de auditoría gratuita de 15 min por WhatsApp, sin mencionar precio.\n` +
      `Formato: 2–3 párrafos cortos y los 3 agujeros como bullets con "•". Sin markdown pesado.`;

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 700,
        system,
        messages: [{ role: "user", content: userMsg }],
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      console.error("Anthropic error", r.status, t);
      return res.status(200).json({ devolucion: "" });
    }

    const data = await r.json();
    const devolucion = (data.content || []).map((c) => c.text || "").join("").trim();
    return res.status(200).json({ devolucion });
  } catch (err) {
    console.error(err);
    return res.status(200).json({ devolucion: "" });
  }
}
