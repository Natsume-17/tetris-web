const CLAVE_ALMACENAMIENTO = "tetris-idioma";

const TRADUCCIONES = {
  es: {
    titulo: "Tetris",
    record: "Récord",
    etiquetaDificultad: "Dificultad",
    dificultadFacil: "Fácil",
    dificultadNormal: "Normal",
    dificultadDificil: "Difícil",
    etiquetaControles: "Controles",
    controlIzquierda: "Mover izquierda",
    controlDerecha: "Mover derecha",
    controlRotar: "Rotar",
    controlPausar: "Pausar",
    controlReiniciar: "Reiniciar",
    botonJugar: "Jugar",
    siguientePieza: "Siguiente pieza",
    puntuacion: "Puntuación",
    nivel: "Nivel",
    tituloGameOver: "Fin del juego",
    textoGameOver: "Pulsa {tecla} para reiniciar",
    tituloPausa: "Pausa",
    textoPausa: "Pulsa {tecla} para continuar",
    temaOscuro: "🌙 Modo oscuro",
    temaClaro: "☀️ Modo claro",
    tituloEspacio: "Espacio",
  },
  en: {
    titulo: "Tetris",
    record: "High score",
    etiquetaDificultad: "Difficulty",
    dificultadFacil: "Easy",
    dificultadNormal: "Normal",
    dificultadDificil: "Hard",
    etiquetaControles: "Controls",
    controlIzquierda: "Move left",
    controlDerecha: "Move right",
    controlRotar: "Rotate",
    controlPausar: "Pause",
    controlReiniciar: "Restart",
    botonJugar: "Play",
    siguientePieza: "Next piece",
    puntuacion: "Score",
    nivel: "Level",
    tituloGameOver: "Game Over",
    textoGameOver: "Press {tecla} to restart",
    tituloPausa: "Paused",
    textoPausa: "Press {tecla} to continue",
    temaOscuro: "🌙 Dark mode",
    temaClaro: "☀️ Light mode",
    tituloEspacio: "Space",
  },
};

export function obtenerIdioma() {
  return localStorage.getItem(CLAVE_ALMACENAMIENTO) || "es";
}

export function guardarIdioma(idioma) {
  localStorage.setItem(CLAVE_ALMACENAMIENTO, idioma);
}

export function traducir(clave, idioma) {
  return TRADUCCIONES[idioma][clave];
}

export function aplicarIdiomaATextosFijos(idioma) {
  // Recorremos todos los elementos marcados con data-i18n y
  // sustituimos su contenido por la traduccion correspondiente
  document.querySelectorAll("[data-i18n]").forEach(function (elemento) {
    const clave = elemento.getAttribute("data-i18n");
    elemento.textContent = traducir(clave, idioma);
  });
}

export function traducirConTecla(clave, idioma, tecla) {
  const texto = traducir(clave, idioma);
  return texto.replace(
    "{tecla}",
    tecla === " " ? (idioma === "es" ? "Espacio" : "Space") : tecla,
  );
}
