// Se trae las constantes COLUMNAS, FILAS y TAMANO_CELDA del archivo constantes.js
import {
  COLUMNAS,
  FILAS,
  TAMANO_CELDA,
  TAMANO_CELDA_PREVIEW,
} from "./constantes.js";
import { traducirConTecla, traducir } from "./i18n.js";

// Esta función se podrá utilizar en otros módulos gracias a export
export function limpiarCanvas(contexto, canvas) {
  contexto.clearRect(0, 0, canvas.width, canvas.height);
}

export function dibujarCuadricula(contexto) {
  contexto.strokeStyle = "#4a4a6a"; // un matiz azulado
  contexto.lineWidth = 1;

  for (let columna = 0; columna <= COLUMNAS; columna++) {
    const x = columna * TAMANO_CELDA;
    contexto.beginPath();
    contexto.moveTo(x, 0);
    contexto.lineTo(x, FILAS * TAMANO_CELDA);
    contexto.stroke();
  }

  for (let fila = 0; fila <= FILAS; fila++) {
    const y = fila * TAMANO_CELDA;
    contexto.beginPath();
    contexto.moveTo(0, y);
    contexto.lineTo(COLUMNAS * TAMANO_CELDA, y);
    contexto.stroke();
  }
}

export function dibujarTablero(contexto, tablero) {
  contexto.strokeStyle = "rgba(0, 0, 0, 0.3)";
  contexto.lineWidth = 1;

  for (let fila = 0; fila < FILAS; fila++) {
    for (let columna = 0; columna < COLUMNAS; columna++) {
      const color = tablero[fila][columna];
      if (color !== null) {
        contexto.fillStyle = color;
        const x = columna * TAMANO_CELDA;
        const y = fila * TAMANO_CELDA;
        contexto.fillRect(x, y, TAMANO_CELDA, TAMANO_CELDA);
        contexto.strokeRect(x, y, TAMANO_CELDA, TAMANO_CELDA);
      }
    }
  }
}

export function dibujarPieza(contexto, pieza) {
  contexto.fillStyle = pieza.color;
  contexto.strokeStyle = "rgba(0, 0, 0, 0.3)";
  contexto.lineWidth = 1;

  for (let fila = 0; fila < pieza.forma.length; fila++) {
    for (let columna = 0; columna < pieza.forma[fila].length; columna++) {
      if (pieza.forma[fila][columna] === 1) {
        const x = (pieza.columna + columna) * TAMANO_CELDA;
        const y = (pieza.fila + fila) * TAMANO_CELDA;
        contexto.fillRect(x, y, TAMANO_CELDA, TAMANO_CELDA);
        contexto.strokeRect(x, y, TAMANO_CELDA, TAMANO_CELDA);
      }
    }
  }
}

export function dibujarPiezaSiguiente(
  contextoSiguiente,
  canvasSiguiente,
  piezaSiguiente,
) {
  contextoSiguiente.clearRect(
    0,
    0,
    canvasSiguiente.width,
    canvasSiguiente.height,
  );
  contextoSiguiente.fillStyle = piezaSiguiente.color;
  contextoSiguiente.strokeStyle = "rgba(0, 0, 0, 0.3)";
  contextoSiguiente.lineWidth = 1;

  const forma = piezaSiguiente.forma;
  const filas = forma.length;
  const columnas = forma[0].length;

  // Centramos la pieza calculando el margen sobrante respecto al canvas
  const offsetX = (canvasSiguiente.width - columnas * TAMANO_CELDA_PREVIEW) / 2;
  const offsetY = (canvasSiguiente.height - filas * TAMANO_CELDA_PREVIEW) / 2;

  for (let fila = 0; fila < filas; fila++) {
    for (let columna = 0; columna < columnas; columna++) {
      if (forma[fila][columna] === 1) {
        const x = offsetX + columna * TAMANO_CELDA_PREVIEW;
        const y = offsetY + fila * TAMANO_CELDA_PREVIEW;
        contextoSiguiente.fillRect(
          x,
          y,
          TAMANO_CELDA_PREVIEW,
          TAMANO_CELDA_PREVIEW,
        );
        contextoSiguiente.strokeRect(
          x,
          y,
          TAMANO_CELDA_PREVIEW,
          TAMANO_CELDA_PREVIEW,
        );
      }
    }
  }
}

export function actualizarMarcador(
  textoPuntuacion,
  textoNivel,
  puntuacion,
  nivel,
) {
  textoPuntuacion.textContent = puntuacion;
  textoNivel.textContent = nivel;
}

export function actualizarOverlay(
  overlay,
  overlayTitulo,
  overlayTexto,
  juegoTerminado,
  juegoPausado,
  idioma,
  teclaReiniciar,
  teclaPausar,
  esTactil = false,
) {
  if (juegoTerminado) {
    overlayTitulo.textContent = traducir("tituloGameOver", idioma);
    overlayTexto.textContent = esTactil
      ? traducir("textoGameOverTactil", idioma)
      : traducirConTecla("textoGameOver", idioma, teclaReiniciar);
    overlay.classList.remove("oculto");
  } else if (juegoPausado) {
    overlayTitulo.textContent = traducir("tituloPausa", idioma);
    overlayTexto.textContent = esTactil
      ? traducir("textoPausaTactil", idioma)
      : traducirConTecla("textoPausa", idioma, teclaPausar);
    overlay.classList.remove("oculto");
  } else {
    overlay.classList.add("oculto");
  }
}

export function dibujarFilasDestacadas(contexto, filas) {
  contexto.fillStyle = "#ffffff";
  filas.forEach(function (fila) {
    contexto.fillRect(
      0,
      fila * TAMANO_CELDA,
      COLUMNAS * TAMANO_CELDA,
      TAMANO_CELDA,
    );
  });
}
