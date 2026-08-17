// ===== Test inmobiliario — Agencia Web Hispana =====
const WA_NUMBER = "541169053310"; // WhatsApp destino (sin +)

const QUESTIONS = [
  { q: "¿Tenés una página web propia como agente?", o: [
    ["No, ninguna", 0],
    ["Solo mi perfil en un portal (Inmuebles24, Vivanuncios…)", 1],
    ["Sí, una web básica pero no capta clientes", 2],
    ["Sí, web profesional que capta interesados", 3] ] },
  { q: "¿Cómo te encuentran hoy la mayoría de tus clientes?", o: [
    ["Solo por referidos / boca a boca", 1],
    ["Por los portales inmobiliarios", 1],
    ["Por mis redes sociales", 2],
    ["Me buscan por mi nombre / marca", 3] ] },
  { q: "¿Con qué frecuencia publicás en Instagram?", o: [
    ["No tengo o está abandonado", 0],
    ["Esporádico, cuando me acuerdo", 1],
    ["1–2 veces por semana", 2],
    ["Casi a diario y con estrategia", 3] ] },
  { q: "¿Tu perfil deja claro en 3 segundos quién sos, tu zona y qué ofrecés?", o: [
    ["No, es genérico", 0],
    ["Más o menos", 1],
    ["Sí, totalmente claro", 3] ] },
  { q: "¿Capturás los datos de los interesados (no solo esperar el DM)?", o: [
    ["No capturo nada", 0],
    ["Solo por mensaje directo", 1],
    ["Tengo formulario de contacto", 2],
    ["Tengo un sistema de captación (lead magnet / CRM)", 3] ] },
  { q: "¿Usás video / reels mostrando propiedades y tu cara?", o: [
    ["Nunca", 0],
    ["A veces", 1],
    ["Seguido y con intención", 3] ] },
  { q: "¿Tenés un proceso para seguir a los que consultaron y no cerraron?", o: [
    ["No, se pierden", 0],
    ["A mano, cuando puedo", 1],
    ["Sí, sistematizado", 3] ] },
];
const MAX = 21;

const app = document.getElementById("app");
const state = { i: 0, answers: [], lead: null };

function band(score){
  if(score <= 7) return { key:"red",  cls:"b-red",    label:"Presencia que espanta 🔴" };
  if(score <= 14) return { key:"yellow", cls:"b-yellow", label:"Presencia tibia 🟡" };
  return { key:"green", cls:"b-green", label:"Presencia que vende 🟢" };
}

function renderIntro(){
  app.innerHTML = `
    <div class="intro">
      <h1>¿Tu presencia digital vende o espanta clientes?</h1>
      <p>Respondé 7 preguntas (2 minutos) y recibí un diagnóstico personalizado con los 3 cambios que más te van a mover la aguja.</p>
      <button class="btn btn-yellow btn-lg" id="start">Empezar el test →</button>
    </div>`;
  document.getElementById("start").onclick = () => { state.i=0; state.answers=[]; renderQuestion(); };
}

function renderQuestion(){
  const item = QUESTIONS[state.i];
  const frac = state.i / QUESTIONS.length;
  app.innerHTML = `
    <div class="panel">
      <div class="progress"><i style="transform:scaleX(${frac})"></i></div>
      <div class="qnum">PREGUNTA ${state.i+1} DE ${QUESTIONS.length}</div>
      <div class="qtext">${item.q}</div>
      <div class="opts">
        ${item.o.map((o,idx)=>`<button class="opt" data-pts="${o[1]}" data-idx="${idx}">${o[0]}</button>`).join("")}
      </div>
    </div>`;
  app.querySelectorAll(".opt").forEach(btn=>{
    btn.onclick = () => {
      state.answers.push({ q:item.q, a:item.o[+btn.dataset.idx][0], pts:+btn.dataset.pts });
      state.i++;
      if(state.i < QUESTIONS.length) renderQuestion(); else renderCapture();
    };
  });
}

