import { traducir, obtenerIdioma } from "./i18n.js";

const CLAVE_ALMACENAMIENTO = "tetris-tema";
let manejadorClicActual = null;

export function inicializarTema(botones) {
  const temaGuardado = localStorage.getItem(CLAVE_ALMACENAMIENTO);

  if (temaGuardado === "claro") {
    aplicarTemaClaro(botones);
  } else {
    aplicarTemaOscuro(botones);
  }

  botones.forEach(function (boton) {
    if (manejadorClicActual) {
      boton.removeEventListener("click", manejadorClicActual);
    }
  });

  manejadorClicActual = function () {
    const esClaroActualmente = document.body.classList.contains("tema-claro");
    if (esClaroActualmente) {
      aplicarTemaOscuro(botones);
    } else {
      aplicarTemaClaro(botones);
    }
  };

  botones.forEach(function (boton) {
    boton.addEventListener("click", manejadorClicActual);
  });
}

function aplicarTemaClaro(botones) {
  document.body.classList.add("tema-claro");
  const texto = traducir("temaClaro", obtenerIdioma());
  botones.forEach(function (boton) {
    boton.textContent = texto;
  });
  localStorage.setItem(CLAVE_ALMACENAMIENTO, "claro");
}

function aplicarTemaOscuro(botones) {
  document.body.classList.remove("tema-claro");
  const texto = traducir("temaOscuro", obtenerIdioma());
  botones.forEach(function (boton) {
    boton.textContent = texto;
  });
  localStorage.setItem(CLAVE_ALMACENAMIENTO, "oscuro");
}
