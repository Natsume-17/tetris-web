let manejadorTecladoActual = null;

export function configurarTeclado(controles, manejadores) {
  if (manejadorTecladoActual) {
    document.removeEventListener("keydown", manejadorTecladoActual);
  }

  manejadorTecladoActual = function (evento) {
    if (evento.key === controles.moverIzquierda) {
      manejadores.moverIzquierda();
    } else if (evento.key === controles.moverDerecha) {
      manejadores.moverDerecha();
    } else if (evento.key === controles.rotar) {
      manejadores.rotar();
    } else if (evento.key === controles.pausar) {
      manejadores.pausar();
    } else if (evento.key === controles.reiniciar) {
      manejadores.reiniciar();
    }
  };

  document.addEventListener("keydown", manejadorTecladoActual);
}

export function configurarBotonJugar(boton, alPulsar) {
  boton.addEventListener("click", alPulsar);
}