function renderCapture(){
  app.innerHTML = `
    <div class="panel">
      <div class="progress"><i style="transform:scaleX(1)"></i></div>
      <div class="qtext">¡Listo! ¿A dónde te enviamos tu diagnóstico?</div>
      <form id="lead">
        <div class="field"><label>Nombre</label><input name="nombre" required placeholder="Tu nombre"></div>
        <div class="field"><label>WhatsApp</label><input name="whatsapp" required inputmode="tel" placeholder="Ej: +52 55 1234 5678"></div>
        <div class="field"><label>Email</label><input name="email" type="email" required placeholder="tucorreo@ejemplo.com"></div>
        <div class="field"><label>Ciudad / Zona</label><input name="ciudad" placeholder="Ej: CDMX, Guadalajara…"></div>
        <button class="btn btn-yellow btn-lg" type="submit" style="width:100%">Ver mi resultado →</button>
        <p class="small">Recibirás tu diagnóstico al instante. No compartimos tus datos.</p>
      </form>
    </div>`;
  document.getElementById("lead").onsubmit = (e)=>{
    e.preventDefault();
    const f = new FormData(e.target);
    state.lead = Object.fromEntries(f.entries());
    renderResult();
  };
}

async function renderResult(){
  const score = state.answers.reduce((s,a)=>s+a.pts,0);
  const b = band(score);
  app.innerHTML = `
    <div class="panel result">
      <span class="badge ${b.cls}">${b.label}</span>
      <div class="qtext">Tu presencia digital: ${score}/${MAX}</div>
      <div class="spin"></div>
      <p class="small">Generando tu diagnóstico personalizado…</p>
    </div>`;

  let devo = "";
  try{
    const r = await fetch("/api/devolucion", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ score, max:MAX, banda:b.label, lead:state.lead, answers:state.answers })
    });
    if(!r.ok) throw new Error("api");
    const data = await r.json();
    devo = data.devolucion || "";
  }catch(err){
    devo = fallbackDevo(b.key, state.lead?.nombre);
  }
  if(!devo) devo = fallbackDevo(b.key, state.lead?.nombre);

  const waMsg = encodeURIComponent(`Hola Fernando, hice el test y quiero mi llamada de auditoría gratis. Mi resultado fue: ${b.label}`);
  app.innerHTML = `
    <div class="panel result">
      <span class="badge ${b.cls}">${b.label}</span>
      <div class="qtext">Tu presencia digital: ${score}/${MAX}</div>
      <div class="devo">${devo.replace(/</g,"&lt;")}</div>
      <a class="btn btn-wa btn-lg" style="width:100%;justify-content:center" href="https://wa.me/${WA_NUMBER}?text=${waMsg}">📲 Quiero mi llamada de auditoría gratis (15 min)</a>
      <a class="back" href="/">← Volver al inicio</a>
    </div>`;
}

function fallbackDevo(key, nombre){
  const n = nombre ? `${nombre}, ` : "";
  if(key==="red") return `${n}hoy sos prácticamente invisible online y dependés casi 100% de los referidos. Eso te pone un techo: solo te encuentran los que ya te conocen.\n\n• No tenés una web propia que te posicione como profesional.\n• Tu perfil no comunica con claridad quién sos ni tu zona.\n• No capturás los datos de los interesados, así que se pierden.\n\nLa buena noticia: son tres cambios muy concretos y rápidos de resolver. Agendá tu llamada de auditoría gratis y te muestro por dónde empezar.`;
  if(key==="yellow") return `${n}ya tenés presencia, pero no te está convirtiendo en consultas. Tenés atención que no se transforma en clientes: dejás plata sobre la mesa.\n\n• Publicás sin una estrategia que lleve a la acción.\n• Falta un sistema para capturar y seguir a los interesados.\n• Tu web/redes todavía no trabajan en piloto automático para vos.\n\nCon ajustes puntuales de conversión, lo que ya hacés puede rendir el doble. Agendá tu llamada de auditoría gratis y lo vemos juntos.`;
  return `${n}tenés una base sólida: se nota que trabajás tu presencia. Ahora el foco es escalar y automatizar para que trabaje por vos sin depender de tu tiempo.\n\n• Optimizar la conversión de tu web y perfil.\n• Sistematizar la captación y el seguimiento.\n• Escalar tu contenido para sostener el flujo de clientes.\n\nEstás a pocos ajustes de una máquina de captación. Agendá tu llamada de auditoría gratis y armamos el plan.`;
}

renderIntro();
