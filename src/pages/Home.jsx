// src/pages/Home.jsx
import { useEffect, useRef } from "react";
import { Layout } from "../components/Layout";
import { motion, useReducedMotion } from "motion/react";
import { animate } from "motion";

const Home = () => {
  const prefersReduced = useReducedMotion();

  /* ========= Parallax súper fluido (rAF + lerp) ========= */
  useEffect(() => {
    if (prefersReduced) return;
    const layers = Array.from(document.querySelectorAll("[data-speed]"));
    let currentY = window.scrollY;
    let targetY = currentY;
    let rafId = 0;

    const onScroll = () => (targetY = window.scrollY);
    const loop = () => {
      currentY += (targetY - currentY) * 0.14; // inercia
      for (const el of layers) {
        const speed = parseFloat(el.getAttribute("data-speed") || "0");
        el.style.transform = `translate3d(0, ${currentY * speed}px, 0)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [prefersReduced]);

  /* ========= Scroll al footer de contacto + highlight ========= */
  const handleGoContact = (e) => {
    if (e) e.preventDefault();
    const target = document.querySelector("#contacto") || document.querySelector("footer");
    if (!target) return;

    if (prefersReduced) {
      target.scrollIntoView({ behavior: "instant", block: "start" });
      return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    const focusEl = target.querySelector(".ft-form") || target.querySelector("form") || target;
    focusEl.classList.add("contact-highlight");
    animate(
      focusEl,
      {
        outlineColor: ["transparent", "var(--accent)", "transparent"],
        outlineOffset: [0, 6, 0],
        scale: [1, 1.02, 1],
        filter: ["brightness(1)", "brightness(1.06)", "brightness(1)"],
      },
      { duration: 1.1, easing: "ease-out" }
    ).finished.then(() => focusEl.classList.remove("contact-highlight"));
  };

  /* ========= Typewriter para terminal ========= */
  const typerRef = useRef(null);
  useEffect(() => {
    if (prefersReduced) return;
    const el = typerRef.current;
    if (!el) return;
    const full = el.getAttribute("data-text") || "";
    let i = 0, cancel = false;
    const tick = () => {
      if (cancel) return;
      el.textContent = full.slice(0, i++);
      if (i <= full.length) setTimeout(tick, i < 6 ? 50 : 22);
    };
    tick();
    return () => { cancel = true; };
  }, [prefersReduced]);

  /* ========= Typewriter para “Bienvenido a DancoWeb” ========= */
  const heroTitle = "¡Bienvenido!";
  const heroChars = heroTitle.length;
  const heroRef = useRef(null);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    if (prefersReduced) {
      el.style.setProperty("--hn", heroChars);
      return;
    }
    const controls = animate(
      el,
      { "--hn": [0, heroChars] },
      { duration: 2.2, easing: `steps(${heroChars})`, delay: 0.25 }
    );
    return () => controls?.cancel();
  }, [prefersReduced]);

  const d = prefersReduced ? 0 : 0.6;
  const ease = [0.22, 1, 0.36, 1];

  return (
    <Layout>
      {/* ====== Estilo global del Home (dark-hacking + fondo unificado con degradé) ====== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700;800&display=swap');

        :root{
          --surface: var(--bg);
          --muted: color-mix(in srgb, var(--text) 68%, var(--bg) 32%);
          --edge: color-mix(in srgb, var(--text) 12%, transparent);
          --grid: color-mix(in srgb, var(--accent) 18%, transparent);
          --shadow-xl: 0 30px 90px var(--shadow);
        }

        .page-wrap{
          max-width: 1200px;
          margin-inline: auto;
          padding-inline: 18px;
          position: relative;
          z-index: 1;
        }

        /* Fondo unificado que "mezcla" secciones, no parecen divs separados  */
        .unified-bg{
          position: fixed; inset: 0; z-index: 0; pointer-events:none;
          background:
            radial-gradient(1200px 800px at 10% -10%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 60%),
            radial-gradient(1200px 800px at 90% -15%, color-mix(in srgb, var(--accent2) 12%, transparent), transparent 60%),
            conic-gradient(from 210deg at 50% 20%, color-mix(in srgb, var(--accent) 7%, transparent), transparent 40%, color-mix(in srgb, var(--accent2) 7%, transparent), transparent 78%, color-mix(in srgb, var(--accent) 6%, transparent)),
            linear-gradient(180deg, color-mix(in srgb, var(--bg) 86%, var(--text) 14%), var(--bg));
          mask-image: radial-gradient(1200px 1000px at 50% 0%, #000 55%, transparent 100%);
        }
        .bg-grid{
          position: fixed; inset: 0; z-index: 0; pointer-events:none; opacity:.5;
          background:
            repeating-linear-gradient(0deg,   var(--grid) 0 1px, transparent 1px 34px),
            repeating-linear-gradient(90deg,  var(--grid) 0 1px, transparent 1px 34px);
          mask-image: radial-gradient(1200px 900px at 50% -10%, rgba(255,255,255,.12), transparent 60%);
        }

        /* HERO “dark hacking” */
        .hero.is-neo{
          position:relative; overflow:hidden;
          border: 1px solid var(--edge); border-radius: 22px;
          background: color-mix(in srgb, var(--panel-glass) 70%, transparent);
          box-shadow: var(--shadow-xl);
          backdrop-filter: blur(6px);
        }
        .scanline{ position:absolute; left:0; right:0; height:2px; top:-2px;
          background: linear-gradient(90deg, transparent, var(--accent2), transparent);
          filter: blur(.6px); opacity:.35; animation: scan 8s linear infinite; will-change: transform;
        }
        @keyframes scan{ 0%{ transform:translateY(-2px) } 100%{ transform:translateY(120vh) } }

        /* Lluvia minimalista */
        .rain, .rain2{
          position:absolute; inset:0; pointer-events:none; opacity:.08;
          mask-image: linear-gradient(180deg, transparent, black 15% 85%, transparent);
          will-change: background-position;
        }
        .rain{
          background-image: repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 96px, var(--accent2) 96px 98px);
          background-size: 3px 120px; animation: rainA 9s linear infinite;
        }
        .rain2{
          background-image: repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 72px, var(--accent) 72px 73px);
          background-size: 2px 140px; animation: rainB 12s linear infinite; opacity:.06;
        }
        @keyframes rainA{ from{ background-position:0 -120px } to{ background-position:0 100% } }
        @keyframes rainB{ from{ background-position:0 -140px } to{ background-position:0 100% } }

        /* Heading con glitch sutil */
        .glitch{
          position:relative; display:inline-block;
          text-shadow: -1px 0 color-mix(in srgb, var(--accent) 70%, transparent),
                       1px 0 color-mix(in srgb, var(--accent2) 70%, transparent);
        }
        .glitch::before, .glitch::after{
          content: attr(data-text); position:absolute; left:0; top:0; width:100%;
          mix-blend-mode: screen; pointer-events:none; opacity:.85;
        }
        .glitch::before{ color: color-mix(in srgb, var(--accent) 80%, var(--text)); transform: translate(1px, -1px) }
        .glitch::after{ color: color-mix(in srgb, var(--accent2) 80%, var(--text)); transform: translate(-1px, 1px) }

        .brand-sub{ color: var(--muted) }

        /* Sección “fluida”: sin bloques duros, degrade y mascaras para mezclarse con el fondo */
        .section-flow{
          position: relative; margin-top: 3rem; padding: 2.2rem 1.2rem;
          border-radius: 18px; overflow: hidden;
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--panel-glass) 70%, transparent), transparent 70%),
            radial-gradient(1000px 350px at 85% -10%, color-mix(in srgb, var(--accent2) 10%, transparent), transparent 70%),
            radial-gradient(1000px 350px at 10% -15%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%);
          border: 1px solid var(--edge);
          backdrop-filter: blur(6px);
        }
        .section-flow::before{
          content:""; position:absolute; inset:0; pointer-events:none;
          background: conic-gradient(from 220deg at 50% 0%, rgba(255,255,255,.14), rgba(255,255,255,0) 45%, rgba(255,255,255,.16) 60%, rgba(255,255,255,0) 90%);
          mix-blend-mode: screen; opacity:.35;
          mask-image: linear-gradient(180deg, transparent, #000 10% 90%, transparent);
        }

        /* Stack 3D para tarjetas raras (UX/funcional) */
        .scene-3d{ perspective: 1200px; transform-style: preserve-3d; }

        /* Tarjeta rara/extraña pero profesional */
        .card-weird{
          position:relative; border-radius: 16px; overflow:hidden;
          border:1px solid var(--edge);
          background: linear-gradient(160deg, color-mix(in srgb, var(--accent) 6%, transparent), transparent 55%),
                      color-mix(in srgb, var(--panel-glass) 70%, transparent);
          box-shadow: 0 22px 64px var(--shadow);
          transform-style: preserve-3d;
          will-change: transform, filter;
          transition: filter .2s ease;
        }
        .card-weird::before{
          content:""; position:absolute; inset:-40%;
          background: radial-gradient(closest-side, rgba(255,255,255,.18), rgba(255,255,255,0));
          transform: translate3d(0,0,80px) rotate(0deg);
          animation: orbit 8s linear infinite;
          mix-blend-mode: screen; opacity:.35; pointer-events:none;
        }
        @keyframes orbit{ to{ transform: translate3d(0,0,80px) rotate(360deg) } }
        .card-weird:hover{ filter: saturate(1.05) }

        /* Terminal */
        .terminal{
          background: radial-gradient(900px 400px at 80% -20%, color-mix(in srgb, var(--accent2) 14%, transparent), transparent),
                      color-mix(in srgb, var(--bg) 92%, var(--text) 8%);
          border:1px solid var(--edge);
          border-radius:14px; padding: 1rem 1.1rem; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
          color: var(--text); position:relative; overflow:hidden;
          box-shadow: 0 18px 50px var(--shadow);
        }
        .terminal .dot{ width:.7rem; height:.7rem; border-radius:50%; }
        .cursor{
          display:inline-block; width:.62ch; height:1em; vertical-align:-2px;
          background: var(--accent2); box-shadow: 0 0 12px var(--accent2);
          animation: blink 1.05s steps(2,end) infinite;
        }
        @keyframes blink{ 50%{ opacity:0 } }

        .chip{
          display:inline-flex; align-items:center; gap:.5rem;
          padding:.42rem .7rem; border-radius:999px; font-size:.9rem; font-weight:700;
          background: color-mix(in srgb, var(--accent) 8%, transparent);
          border:1px solid var(--edge); color: var(--text);
        }
        .chip i{ width:.55rem; height:.55rem; border-radius:50%; background: var(--accent); display:inline-block; }

        .btn-accent{
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          color: var(--bg); border:none; font-weight:800;
          box-shadow: 0 16px 44px color-mix(in srgb, var(--accent) 40%, transparent);
          transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
        }
        .btn-accent:hover{ transform: translateY(-2px); filter:saturate(1.06) }
        .btn-ghost{
          background: color-mix(in srgb, var(--panel-glass) 60%, transparent);
          color: var(--text); border: 1px solid var(--edge);
          transition: transform .15s ease, border-color .15s ease, filter .15s ease;
        }
        .btn-ghost:hover{ transform: translateY(-2px); border-color: var(--accent) }

        .brand-sub{ color: var(--muted) }
        .contact-highlight{ outline: 2px solid transparent; border-radius: 16px; }

        /* ====== SALUDO: contenedor centrado y typewriter que no sobrepasa ====== */
        .greet-wrap{
          position: relative;
          margin-inline: auto;
          width: min(96vw, 1100px);
          max-width: 100%;
          box-sizing: border-box;
          justify-content: center;
          text-align: center;
          padding: clamp(1rem, 5vw, 5rem) clamp(1.2rem, 7vw, 8rem);
          border: none !important;
          overflow: hidden;
          backdrop-filter: blur(6px);
        }
        .greet-wrap::after{
          content:"";
          position:absolute; inset:0; pointer-events:none;
          background: linear-gradient(90deg, transparent 0, rgba(255,255,255,.16) 50%, transparent 100%);
          mix-blend-mode: screen;
          width: 40%;
          left:-40%;
          animation: greetSweep 3.2s ease-in-out infinite;
          opacity:.35;
        }
        @keyframes greetSweep{
          0%{ transform: skewX(-12deg) translateX(0) }
          60%{ transform: skewX(-12deg) translateX(320%) }
          100%{ transform: skewX(-12deg) translateX(320%) }
        }

        /* Typewriter: revela por ancho en ch pero limitado a 100% */
        /* Permite que el contenedor del texto+caret pueda achicarse en flex */
.greet-wrap > div{ min-width: 0; }

/* Typewriter responsive que NO sobrepasa el pill */
.hero-greet{
  --ls: .04em;                /* mismo letter-spacing del diseño */
  --safety: .9ch;             /* reserva para caret + gap (ajusta en mobile) */

  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-weight: 800;
  line-height: 1.52;
  font-size: clamp(2rem, 5vw, 5rem);
  letter-spacing: var(--ls);
  text-shadow: 0 2px 20px color-mix(in srgb, var(--accent) 40%, transparent);
  white-space: nowrap;
  display: inline-block;

  /* ancho = texto (1ch por char + spacing) limitado a (100% - reserva) */
  width: clamp(0px,
               calc(var(--hn, 0) * 1ch + (var(--hn, 0) - 1) * var(--ls)),
               calc(100% - var(--safety)));
  max-width: 100%;
  padding-right: .9ch;       /* pequeño colchón interno */
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  will-change: width;
}

/* brillo de barrido */
.hero-greet::after{
  content:"";
  position:absolute; top:0; bottom:0; left:-15%;
  width: 15%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
  mix-blend-mode: screen;
  animation: greetShine 2.8s linear infinite;
  opacity:.45;
}
@keyframes greetShine{
  0%{ transform: translateX(0) }
  100%{ transform: translateX(700%) }
}

/* Caret: no empuja el texto y mantiene el ritmo */
.caret-hero{
  margin-left: .25ch;         /* separa del último carácter */
  display:inline-block; width:.08em; height:1em;
  vertical-align:-.08em;
  background: var(--text);
  box-shadow: 0 0 12px color-mix(in srgb, var(--accent2) 65%, transparent);
  border-radius:2px;
  animation: blink 1s steps(2,end) infinite;
  flex: 0 0 auto;
}

/* Mobile: ajusta tracking y reserva para encajar perfecto */
@media (max-width: 520px){
  .hero-greet{
    --ls: .025em;
    --safety: .7ch;
    font-size: clamp(1.3rem, 5.2vw, 2rem);
  }
  .greet-wrap{ padding: .9rem 1.1rem; gap:.5rem; }
}

/* Respeta preferencias de movimiento */
@media (prefers-reduced-motion: reduce){
  .scanline, .rain, .rain2, .greet-wrap::after, .hero-greet::after{ animation: none !important }
  [data-speed]{ transform:none !important }
}


          /* Subir el saludo dentro del héroe (solo esto) */
.hero.is-neo .hero-body{
  padding-top: clamp(7rem, 6vh, 2rem);     /* ↑ menos aire arriba */
  padding-bottom: clamp(7rem, 5vh, 1.2rem);/* ↓ un poco menos abajo para equilibrar 
  marginTop: "clamp(-.5rem, -2vh, -1.25rem)"*/
}

.services-unified{
  position:relative;
  width:100%;
  padding: clamp(4rem,8vw,6rem) clamp(1rem,5vw,3rem);
  text-align:center;
  overflow:hidden;
}
.services-unified::before{
  content:"";
  position:absolute; inset:0; z-index:-1;
  background: radial-gradient(60% 40% at 50% 0%, color-mix(in srgb,var(--accent) 10%,transparent),transparent 70%),
              linear-gradient(180deg, color-mix(in srgb,var(--bg) 90%,transparent), transparent 100%);
}
.service-tilt{
  border-radius:18px;
  border:1px solid var(--edge);
  background: color-mix(in srgb,var(--panel-glass) 75%,transparent);
  backdrop-filter: blur(6px);
  transition: transform .2s ease, box-shadow .2s ease;
}
.service-tilt:hover{
  box-shadow:0 28px 90px color-mix(in srgb,var(--accent2) 40%,transparent);
}




      `}</style>

      {/* Fondo unificado global */}
      <div className="unified-bg" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />

      {/* ===== CONTENEDOR ===== */}
      <div className="page-wrap">

        {/* ===== HERO FULL-BLEED ===== */}
<motion.section
  id="hero"
  className="hero-unified"
  initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: d, ease }}
  data-speed="-0.05"
>
  <div className="scanline" />
  <div className="rain" />
  <div className="rain2" />

  <div className="hero-body has-text-centered">
    {/* Bienvenido + caret */}
    <motion.div
      className="greet-wrap"
      initial={{ opacity: 0, y: prefersReduced ? 0 : 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: d, ease, delay: 0.02 }}
    >
      <span
        aria-hidden="true"
        style={{
          width: ".55rem",
          height: ".55rem",
          borderRadius: "45%",
          background: "radial-gradient(circle at 30% 30%, #fff, var(--accent) 45%, transparent 70%)",
          boxShadow: "0 0 16px var(--accent2)",
          flex: "0 0 auto",
        }}
      />
      <div style={{ display: "inline-flex", alignItems: "center", gap: ".18em", whiteSpace: "nowrap", maxWidth: "100%", overflow: "hidden" }}>
        <motion.span ref={heroRef} className="hero-greet" style={{ ["--hn"]: 0 }}>
          {heroTitle}
        </motion.span>
        {!prefersReduced && (
          <motion.span
            className="caret-hero"
            aria-hidden="true"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>
    </motion.div>

    {/* Subtítulo principal */}
    <motion.h1
      className="title glitch mt-4"
      data-text="Desarrollamos tus ideas y las hacemos tu web."
      initial={{ opacity: 0, y: prefersReduced ? 0 : 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: d, ease, delay: 0.08 }}
      style={{
        fontSize: "clamp(1.6rem, 4.5vw, 3rem)",
        fontWeight: 800,
        lineHeight: 1.2,
        background: "linear-gradient(90deg, var(--text), color-mix(in srgb,var(--accent) 16%, var(--text)) 40%, var(--text))",
        WebkitBackgroundClip: "text",
        color: "transparent",
        textShadow: "0 6px 30px color-mix(in srgb, var(--accent) 26%, transparent)",
      }}
    >
      Desarrollamos tus ideas y las hacemos tu web.
    </motion.h1>

    {/* Texto debajo */}
    <motion.p
      className="subtitle brand-sub mt-2"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: d, delay: 0.14 }}
      style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
    >
      En Danco Web, tu visión es nuestra misión. Performance real, código limpio y respeto por tu tema.
    </motion.p>

    {/* Botones */}
    <motion.div
      style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 18 }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: d, delay: 0.22 }}
    >
      <motion.a
        href="#servicios"
        className="button is-rounded btn-accent"
        whileHover={prefersReduced ? undefined : { y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Ver servicios
      </motion.a>
      <motion.a
        href="#contacto"
        onClick={handleGoContact}
        className="button is-rounded btn-ghost"
        whileHover={prefersReduced ? undefined : { y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        Contacto
      </motion.a>
    </motion.div>

    {/* Chips */}
    <motion.div
      style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: d, delay: 0.3 }}
    >
      {["Core Web Vitals", "SEO Técnico", "UI metalizada", "Accesibilidad"].map((t, i) => (
        <motion.span
          key={t}
          className="chip"
          initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: d, delay: 0.32 + i * 0.06 }}
        >
          <i /> {t}
        </motion.span>
      ))}
    </motion.div>
  </div>
