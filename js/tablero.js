// Se trae las constantes FILAS y COLUMNAS del archivo constantes.js
import { FILAS, COLUMNAS } from "./constantes.js";

// Esta función se podrá utilizar en otros módulos gracias a export
export function crearTableroVacio() {
  // Se encapsula la creación del tablero para optimizar con la llamada a la función
  const tablero = [];
  for (let fila = 0; fila < FILAS; fila++) {
    tablero.push(new Array(COLUMNAS).fill(null));
  }
  return tablero;
}

export function hayColision(tablero, pieza, filaSiguiente) {
  for (let fila = 0; fila < pieza.forma.length; fila++) {
    for (let columna = 0; columna < pieza.forma[fila].length; columna++) {
      if (pieza.forma[fila][columna] === 1) {
        const filaTablero = filaSiguiente + fila;
        const columnaTablero = pieza.columna + columna;

        // Colisión con el fondo del tablero
        if (filaTablero >= FILAS) {
          return true;
        }

        // Colisión con una celda ya ocupada del tablero
        if (tablero[filaTablero][columnaTablero] !== null) {
          return true;
        }
      }
    }
  }
  return false;
}

export function hayColisionHorizontal(tablero, pieza, columnaSiguiente) {
  for (let fila = 0; fila < pieza.forma.length; fila++) {
    for (let columna = 0; columna < pieza.forma[fila].length; columna++) {
      if (pieza.forma[fila][columna] === 1) {
        const filaTablero = pieza.fila + fila;
        const columnaTablero = columnaSiguiente + columna;

        // Fuera de los límites laterales del tablero
        if (columnaTablero < 0 || columnaTablero >= COLUMNAS) {
          return true;
        }

        // Colisión con una celda ya ocupada
        if (tablero[filaTablero][columnaTablero] !== null) {
          return true;
        }
      }
    }
  }
  return false;
}

export function fijarPieza(tablero, pieza) {
  for (let fila = 0; fila < pieza.forma.length; fila++) {
    for (let columna = 0; columna < pieza.forma[fila].length; columna++) {
      if (pieza.forma[fila][columna] === 1) {
        const filaTablero = pieza.fila + fila;
        const columnaTablero = pieza.columna + columna;
        tablero[filaTablero][columnaTablero] = pieza.color;
      }
    }
  }
}

function filaCompleta(tablero, fila) {
  // every() comprueba que TODAS las celdas de la fila cumplan la condición
  return tablero[fila].every(function (celda) {
    return celda !== null;
  });
}

export function obtenerLineasCompletas(tablero) {
  const filasCompletas = [];

  for (let fila = 0; fila < FILAS; fila++) {
    if (filaCompleta(tablero, fila)) {
      filasCompletas.push(fila);
    }
  }

  return filasCompletas;
}

export function eliminarFilas(tablero, filas) {
  // Nos quedamos solo con las filas que NO están en la lista a eliminar
  const filasRestantes = tablero.filter(function (fila, indice) {
    return !filas.includes(indice);
  });

  // Añadimos al principio tantas filas vacías como hayamos eliminado
  for (let i = 0; i < filas.length; i++) {
    filasRestantes.unshift(new Array(COLUMNAS).fill(null));
  }

  // Sustituimos el contenido del array original en el sitio,
  // para que la referencia 'tablero' que usa main.js siga siendo válida
  tablero.length = 0;
  filasRestantes.forEach(function (fila) {
    tablero.push(fila);
  });
}
