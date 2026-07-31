import { crearPiezaAleatoria, rotarMatriz } from "./piezas.js";
import {
  crearTableroVacio,
  hayColision,
  hayColisionHorizontal,
  fijarPieza,
  obtenerLineasCompletas,
  eliminarFilas,
} from "./tablero.js";
import {
  limpiarCanvas,
  dibujarCuadricula,
  dibujarTablero,
  dibujarPieza,
  dibujarPiezaSiguiente,
  dibujarFilasDestacadas,
  actualizarMarcador,
  actualizarOverlay,
} from "./render.js";
import { configurarTeclado, configurarBotonJugar } from "./controles.js";
import { inicializarTema } from "./tema.js";
import { obtenerRecord, guardarRecordSiSupera } from "./record.js";
import {
  obtenerDificultad,
  guardarDificultad,
  DIFICULTADES,
} from "./configuracion.js";
import {
  obtenerControles,
  guardarControles,
  TECLAS_DISPONIBLES,
  CONTROLES_POR_DEFECTO,
} from "./controlesConfig.js";
import {
  obtenerIdioma,
  guardarIdioma,
  aplicarIdiomaATextosFijos,
  traducir,
} from "./i18n.js";

// --- Referencias al DOM ---
const canvas = document.getElementById("tablero");
const contexto = canvas.getContext("2d");
const canvasSiguiente = document.getElementById("siguiente");
const contextoSiguiente = canvasSiguiente.getContext("2d");
const textoPuntuacion = document.getElementById("puntuacion-texto");
const textoNivel = document.getElementById("nivel-texto");
const overlayEstado = document.getElementById("overlay-estado");
const overlayTexto = document.getElementById("overlay-texto");
const overlayTitulo = document.getElementById("overlay-titulo");
const menuPrincipal = document.getElementById("menu-principal");
const contenedorJuego = document.getElementById("contenedor-juego");
const botonJugar = document.getElementById("boton-jugar");
const botonesTema = document.querySelectorAll(".boton-tema");
const textoRecordMenu = document.getElementById("record-texto-menu");
const textoRecordPanel = document.getElementById("record-texto-panel");
const selectorDificultad = document.getElementById("selector-dificultad");
const selectIzquierda = document.getElementById("control-izquierda");
const selectDerecha = document.getElementById("control-derecha");
const selectRotar = document.getElementById("control-rotar");
const selectPausar = document.getElementById("control-pausar");
const selectReiniciar = document.getElementById("control-reiniciar");
const botonesIdioma = document.querySelectorAll(".boton-idioma");
const textoDificultad = document.getElementById("dificultad-texto");

// --- Estado del juego ---
let tablero = crearTableroVacio();
let piezaActual = null;
let piezaSiguiente = null;
let puntuacion = 0;
let nivel = 1;
let lineasTotales = 0;
let velocidadCaida = 500;
let velocidadBase = 500;
let intervaloJuego = null;
let juegoPausado = false;
let juegoTerminado = false;
let animandoLineas = false;
let temporizadorRedireccion = null;
let controlesActivos = { ...CONTROLES_POR_DEFECTO };

// --- Lógica de piezas ---
function generarPiezaAleatoria() {
  piezaActual = piezaSiguiente || crearPiezaAleatoria();
  piezaActual.fila = 0;
  piezaActual.columna = 3;

  piezaSiguiente = crearPiezaAleatoria();
  dibujarPiezaSiguiente(contextoSiguiente, canvasSiguiente, piezaSiguiente);

  if (hayColision(tablero, piezaActual, piezaActual.fila)) {
    terminarJuego();
  }
}

function moverPieza(deltaColumna) {
  const nuevaColumna = piezaActual.columna + deltaColumna;
  if (!hayColisionHorizontal(tablero, piezaActual, nuevaColumna)) {
    piezaActual.columna = nuevaColumna;
  }
}

function rotarPieza() {
  const formaRotada = rotarMatriz(piezaActual.forma);
  const piezaConRotacion = { ...piezaActual, forma: formaRotada };

  if (
    !hayColisionHorizontal(tablero, piezaConRotacion, piezaActual.columna) &&
    !hayColision(tablero, piezaConRotacion, piezaActual.fila)
  ) {
    piezaActual.forma = formaRotada;
  }
}

