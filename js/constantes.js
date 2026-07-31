// export permite utilizar las constantes en otro módulos (archivos JS)
// --- Configuración del tablero ---
export const COLUMNAS = 10;
export const FILAS = 20;
export const TAMANO_CELDA = 30; // píxeles por celda (300 / 10 = 30, 600 / 20 = 30)
export const TAMANO_CELDA_PREVIEW = 20; // hasta 4 columnas/filas, 4 x 20 = 80px

// --- Definición de piezas (tetrominós) ---
// Cada pieza es una matriz de 0 y 1. El 1 indica una celda ocupada
export const PIEZAS = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

// Color asociado a cada pieza (convención clásica de Tetris)
export const COLORES = {
  I: "#5fd4d4",
  O: "#e8e070",
  T: "#b57ae8",
  S: "#6fd88a",
  Z: "#e87878",
  J: "#7a9de8",
  L: "#e8a860",
};
