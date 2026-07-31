const CLAVE_ALMACENAMIENTO = "tetris-record";

export function obtenerRecord() {
  const valorGuardado = localStorage.getItem(CLAVE_ALMACENAMIENTO);
  return valorGuardado ? parseInt(valorGuardado, 10) : 0;
}

export function guardarRecordSiSupera(puntuacion) {
  const recordActual = obtenerRecord();

  if (puntuacion > recordActual) {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, puntuacion);
    return true; // indica que hubo un nuevo récord
  }

  return false;
}