</motion.section>


        {/* ===== SERVICIOS FULL-BLEED ===== */}
<section id="servicios" className="services-unified">
  <div className="scanline" />
  <div className="rain" />
  <div className="rain2" />

  <header className="has-text-centered" style={{ marginBottom: "2rem" }}>
    <motion.h2
      className="title is-1 glitch"
      data-text="Servicios de alto impacto"
      initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: d, ease }}
    >
      Servicios de alto impacto
    </motion.h2>
    <p className="subtitle is-4" style={{ color: "var(--muted)" }}>
      Diseño, desarrollo y growth — con estética metalizada y DX impecable.
    </p>
  </header>

  <div className="columns is-variable is-6 is-multiline">
    {[
      {
        t: "Diseño UX/UI",
        d: "Sistemas de diseño, prototipos de alta fidelidad y contraste AA.",
        b: ["Design System", "Prototipado", "Accesibilidad AA"],
      },
      {
        t: "Desarrollo Full-Stack",
        d: "Front veloz + APIs robustas. Seguridad, testing y CI/CD.",
        b: ["SPA/SSR", "APIs REST/DB", "CI/CD + Observabilidad"],
        hl: true,
      },
      {
        t: "SEO & Growth",
        d: "Arquitectura semántica, CWV y experimentación para crecer.",
        b: ["Core Web Vitals", "GTM + Analytics", "Contenido técnico"],
      },
    ].map((card, idx) => (
      <div key={card.t} className="column is-12-mobile is-6-tablet is-4-desktop">
        <motion.article
          className={`service-tilt card-weird p-5`}
          initial={{ opacity: 0, y: prefersReduced ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: d, ease, delay: 0.05 + idx * 0.08 }}
          style={{
            boxShadow: card.hl
              ? "0 24px 70px color-mix(in srgb, var(--accent) 35%, transparent)"
              : "0 14px 40px var(--shadow)",
          }}
        >
          <h3 className="title is-4">{card.t}</h3>
          <p className="mb-3" style={{ color: "var(--muted)" }}>{card.d}</p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem 0", display: "grid", gap: ".45rem" }}>
            {card.b.map((x) => (
              <li key={x} style={{ display: "flex", gap: ".55rem", alignItems: "center", color: "var(--muted)" }}>
                <span style={{
                  width: ".5rem", height: ".5rem", borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                  boxShadow: "0 0 8px var(--accent)"
                }} />
                {x}
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: ".6rem" }}>
            <a href="#contacto" onClick={handleGoContact} className="button is-rounded btn-accent is-small">Empezar</a>
            <a href="#contacto" onClick={handleGoContact} className="button is-rounded btn-ghost is-small">Consultar</a>
          </div>
        </motion.article>
      </div>
    ))}
  </div>
</section>


        {/* ===== TERMINAL DEMO ===== */}
        <section className="section-flow" style={{ background: "linear-gradient(180deg, color-mix(in srgb, var(--panel-glass) 70%, transparent), transparent 60%)" }}>
          <div className="columns is-variable is-6 is-vcentered">
            <div className="column is-6">
              <motion.h3
                className="title is-3"
                initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: d }}
              >
                Pipeline técnico claro
              </motion.h3>
              <p className="subtitle is-5" style={{ color: "var(--muted)" }}>
                Del diseño a producción con CI/CD, métricas y accesibilidad automatizada.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                {["Lighthouse 95+", "A11y AA", "Latency baja", "SEO técnico"].map((t, i) => (
                  <motion.span
                    key={t}
                    className="chip"
                    initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: d, delay: 0.08 + i * 0.05 }}
                  >
                    <i /> {t}
                  </motion.span>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <a href="#contacto" onClick={handleGoContact} className="button is-rounded btn-accent">Hablemos</a>
              </div>
            </div>

            <div className="column is-6">
              <motion.div
                className="terminal"
                initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: d, ease }}
              >
                <div style={{ display:"flex", gap:".6rem", alignItems:"center", marginBottom: "0.75rem" }}>
                  <span className="dot" style={{ background: "#ff5f56" }} />
                  <span className="dot" style={{ background: "#ffbd2e" }} />
                  <span className="dot" style={{ background: "#27c93f" }} />
                </div>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  <code>
{`$ npx create-dancoweb
✔ Generando stack (Bulma + Motion + A11y)...
✔ Configurando CI/CD y análisis CWV...
✔ Desplegando preview...`}
                  </code>
                </pre>
                <div style={{ marginTop: 8 }}>
                  <span style={{ color: "var(--accent2)" }}>&gt;</span>{" "}
                  <span ref={typerRef} data-text="ready: proyecto optimizado y metalizado ⚡" />
                  <span className="cursor" aria-hidden="true" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== PROYECTOS (otra tanda de tarjetas “raras”) ===== */}
        <section className="section-flow">
          <header className="has-text-centered" style={{ marginBottom: "1.1rem" }}>
            <motion.h3
              className="title is-3"
              initial={{ opacity: 0, y: prefersReduced ? 0 : 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: d }}
            >
              Proyectos recientes
            </motion.h3>
          </header>

          <div className="scene-3d">
            <div className="columns is-multiline is-variable is-5">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="column is-12-mobile is-6-tablet is-4-desktop">
                  <motion.article
                    className="card-weird p-5"
                    initial={{ opacity: 0, y: prefersReduced ? 0 : 16, rotateX: prefersReduced ? 0 : 12 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: d, ease, delay: 0.04 + (i * 0.02) }}
                    whileHover={
                      prefersReduced ? undefined
                      : { y: -10, rotateX: -8, rotateY: 8, scale: 1.01, transition: { type: "spring", stiffness: 140, damping: 16 } }
                    }
                    onViewportEnter={(entry) => {
                      if (prefersReduced) return;
                      animate(entry.target, { rotateX: [0, 360, 0] }, { duration: 1.2, easing: "cubic-bezier(.22,1,.36,1)" });
                    }}
                  >
                    <p className="title is-5">Proyecto {i}</p>
                    <p style={{ color: "var(--muted)" }}>
                      Landing + design system. CWV alto y SEO técnico.
                    </p>
                  </motion.article>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA FINAL ===== */}
        <section className="section-flow has-text-centered">
          <motion.h3
            className="title is-3"
            initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: d }}
          >
            ¿Listo para construir algo grande?
          </motion.h3>
          <motion.p
            className="subtitle is-5"
            style={{ color: "var(--muted)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: d, delay: 0.06 }}
          >
            Contanos tu idea y te proponemos una solución clara, escalable y con look metalizado.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: d, delay: 0.1 }}
            style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 10 }}
          >
            <a href="#contacto" onClick={handleGoContact} className="button is-large is-rounded btn-accent">Empezar ahora</a>
            <a href="#contacto" onClick={handleGoContact} className="button is-large is-rounded btn-ghost">Charlar 15'</a>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
};

export { Home }; 
