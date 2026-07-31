// Se trae las constantes PIEZAS y COLORES del archivo constantes.js
import { PIEZAS, COLORES } from "./constantes.js";

// Esta función se podrá utilizar en otros módulos gracias a export
export function crearPiezaAleatoria() {
  const tipos = Object.keys(PIEZAS); // ["I", "O", "T", "S", "Z", "J, "L"]
  const tipoElegido = tipos[Math.floor(Math.random() * tipos.length)];

  return {
    tipo: tipoElegido,
    forma: PIEZAS[tipoElegido],
    color: COLORES[tipoElegido],
    fila: 0, // posición inicial superior en el tablero
    columna: 3, // la pieza aparece aproximadamente centrada
  };
}

export function rotarMatriz(matriz) {
  const filas = matriz.length;
  const columnas = matriz[0].length;
  const resultado = [];

  for (let columna = 0; columna < columnas; columna++) {
    const nuevaFila = [];
    for (let fila = filas - 1; fila >= 0; fila--) {
      nuevaFila.push(matriz[fila][columna]);
    }
    resultado.push(nuevaFila);
  }

  return resultado;
}
