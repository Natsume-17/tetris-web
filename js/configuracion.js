const CLAVE_DIFICULTAD = "tetris-dificultad";

export const DIFICULTADES = {
  facil: { etiqueta: "Fácil", velocidadInicial: 700 },
  normal: { etiqueta: "Normal", velocidadInicial: 500 },
  dificil: { etiqueta: "Difícil", velocidadInicial: 300 },
};

export function obtenerDificultad() {
  const guardada = localStorage.getItem(CLAVE_DIFICULTAD);
  return DIFICULTADES[guardada] ? guardada : "normal";
}

export function guardarDificultad(clave) {
  localStorage.setItem(CLAVE_DIFICULTAD, clave);
}
