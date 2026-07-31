const CLAVE_ALMACENAMIENTO = "tetris-controles";

export const TECLAS_DISPONIBLES = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "a",
  "d",
  "w",
  "s",
  "p",
  "r",
  " ",
];

export const CONTROLES_POR_DEFECTO = {
  moverIzquierda: "ArrowLeft",
  moverDerecha: "ArrowRight",
  rotar: "ArrowUp",
  pausar: "p",
  reiniciar: "r",
};

export function obtenerControles() {
  const guardado = localStorage.getItem(CLAVE_ALMACENAMIENTO);
  return guardado ? JSON.parse(guardado) : { ...CONTROLES_POR_DEFECTO };
}

export function guardarControles(controles) {
  localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(controles));
}