// --- Puntuación y nivel ---
function actualizarPuntuacion(lineasEliminadas) {
  // Puntuación clásica de Tetris: más líneas de golpe dan más puntos por línea
  const puntosPorLinea = [0, 100, 300, 500, 800];
  puntuacion = puntuacion + puntosPorLinea[lineasEliminadas] * nivel;

  lineasTotales = lineasTotales + lineasEliminadas;

  const nivelCalculado = Math.floor(lineasTotales / 10) + 1;
  if (nivelCalculado > nivel) {
    subirNivel(nivelCalculado);
  }
}

function actualizarTextosRecord() {
  const record = obtenerRecord();
  textoRecordMenu.textContent = record;
  textoRecordPanel.textContent = record;
}

function actualizarTextoDificultad() {
  const claveDificultad =
    "dificultad" +
    selectorDificultad.value.charAt(0).toUpperCase() +
    selectorDificultad.value.slice(1);
  textoDificultad.textContent = traducir(claveDificultad, obtenerIdioma());
}

function subirNivel(nuevoNivel) {
  nivel = nuevoNivel;
  velocidadCaida = Math.max(100, velocidadBase - (nivel - 1) * 50);

  clearInterval(intervaloJuego);
  intervaloJuego = setInterval(actualizar, velocidadCaida);
}

// --- Control de estado del juego ---
function alternarPausa() {
  if (juegoTerminado) return;
  juegoPausado = !juegoPausado;
  actualizarMarcador(textoPuntuacion, textoNivel, puntuacion, nivel);
  actualizarOverlay(
    overlayEstado,
    overlayTitulo,
    overlayTexto,
    juegoTerminado,
    juegoPausado,
    obtenerIdioma(),
    controlesActivos.reiniciar,
    controlesActivos.pausar,
  );
}

function terminarJuego() {
  juegoTerminado = true;
  guardarRecordSiSupera(puntuacion);
  actualizarTextosRecord();

  clearInterval(intervaloJuego);

  temporizadorRedireccion = setTimeout(function () {
    contenedorJuego.style.display = "none";
    menuPrincipal.style.display = "flex";
  }, 2000);
}

function reiniciarJuego() {
  resetearEstadoJuego();
  generarPiezaAleatoria();
  actualizar(); // <- dibuja el primer frame inmediatamente, sin esperar al intervalo
  intervaloJuego = setInterval(actualizar, velocidadCaida);
}

function resetearEstadoJuego() {
  tablero = crearTableroVacio();
  piezaActual = null;
  piezaSiguiente = null;
  puntuacion = 0;
  nivel = 1;
  lineasTotales = 0;
  velocidadBase = DIFICULTADES[selectorDificultad.value].velocidadInicial;
  velocidadCaida = velocidadBase;
  juegoPausado = false;
  juegoTerminado = false;

  clearTimeout(temporizadorRedireccion);
  clearInterval(intervaloJuego);
}

// --- Bucle de juego ---
function actualizar() {
  if (juegoPausado || juegoTerminado || animandoLineas) {
    return;
  }

  limpiarCanvas(contexto, canvas);
  dibujarCuadricula(contexto);

  if (hayColision(tablero, piezaActual, piezaActual.fila + 1)) {
    fijarPieza(tablero, piezaActual);

    const lineasCompletas = obtenerLineasCompletas(tablero);
    if (lineasCompletas.length > 0) {
      animarEliminacionLineas(lineasCompletas);
    } else {
      generarPiezaAleatoria();
    }
  } else {
    piezaActual.fila = piezaActual.fila + 1;
  }

  dibujarTablero(contexto, tablero);
  dibujarPieza(contexto, piezaActual);
  actualizarMarcador(textoPuntuacion, textoNivel, puntuacion, nivel);
  actualizarOverlay(
    overlayEstado,
    overlayTitulo,
    overlayTexto,
    juegoTerminado,
    juegoPausado,
    obtenerIdioma(),
    controlesActivos.reiniciar,
    controlesActivos.pausar,
  );
}

