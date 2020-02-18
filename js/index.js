const vidas = document.getElementById('tableroVidas');

const celeste = document.getElementById('celeste');
const violeta = document.getElementById('violeta');
const naranja = document.getElementById('naranja');
const verde = document.getElementById('verde');
const btnEmpezar = document.getElementById('btnEmpezar');
const ULTIMO_NIVEL = 10;

class Juego {
  constructor() {
    this.elegirColor = this.elegirColor.bind(this);
    this.iluminarSecuencia = this.iluminarSecuencia.bind(this);

    this.tableroNivel = document.getElementById('tableroNivel');
    this.estadoNivel = document.getElementById('estadoNivel');

    this.visibleTableroNivel();
    this.crearTableroVidas();

    this.vidas = vidas;

    this.inicializar();
    this.generarSecuencia();

    setTimeout(this.siguieteNivel, 500);
  }

  inicializar() {
    this.toggleBtnEmpezar();
    this.siguieteNivel = this.siguieteNivel.bind(this);
    this.nivel = 1;
    this.estadoNivel.textContent = this.nivel;
    this.colores = {
      celeste,
      violeta,
      naranja,
      verde
    };
  }

  toggleBtnEmpezar() {
    if (btnEmpezar.classList.contains('hide')) {
      btnEmpezar.classList.remove('hide');
    } else {
      btnEmpezar.classList.add('hide');
    }
  }

  generarSecuencia() {
    this.secuencia = new Array(ULTIMO_NIVEL)
      .fill(0)
      .map(n => Math.floor(Math.random() * 4));
  }

  siguieteNivel() {
    this.subnivel = 0;
    this.estadoNivel.textContent = this.nivel;
    this.iluminarSecuencia();
    this.agregarEventosClick();
  }

  transformarNumeroAColor(numero) {
    const colores = {
      0: 'celeste',
      1: 'violeta',
      2: 'naranja',
      3: 'verde'
    };

    for (const index in colores) {
      if (parseInt(index) === numero) {
        return colores[index];
      }
    }
  }

  transformarColorANumero(colorTransformar) {
    const colores = {
      celeste: 0,
      violeta: 1,
      naranja: 2,
      verde: 3
    };

    for (const color in colores) {
      if (color === colorTransformar) {
        return colores[color];
      }
    }
  }

  iluminarSecuencia() {
    for (let i = 0; i < this.nivel; i++) {
      const color = this.transformarNumeroAColor(this.secuencia[i]);
      setTimeout(() => this.iluminarColor(color), 1000 * i);
    }
  }

  iluminarColor(color) {
    this.colores[color].classList.add('light');
    setTimeout(() => this.apagarColor(color), 350);
  }

  apagarColor(color) {
    this.colores[color].classList.remove('light');
  }

  agregarEventosClick() {
    for (const color in this.colores) {
      this.colores[color].addEventListener('click', this.elegirColor);
    }
  }

  eliminarEventosClick() {
    for (const color in this.colores) {
      this.colores[color].removeEventListener('click', this.elegirColor);
    }
  }

  elegirColor(ev) {
    const nombreColor = ev.target.dataset.color;
    const numeroColor = this.transformarColorANumero(nombreColor);
    this.iluminarColor(nombreColor);

    if (numeroColor === this.secuencia[this.subnivel]) {
      this.subnivel++;
      if (this.subnivel === this.nivel) {
        this.nivel++;
        this.eliminarEventosClick();

        if (this.nivel === ULTIMO_NIVEL + 1) {
          this.ganoElJuego();
        } else {
          setTimeout(this.siguieteNivel, 1500);
        }
      }
    } else {
      this.perdioElJuego();
    }
  }
  ganoElJuego() {
    alert('Felicitaciones ganaste el juego');
    swal('Felicitaciones ganaste el juego').then(() => this.inicializar());
  }

  perdioElJuego() {
    this.eliminarVida();
    const vidasActuales = this.cantidadVidas();

    if (vidasActuales > 0) {
      swal('Vuelva a intentarlo', 'Dar click en el botón!', 'info').then(() =>
        setTimeout(this.iluminarSecuencia, 400)
      );
    } else {
      swal('Lo lamentamos, perdiste', 'Da click en el botón', 'error').then(
        () => {
          this.ocultarTableroNivel();
          this.eliminarEventosClick();
          this.inicializar();
        }
      );
    }
  }

  crearTableroVidas() {
    const TOTAL_VIDAS = 3;
    const corazon = document.createElement('img');
    corazon.src = './imagenes/corazon.png';
    corazon.className = 'oportunidades';
    corazon.alt = 'Corazón';

    for (let i = 0; i < TOTAL_VIDAS; i++) {
      vidas.insertAdjacentHTML('afterbegin', corazon.outerHTML);
    }
  }

  visibleTableroNivel() {
    this.tableroNivel.style.visibility = 'visible';
  }

  ocultarTableroNivel() {
    this.tableroNivel.style.visibility = 'hidden';
  }

  eliminarVida() {
    this.vidas.children[0].remove();
  }

  cantidadVidas() {
    return this.vidas.children.length;
  }
}

function empezarJuego() {
  let juego = new Juego();
}
