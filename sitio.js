// Nexo Almacén — página de presentación
// 1) El acta de la portada se llena sola una vez al cargar.
// 2) El recorrido de un equipo: pestañas que van armando la hoja de vida del serial.

(function () {
  "use strict";

  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------------------------------------------------------
  // Número de WhatsApp: se cambia aquí y aplica a todos los botones
  // ---------------------------------------------------------
  const WHATSAPP = "573000000000";
  const MENSAJE = "Hola, quiero ver una demostración de Nexo Almacén.";
  document.querySelectorAll(".js-whatsapp").forEach(function (a) {
    a.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(MENSAJE);
  });

  // ---------------------------------------------------------
  // Acta de la portada
  // ---------------------------------------------------------
  const escena = document.querySelector(".acta-escena");
  const repetir = document.getElementById("repetir");

  if (escena && !sinMovimiento) {
    const filas = escena.querySelectorAll(".acta-fila");
    const trazos = escena.querySelectorAll(".trazo");
    const sello = escena.querySelector(".sello");
    const aviso = document.getElementById("stock-aviso");
    let tiempos = [];

    function en(ms, fn) { tiempos.push(setTimeout(fn, ms)); }

    function reproducir() {
      tiempos.forEach(clearTimeout);
      tiempos = [];
      repetir.hidden = true;

      escena.classList.add("anima");
      escena.querySelectorAll(".visible").forEach(function (el) { el.classList.remove("visible"); });
      // fuerza a que el navegador aplique el estado inicial antes de animar
      void escena.offsetWidth;

      filas.forEach(function (fila, i) {
        en(500 + i * 380, function () { fila.classList.add("visible"); });
      });
      const finFilas = 500 + filas.length * 380;
      en(finFilas + 200, function () { trazos[0].classList.add("visible"); });
      en(finFilas + 1300, function () { trazos[1].classList.add("visible"); });
      en(finFilas + 2500, function () { sello.classList.add("visible"); });
      en(finFilas + 3000, function () { aviso.classList.add("visible"); });
      en(finFilas + 3800, function () { repetir.hidden = false; });
    }

    repetir.addEventListener("click", reproducir);
    reproducir();
  }

  // ---------------------------------------------------------
  // Recorrido de un equipo
  // ---------------------------------------------------------
  const pestanas = Array.from(document.querySelectorAll(".pasos [role=tab]"));
  const panel = document.getElementById("p-recorrido");
  const textos = document.querySelectorAll(".paso-texto");
  const eventos = document.querySelectorAll(".hoja-eventos li");
  const ubicacion = document.getElementById("hoja-ubicacion");
  const punto = document.querySelector(".hoja-estado-punto");

  const UBICACIONES = [
    { texto: "Disponible en Sede Bogotá", color: "" },
    { texto: "Disponible en Sede Cali", color: "" },
    { texto: "Instalada en la obra Torres del Valle", color: "var(--viga)" },
    { texto: "Disponible de nuevo en Sede Cali", color: "" }
  ];

  function mostrarPaso(n, enfocar) {
    pestanas.forEach(function (tab, i) {
      const activa = i === n;
      tab.setAttribute("aria-selected", activa);
      tab.tabIndex = activa ? 0 : -1;
      tab.classList.toggle("hecho", i < n);
      if (activa && enfocar) tab.focus();
    });
    panel.setAttribute("aria-labelledby", pestanas[n].id);

    textos.forEach(function (t) { t.hidden = Number(t.dataset.paso) !== n; });
    eventos.forEach(function (li) {
      const paso = Number(li.dataset.paso);
      li.classList.toggle("futuro", paso > n);
      li.classList.toggle("actual", paso === n);
    });

    ubicacion.textContent = UBICACIONES[n].texto;
    punto.style.background = UBICACIONES[n].color;
  }

  pestanas.forEach(function (tab, i) {
    tab.addEventListener("click", function () { mostrarPaso(i, false); });
    // Flechas del teclado para moverse entre pestañas
    tab.addEventListener("keydown", function (e) {
      let destino = null;
      if (e.key === "ArrowRight") destino = (i + 1) % pestanas.length;
      if (e.key === "ArrowLeft") destino = (i - 1 + pestanas.length) % pestanas.length;
      if (e.key === "Home") destino = 0;
      if (e.key === "End") destino = pestanas.length - 1;
      if (destino !== null) { e.preventDefault(); mostrarPaso(destino, true); }
    });
  });

  if (pestanas.length) mostrarPaso(0, false);
})();
