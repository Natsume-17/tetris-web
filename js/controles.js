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

export function configurarTactil(elemento, manejadores) {
  const UMBRAL_DESLIZAMIENTO = 30; // px mínimos para considerar swipe
  const MOVIMIENTO_MAXIMO_TOQUE = 10; // px máximos para que cuente como «toque» y no swipe
  const RETRASO_DOBLE_TOQUE = 300; // ms de espera para diferenciar toque simple de doble

  let inicioX = 0;
  let inicioY = 0;
  let temporizadorToqueSimple = null;
  let ultimoToqueTimestamp = 0;

  elemento.addEventListener("touchstart", function (evento) {
    const toque = evento.touches[0];
    inicioX = toque.clientX;
    inicioY = toque.clientY;
  });

  elemento.addEventListener("touchend", function (evento) {
    const toque = evento.changedTouches[0];
    const deltaX = toque.clientX - inicioX;
    const deltaY = toque.clientY - inicioY;
    const distancia = Math.hypot(deltaX, deltaY);

    if (distancia < MOVIMIENTO_MAXIMO_TOQUE) {
      // Fue un toque, no un deslizamiento: distinguir simple vs doble
      const ahora = Date.now();
      const esDobleToque = ahora - ultimoToqueTimestamp < RETRASO_DOBLE_TOQUE;
      ultimoToqueTimestamp = ahora;

      if (esDobleToque) {
        clearTimeout(temporizadorToqueSimple);
        manejadores.pausar();
      } else {
        temporizadorToqueSimple = setTimeout(function () {
          manejadores.rotar();
        }, RETRASO_DOBLE_TOQUE);
      }
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Deslizamiento horizontal
      if (deltaX > UMBRAL_DESLIZAMIENTO) {
        manejadores.moverDerecha();
      } else if (deltaX < -UMBRAL_DESLIZAMIENTO) {
        manejadores.moverIzquierda();
      }
    }
  });

  // Evita que el navegador interprete los gestos como scroll/zoom de la página
  elemento.addEventListener(
    "touchmove",
    function (evento) {
      evento.preventDefault();
    },
    { passive: false },
  );
}
