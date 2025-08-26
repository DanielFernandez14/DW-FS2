import { useState, useEffect, useRef, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import "bulma/css/bulma.min.css";
import { animate } from "motion"; // Animaciones suaves

const Layout = (props) => {
  const { children } = props;
  const [open, setOpen] = useState(false);
  const [themePref, setThemePref] = useState(() => {
    return localStorage.getItem("themePref") || "system"; // "light" | "dark" | "system"
  });

  // ===== Flecha "Subir" =====
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Refs para animaciones
  const burgerRef = useRef(null);
  const menuRef = useRef(null);
  const overlayRef = useRef(null);

  const prefersReduced = useMemo(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
    []
  );

  // Aplica el tema efectivo segun preferencia y sistema
  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: light)");

    const apply = (pref) => {
      let effective = pref;
      if (pref === "system") effective = mq.matches ? "light" : "dark";
      root.dataset.theme = effective; // "light" | "dark"
    };

    apply(themePref);
    localStorage.setItem("themePref", themePref);

    const onChange = () => {
      if (themePref === "system") apply("system");
    };
    mq.addEventListener?.("change", onChange);

    return () => {
      mq.removeEventListener?.("change", onChange);
    };
  }, [themePref]);

  // Cerrar menú si pasamos a desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => { if (e.matches) setOpen(false); };
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // Animaciones al abrir/cerrar (mobile)
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (!isMobile) return;
    const dur = prefersReduced ? 0 : 0.42;

    if (menuRef.current) {
      animate(
        menuRef.current,
        open
          ? { opacity: [0, 1], transform: ["translateY(-8px)", "translateY(0)"] }
          : { opacity: [1, 0], transform: ["translateY(0)", "translateY(-8px)"] },
        { duration: dur, easing: "cubic-bezier(.22,.61,.36,1)" }
      );
    }
    if (overlayRef.current) {
      animate(
        overlayRef.current,
        { opacity: open ? 1 : 0 },
        { duration: dur, easing: "cubic-bezier(.22,.61,.36,1)" }
      );
    }
  }, [open, prefersReduced]);

  const onBurgerClick = () => {
    if (!prefersReduced && burgerRef.current) {
      animate(burgerRef.current, { filter: ["blur(0px)", "blur(2px)", "blur(0px)"] }, { duration: 0.35, easing: "ease-out" });
    }
    setOpen((v) => !v);
  };

  return (
    <>
      {/* Temas + ajustes para navbar fija */}
      <style>{`
        :root{
          /* DARK */
          --bg:#0b1220;
          --text:#eaf2ff;
          --accent:#4ea8ff;
          --accent2:#82c7ff;
          --grid-strong: rgba(143,208,255,0.5);
          --panel-glass: rgba(255,255,255,.06);
          --panel-stroke: rgba(255,255,255,.18);
          --footer-stroke: rgba(255,255,255,.10);
          --shadow: rgba(0,0,0,.25);
          --ring: var(--accent);
          --ring-hover: var(--accent2);
          --nav-bg: rgba(10,16,28,.65); /* leve glass en dark */
          --nav-border: rgba(255,255,255,.12);
          --nav-text: var(--text);
          --seg-bg: rgba(255,255,255,.06);
          --seg-stroke: rgba(255,255,255,.18);
          --seg-active: #0f1b33;
          --seg-text: var(--text);
          --nav-height: 64px;      /* alto aprox de la navbar en desktop */
          --nav-offset: 76px;      /* padding-top del main para evitar solapamiento */
          --overlay: rgba(7,10,20,.45);
        }

        html[data-theme="light"]{
          /* LIGHT */
          --bg:#f6f8fc;
          --text:#0b1220;
          --accent:#165dff;
          --accent2:#33a3ff;
          --grid-strong: rgba(22,93,255,0.18);
          --panel-glass: rgba(0,0,0,.06);
          --panel-stroke: rgba(0,0,0,.16);
          --footer-stroke: rgba(0,0,0,.10);
          --shadow: rgba(0,0,0,.15);
          --ring: var(--accent);
          --ring-hover: var(--accent2);
          --nav-bg: rgba(255,255,255,.65);
          --nav-border: rgba(0,0,0,.08);
          --nav-text: var(--text);
          --seg-bg: rgba(0,0,0,.06);
          --seg-stroke: rgba(0,0,0,.12);
          --seg-active: #e9eefb;
          --seg-text: var(--text);
          --nav-height: 64px;
          --nav-offset: 76px;
          --overlay: rgba(0,10,30,.35);
        }

        html, body{
          color: var(--text);
          min-height: 100%;
          background-color: var(--bg);
          background-image:
            repeating-linear-gradient(0deg,   var(--grid-strong) 0 2px, transparent 2px 50px),
            repeating-linear-gradient(90deg,  var(--grid-strong) 0 2px, transparent 2px 50px);
          background-attachment: fixed;
        }

        /* Navbar fija arriba */
        .navbar.is-fixed-top{
          position: fixed;
          top: 0; left: 0; right: 0;
          background: var(--nav-bg) !important;
          box-shadow: 0 8px 24px var(--shadow);
          border-bottom: 1px solid var(--nav-border);
          backdrop-filter: saturate(1.1) blur(6px);
          z-index: 40;
        }
        .navbar .navbar-item, .navbar .navbar-link { color: var(--nav-text) !important; }
        .navbar .navbar-item.is-active::after{
          content:""; position:absolute; left:1rem; right:1rem; bottom:.4rem; height:2px; border-radius:2px;
          background: linear-gradient(90deg,var(--accent),var(--accent2));
        }

        /* Ajuste de espacio del contenido para no quedar debajo de la navbar fija */
        .app-main{
          padding-top: var(--nav-offset);
        }

        .panel {
          background: var(--panel-glass);
          border: 1px solid var(--panel-stroke);
          border-radius: 14px;
          backdrop-filter: blur(6px);
          box-shadow: 0 16px 48px var(--shadow);
        }
        .footer { background: transparent; border-top: 1px solid var(--footer-stroke); }

        /* Segment control (navbar end) */
        .theme-seg{
          display:inline-flex; align-items:center; gap:0;
          border:1px solid var(--seg-stroke);
          border-radius:999px; overflow:hidden;
          background: var(--seg-bg);
        }
        .theme-seg button{
          appearance:none; background:transparent; border:0; color:var(--seg-text);
          padding:.38rem .7rem; font-weight:700; line-height:1; cursor:pointer;
          transition: background .15s ease, transform .15s ease;
        }
        .theme-seg button[aria-pressed="true"]{
          background: var(--seg-active);
        }
        .theme-seg button:hover{ transform: translateY(-1px); }
        .theme-seg .sep{ width:1px; height:20px; background: var(--seg-stroke); }

        /* ===== Logo (dentro de .navbar-item) ===== */
        .brand-logo{
          display:flex; align-items:center; justify-content:center;
          padding: .5rem;
        }
        .navbar .navbar-item.brand-logo img{
          display:block;
          height:64px !important;       /* tamaño grande en desktop */
          width:auto !important;         /* mantiene proporción */
          max-height:none !important;    /* anula límite de Bulma */
          object-fit:contain;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,.25));
          transition: transform .15s ease, filter .25s ease;
        }
        .navbar .navbar-item.brand-logo:hover img{
          transform: translateY(-1px);
          filter: drop-shadow(0 4px 10px rgba(0,0,0,.28));
        }

        @media (max-width: 1023px){
          :root, html[data-theme="light"]{
            --nav-offset: 84px; /* un pelín más en mobile por el alto del menú */
          }
          .navbar .navbar-item.brand-logo img{
            height:56px !important; /* ligeramente menor en mobile */
          }

          /* mover hamburguesa a la derecha */
          .navbar-brand{ display:flex; align-items:center; width:100%; }
          .navbar-burger{ margin-left:auto; }
          .navbar-brand .brand-logo{ margin-right:auto; }
        }

        /* En desktop, ocultamos hamburguesa/overlay (el menú ya se muestra) */
        @media (min-width: 1024px){
          .navbar-burger{ display:none !important; }
          .nav-overlay{ display:none !important; }
        }

        /* ===== Estilos de hamburguesa (con morph a X) ===== */
        .navbar-burger{
          position: relative;
          width: 48px; height: 48px;
          margin: .5rem .75rem .5rem 0;
          display:grid; place-items:center;
          border-radius: 12px;
          border: 1px solid transparent;
          transition: border-color .2s ease, background .2s ease, transform .2s ease, filter .2s ease;
          background: transparent;
        }
        .navbar-burger:hover{
          border-color: var(--panel-stroke);
          background: color-mix(in srgb, var(--panel-glass) 60%, transparent);
          transform: translateY(-1px);
        }
        .navbar-burger:focus-visible{ outline:2px solid var(--ring); outline-offset:2px; }
        .navbar-burger span{
          position:absolute; left:12px; right:12px; height:2px; border-radius:2px; background: var(--nav-text);
          transition: transform .28s cubic-bezier(.2,.6,.2,1), opacity .2s ease, width .2s ease, top .28s ease;
          transform-origin:center;
        }
        .navbar-burger span:nth-child(1){ top:16px; }
        .navbar-burger span:nth-child(2){ top:23px; }
        .navbar-burger span:nth-child(3){ top:30px; }

        /* Brillo sutil en hover de las líneas */
        .navbar-burger:hover span{
          background: linear-gradient(90deg, color-mix(in srgb, var(--nav-text) 85%, transparent), var(--accent));
          background-size:200% 100%;
          animation: lineShine .6s ease both;
        }
        @keyframes lineShine{ 0%{background-position:0% 0;} 100%{background-position:100% 0;} }

        /* Activo -> X centrada */
        .navbar-burger.is-active span:nth-child(1){ top:23px; transform: rotate(45deg); }
        .navbar-burger.is-active span:nth-child(2){ opacity:0; transform: scaleX(.4); }
        .navbar-burger.is-active span:nth-child(3){ top:23px; transform: rotate(-45deg); }

        /* ===== Overlay con blur (animado vía Motion) ===== */
        .nav-overlay{
          position: fixed; inset: 0;
          background: var(--overlay);
          backdrop-filter: blur(2px);
          opacity: 0; /* animada */
          pointer-events: none; /* activamos solo cuando open */
          z-index: 35;
        }
        .nav-overlay.is-active{ pointer-events: auto; }

        /* ===== Botón “Subir” ===== */
        .to-top{
          position: fixed; right:18px; bottom:18px; width:48px; height:48px; border-radius:14px;
          display:grid; place-items:center; cursor:pointer; z-index:70;
          background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #fff;
          border:1px solid color-mix(in srgb, var(--accent) 45%, transparent);
          box-shadow:0 14px 40px color-mix(in srgb, var(--accent) 36%, transparent);
          transform: translateY(18px) scale(.92); opacity:0;
          transition: transform .2s ease, opacity .2s ease, filter .15s ease;
        }
        .to-top.is-visible{ transform: translateY(0) scale(1); opacity:1; }
        .to-top:hover{ filter:saturate(1.05) brightness(1.02); transform: translateY(-2px) scale(1.02); }
        .to-top:focus-visible{ outline:2px solid var(--ring-hover); outline-offset:3px; }
      `}</style>

      {/* Overlay con blur (cierra al click) */}
      <div
        ref={overlayRef}
        className={`nav-overlay ${open ? "is-active" : ""}`}
        aria-hidden={open ? "false" : "true"}
        onClick={() => setOpen(false)}
      />

      {/* HEADER */}
      <header>
        <nav className="navbar is-transparent is-fixed-top" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item brand-logo" onClick={() => setOpen(false)} aria-label="Ir al inicio">
              <img src="/Logo/Logo Pro 3d.png" alt="DancoWeb" />
            </Link>

            <a
              ref={burgerRef}
              role="button"
              className={`navbar-burger ${open ? "is-active" : ""}`}
              aria-label="Abrir menú"
              aria-expanded={open ? "true" : "false"}
              onClick={onBurgerClick}
              title={open ? "Cerrar" : "Menú"}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div ref={menuRef} className={`navbar-menu ${open ? "is-active" : ""}`}>
            <div className="navbar-start">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `navbar-item ${isActive ? "is-active" : ""}`}
                onClick={() => setOpen(false)}
              >
                Home
              </NavLink>

              <NavLink
                to="/admin"
                className={({ isActive }) => `navbar-item ${isActive ? "is-active" : ""}`}
                onClick={() => setOpen(false)}
              >
                Dashboard
              </NavLink>
            </div>

            {/* NAVBAR RIGHT: switcher de tema */}
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="theme-seg" role="tablist" aria-label="Selector de tema">
                  <button
                    role="tab"
                    aria-label="Tema claro"
                    aria-pressed={themePref === "light"}
                    onClick={() => setThemePref("light")}
                    title="Claro (☀️)"
                  >
                    ☀️
                  </button>
                  <span className="sep" aria-hidden="true"></span>
                  <button
                    role="tab"
                    aria-label="Usar tema del sistema"
                    aria-pressed={themePref === "system"}
                    onClick={() => setThemePref("system")}
                    title="Sistema (🖥️)"
                  >
                    🖥️
                  </button>
                  <span className="sep" aria-hidden="true"></span>
                  <button
                    role="tab"
                    aria-label="Tema oscuro"
                    aria-pressed={themePref === "dark"}
                    onClick={() => setThemePref("dark")}
                    title="Oscuro (🌙)"
                  >
                    🌙
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* MAIN (con offset para navbar fija) */}
      <main className="section app-main">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <style>{`
          /* Estilo del footer con soporte claro/oscuro */
          .footer{
            background: transparent;
            border-top: 1px solid var(--footer-stroke);
            padding-top: 3rem;
            padding-bottom: 3rem;
          }
          .ft-title{ color: var(--text); font-weight: 800; font-size: 1.25rem; }
          .ft-text{ color: var(--muted); }
          .ft-link{ color: var(--text); text-decoration: none; border-bottom: 1px dotted var(--panel-stroke); }
          .ft-link:hover{ color: var(--accent); border-color: var(--accent); }

          /* Caja del formulario */
          .ft-form.box{
            background: var(--panel-glass);
            border: 1px solid var(--panel-stroke);
            box-shadow: 0 18px 50px var(--shadow);
            border-radius: 16px;
          }

          /* Inputs Bulma con variables del tema */
          .ft-form .input,
          .ft-form .textarea{
            background: color-mix(in srgb, var(--bg) 78%, var(--text) 22%);
            border: 1px solid var(--panel-stroke);
            color: var(--text);
          }
          .ft-form .input::placeholder,
          .ft-form .textarea::placeholder{ color: var(--muted); }
          .ft-form .label{ color: var(--text); font-weight: 700; }

          /* Botón primario con tu acento */
          .ft-submit{
            background: linear-gradient(135deg, var(--accent), var(--accent2));
            color: var(--bg);
            border: none;
            font-weight: 800;
            transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
            box-shadow: 0 14px 32px color-mix(in srgb, var(--accent) 35%, transparent);
          }
          .ft-submit:hover{ transform: translateY(-2px); filter: saturate(1.05); }

          /* Redes */
          .ft-social{ display:flex; gap:.75rem; margin-top:.75rem; }
          .ft-social a{
            display:grid; place-items:center; width:38px; height:38px; border-radius:10px;
            background: var(--panel-glass);
            border:1px solid var(--panel-stroke);
            color: var(--text);
            transition: transform .15s ease, border-color .15s ease, color .15s ease;
          }
          .ft-social a:hover{
            transform: translateY(-2px);
            border-color: var(--accent);
            color: var(--accent);
          }

          .ft-bottom{ border-top:1px solid var(--footer-stroke); margin-top:2rem; padding-top:1.25rem; color: var(--muted); }
        `}</style>

        <div className="container">
          <div className="columns is-variable is-7">
            {/* Columna: Marca / Contacto / Redes */}
            <div className="column is-5">
              <h3 className="ft-title">DancoWeb</h3>
              <p className="ft-text">
                Creamos sitios rápidos, accesibles y listos para crecer. Contanos tu idea y lo hacemos realidad.
              </p>

              <div className="mt-4">
                <p className="ft-text">
                  <strong>Correo:</strong>{" "}
                  <a className="ft-link" href="mailto:hola@dancoweb.com">hola@dancoweb.com</a>
                </p>
                <p className="ft-text">
                  <strong>Tel:</strong>{" "}
                  <a className="ft-link" href="tel:+549000000000">+54 9 00 0000-0000</a>
                </p>
              </div>

              {/* Redes sociales (SVG inline accesibles) */}
              <div className="ft-social" aria-label="Redes sociales">
                <a href="#" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M4.98 3.5a2.5 2.5 0 11-.02 5.001 2.5 2.5 0 01.02-5zM3 9h4v12H3zM14.5 9c-2.14 0-3.5 1.17-3.5 3.14V21h4v-6.3c0-1.17.66-1.9 1.71-1.9 1.02 0 1.79.7 1.79 1.94V21H22v-6.86C22 11.16 20.42 9 17.9 9c-1.27 0-2.3.54-2.9 1.37V9h-.5z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm0 2a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm5.25-.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z"/>
                  </svg>
                </a>
                <a href="#" aria-label="X (Twitter)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M3 4l7.13 8.3L3.5 20h2.2l5.3-5.72L15.7 20H21l-7.3-8.5L20.5 4h-2.2l-4.86 5.26L8.3 4H3z"/>
                  </svg>
                </a>
                <a href="#" aria-label="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.2-3.37-1.2-.46-1.16-1.12-1.47-1.12-1.47-.92-.62.07-.6.07-.6 1.02.08 1.56 1.06 1.56 1.06.9 1.55 2.36 1.1 2.94.84.09-.66.35-1.1.64-1.35-2.22-.25-4.55-1.11-4.55-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .85-.27 2.79 1.02A9.7 9.7 0 0112 6.8c.86 0 1.72.12 2.52.35 1.94-1.29 2.79-1.02 2.79-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.68 0 3.83-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0012 2z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Columna: Formulario de contacto */}
            <div className="column is-7">
              <form className="box ft-form" onSubmit={(e) => e.preventDefault()} noValidate>
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label" htmlFor="fName">Nombre</label>
                      <div className="control">
                        <input className="input" id="fName" name="name" type="text" placeholder="Tu nombre" required />
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label" htmlFor="fEmail">Email</label>
                      <div className="control">
                        <input className="input" id="fEmail" name="email" type="email" placeholder="tu@email.com" required />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="fMsg">Mensaje</label>
                  <div className="control">
                    <textarea className="textarea" id="fMsg" name="message" rows={4} placeholder="Contanos tu idea…" required />
                  </div>
                </div>

                <div className="field is-grouped is-justify-content-flex-end">
                  <div className="control">
                    <button type="submit" className="button is-rounded ft-submit">Enviar</button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Bottom line */}
          <div className="ft-bottom has-text-centered">
            <p>© {new Date().getFullYear()} DancoWeb — Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Botón "Subir" */}
      <button
        type="button"
        className={`to-top ${showTop ? "is-visible" : ""}`}
        aria-label="Subir al inicio"
        title="Subir"
        onClick={goTop}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M5 15l1.41 1.41L11 11.83V20h2v-8.17l4.59 4.58L19 15l-7-7-7 7z"/>
        </svg>
      </button>
    </>
  );
};

export { Layout };