function animarEliminacionLineas(filas) {
  animandoLineas = true;

  let parpadeos = 0;
  const totalParpadeos = 4; // 2 encendidos + 2 apagados

  const intervaloParpadeo = setInterval(function () {
    limpiarCanvas(contexto, canvas);
    dibujarCuadricula(contexto);
    dibujarTablero(contexto, tablero);

    // Alternamos: en parpadeos pares mostramos el destello blanco
    if (parpadeos % 2 === 0) {
      dibujarFilasDestacadas(contexto, filas);
    }

    parpadeos++;

    if (parpadeos >= totalParpadeos) {
      clearInterval(intervaloParpadeo);
      eliminarFilas(tablero, filas);
      actualizarPuntuacion(filas.length);
      animandoLineas = false;
      generarPiezaAleatoria();
    }
  }, 100);
}

function iniciarJuego() {
  guardarDificultad(selectorDificultad.value);
  actualizarTextoDificultad();
  resetearEstadoJuego();

  controlesActivos = leerControlesDesdeFormulario();
  guardarControles(controlesActivos);

  configurarTeclado(controlesActivos, {
    moverIzquierda: function () {
      moverPieza(-1);
    },
    moverDerecha: function () {
      moverPieza(1);
    },
    rotar: rotarPieza,
    pausar: alternarPausa,
    reiniciar: reiniciarJuego,
  });

  menuPrincipal.style.display = "none";
  contenedorJuego.style.display = "flex";

  generarPiezaAleatoria();
  actualizar();
  intervaloJuego = setInterval(actualizar, velocidadCaida);
}

// --- Conexión de controles ---
function inicializarSelectoresControles() {
  const controlesGuardados = obtenerControles();
  const idiomaActual = obtenerIdioma();
  const selects = {
    moverIzquierda: selectIzquierda,
    moverDerecha: selectDerecha,
    rotar: selectRotar,
    pausar: selectPausar,
    reiniciar: selectReiniciar,
  };

  Object.keys(selects).forEach(function (accion) {
    const select = selects[accion];
    select.innerHTML = ""; // limpiamos por si se llama más de una vez

    TECLAS_DISPONIBLES.forEach(function (tecla) {
      const opcion = document.createElement("option");
      opcion.value = tecla;
      opcion.textContent =
        tecla === " " ? traducir("tituloEspacio", idiomaActual) : tecla;
      select.appendChild(opcion);
    });

    select.value = controlesGuardados[accion];
  });
}

function leerControlesDesdeFormulario() {
  return {
    moverIzquierda: selectIzquierda.value,
    moverDerecha: selectDerecha.value,
    rotar: selectRotar.value,
    pausar: selectPausar.value,
    reiniciar: selectReiniciar.value,
  };
}

function aplicarIdioma(idioma) {
  guardarIdioma(idioma);
  aplicarIdiomaATextosFijos(idioma);
  inicializarSelectoresControles();
  actualizarTextoDificultad();

  // Refrescamos tambien el texto del boton de tema, en el idioma nuevo
  const esClaroActualmente = document.body.classList.contains("tema-claro");
  inicializarTema(botonesTema); // vuelve a aplicar el tema actual con el texto ya traducido

  actualizarMarcador(textoPuntuacion, textoNivel, puntuacion, nivel);
  actualizarOverlay(
    overlayEstado,
    overlayTitulo,
    overlayTexto,
    juegoTerminado,
    juegoPausado,
    obtenerIdioma(),
    controlesActivos.reiniciar,
    controlesActivos.pausar,
  );

  botonesIdioma.forEach(function (boton) {
    boton.classList.toggle(
      "activo",
      boton.getAttribute("data-idioma") === idioma,
    );
  });
}

botonesIdioma.forEach(function (boton) {
  boton.addEventListener("click", function () {
    aplicarIdioma(boton.getAttribute("data-idioma"));
  });
});

configurarBotonJugar(botonJugar, iniciarJuego);
inicializarTema(botonesTema);
actualizarTextosRecord();
selectorDificultad.value = obtenerDificultad();
inicializarSelectoresControles();
// Aplicar el idioma guardado (o español por defecto) al cargar la pagina
aplicarIdioma(obtenerIdioma());
