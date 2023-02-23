/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos
let palos = ["ova", "cua", "hex", "cir"];
// Array de número de cartas
//let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
let numeros = [10, 11, 12];

// paso (top y left) en pixeles de una carta a la siguiente en un mazo
let paso = 1;
let tapete_origen;

var barajacartas = new Audio('./sounds/barajacartas.mp3');
var bruh = new Audio('./sounds/bruh.mp3');
var victoria = new Audio('./sounds/Bring_Me_The_Horizon_-_Can_You_Feel_My_Heart.mp3');

// Tapetes
let tapete_inicial = document.getElementById("inicial");
let tapete_sobrantes = document.getElementById("sobrantes");
let tapete_receptor1 = document.getElementById("receptor1");
let tapete_receptor2 = document.getElementById("receptor2");
let tapete_receptor3 = document.getElementById("receptor3");
let tapete_receptor4 = document.getElementById("receptor4");

// Mazos
let mazo_inicial = [];
let mazo_sobrantes = [];
let mazo_receptor1 = [];
let mazo_receptor2 = [];
let mazo_receptor3 = [];
let mazo_receptor4 = [];

// Contadores de cartas

let cont_inicial = document.getElementById("contador_inicial");
let cont_sobrantes = document.getElementById("contador_sobrantes");
let cont_receptor1 = document.getElementById("contador_receptor1");
let cont_receptor2 = document.getElementById("contador_receptor2");
let cont_receptor3 = document.getElementById("contador_receptor3");
let cont_receptor4 = document.getElementById("contador_receptor4");
let cont_movimientos = document.getElementById("contador_movimientos");


// Tiempo
let cont_tiempo = document.getElementById("contador_tiempo"); // span cuenta tiempo
let segundos = 0; // cuenta de segundos
let temporizador = null; // manejador del temporizador

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/

// Rutina asociada a boton reset: comenzar_juego
document.getElementById("resetBoton").onclick = comenzar_juego;

// El juego arranca ya al cargar la página: no se espera a reiniciar
/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/
comenzar_juego();
// Desarrollo del comienzo de juego
function comenzar_juego() {

  /* Crear baraja, es decir crear el mazo_inicial. Este será un array cuyos 
  elementos serán elementos HTML <img>, siendo cada uno de ellos una carta.
  Sugerencia: en dos bucles for, bárranse los "palos" y los "números", formando
  oportunamente el nombre del fichero png que contiene a la carta (recuérdese poner
  el path correcto en la URL asociada al atributo src de <img>). Una vez creado
  el elemento img, inclúyase como elemento del array mazo_inicial. 
  */

  /*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/

  if (victoria.currentTime != 0) {
    victoria.pause();
    victoria.currentTime = 0;
    tapete_inicial.removeAttribute("style");
    tapete_sobrantes.removeAttribute("style");
  }

  barajacartas.play();

  limpiar();

  crearMazo();

  // Barajar
  barajar(mazo_inicial);

  // Dejar mazo_inicial en tapete inicial
  cargar_tapete_inicial();

  // Puesta a cero de contadores de mazos

  set_contador(cont_sobrantes, 0);
  set_contador(cont_receptor1, 0);
  set_contador(cont_receptor2, 0);
  set_contador(cont_receptor3, 0);
  set_contador(cont_receptor4, 0);
  set_contador(cont_movimientos, 0);


  // Arrancar el conteo de tiempo
  arrancar_tiempo();

  actualizarContadores();
} // comenzar_juego

/**
  Se debe encargar de arrancar el temporizador: cada 1000 ms se
  debe ejecutar una función que a partir de la cuenta autoincrementada
  de los segundos (segundos totales) visualice el tiempo oportunamente con el 
  format hh:mm:ss en el contador adecuado.

  Para descomponer los segundos en horas, minutos y segundos pueden emplearse
  las siguientes igualdades:

  segundos = truncar (   segundos_totales % (60)                 )
  minutos  = truncar ( ( segundos_totales % (60*60) )     / 60   )
  horas    = truncar ( ( segundos_totales % (60*60*24)) ) / 3600 )

  donde % denota la operación módulo (resto de la división entre los operadores)

  Así, por ejemplo, si la cuenta de segundos totales es de 134 s, entonces será:
     00:02:14

  Como existe la posibilidad de "resetear" el juego en cualquier momento, hay que 
  evitar que exista más de un temporizador simultáneo, por lo que debería guardarse
  el resultado de la llamada a setInterval en alguna variable para llamar oportunamente
  a clearInterval en su caso.   
*/

function arrancar_tiempo() {
  /*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/
  if (temporizador) clearInterval(temporizador);
  let hms = function () {
    let seg = Math.trunc(segundos % 60);
    let min = Math.trunc((segundos % 3600) / 60);
    let hor = Math.trunc((segundos % 86400) / 3600);
    let tiempo =
      (hor < 10 ? "0" + hor : "" + hor) +
      ":" +
      (min < 10 ? "0" + min : "" + min) +
      ":" +
      (seg < 10 ? "0" + seg : "" + seg);
    set_contador(cont_tiempo, tiempo);
    segundos++;
  };
  segundos = 0;
  hms(); // Primera visualización 00:00:00
  temporizador = setInterval(hms, 1000);
} // arrancar_tiempo

/**
  Si mazo es un array de elementos <img>, en esta rutina debe ser
  reordenado aleatoriamente. Al ser un array un objeto, se pasa
  por referencia, de modo que si se altera el orden de dicho array
  dentro de la rutina, esto aparecerá reflejado fuera de la misma.
  Para reordenar el array puede emplearse el siguiente pseudo código:

  - Recorramos con i todos los elementos del array
    - Sea j un indice cuyo valor sea un número aleatorio comprendido 
      entre 0 y la longitud del array menos uno. Este valor aleatorio
      puede conseguirse, por ejemplo con la instrucción JavaScript
        Math.floor( Math.random() * LONGITUD_DEL_ARRAY );
    - Se intercambia el contenido de la posición i-ésima con el de la j-ésima

*/

function crearMazo() {
  for (var i = 0; i < palos.length; i++) {
    for (var j = 0; j < numeros.length; j++) {
      mazo_inicial.push(`${numeros[j]}-${palos[i]}`);
    }
  }
  barajar(mazo_inicial);
}

function barajar(mazo) {
  for (var i = 0; i < mazo.length; i++) {
    //se va a recorrer el array de cartas
    var cartaSeleccionada = mazo[i]; //a cada carta del index se le va asignar una posición en el mazo por orden
    var cartaAlAzar = Math.floor(Math.random() * mazo.length); //a la variable carta al azar se le asigna un valor aleatorio hasta un máximo de 48
    mazo[i] = mazo[cartaAlAzar]; //a la carta que se encuentre en el index se le va asignar el valor de la carta al azar
    mazo[cartaAlAzar] = cartaSeleccionada; //la carta finalmente seleccionada será la que resultó aleatoriamente
  } //fin del for
} // barajar

/**
    En el elemento HTML que representa el tapete inicial (variable tapete_inicial)
  se deben añadir como hijos todos los elementos <img> del array mazo.
  Antes de añadirlos, se deberían fijar propiedades como la anchura, la posición,
  coordenadas top y left, algun atributo de tipo data-...
  Al final se debe ajustar el contador de cartas a la cantidad oportuna
*/
function cargar_tapete_inicial() {
  for (var i = 0; i < mazo_inicial.length; i++) {
    let nuevaCarta = document.createElement("img");
    nuevaCarta.setAttribute("src", `imgs/baraja/${mazo_inicial[i]}.png`);
    nuevaCarta.setAttribute("class", `carta`);
    if (i === mazo_inicial.length - 1) {
      nuevaCarta.setAttribute("draggable", `true`);
    } else {
      nuevaCarta.setAttribute("draggable", `false`);
    }
    nuevaCarta.setAttribute("ondragstart", `drag(event)`);
    nuevaCarta.setAttribute("id", `${mazo_inicial[i]}`);
    nuevaCarta.style.top = paso + "%"
    nuevaCarta.style.left = paso + "%"
    tapete_inicial.appendChild(nuevaCarta);
    paso++;
  }
} // cargar_tapete_inicial

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  var data = ev.dataTransfer.getData("text");
  tapete_origen = document.getElementById(document.getElementById(data).parentElement.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var carta = document.getElementById(data);
  var movimientoValido = false;
  var target_;
  if (document.getElementById(ev.target.id).parentElement.id == "padre_tapetes") {
    target_ = ev.target.id;
  } else {
    target_ = document.getElementById(ev.target.id).parentElement.id;
  }
  var tapeteSeleccionado = document.getElementById(target_);
  var mazoSeleccionado;
  switch (target_) {
    case "receptor1":
      mazoSeleccionado = mazo_receptor1;
      break;
    case "receptor2":
      mazoSeleccionado = mazo_receptor2;
      break;
    case "receptor3":
      mazoSeleccionado = mazo_receptor3;
      break;
    case "receptor4":
      mazoSeleccionado = mazo_receptor4;
      break;
    case "sobrantes":
      mazoSeleccionado = mazo_sobrantes;
      movimientoValido = true;
      break;
  }
  if (tapeteSeleccionado != tapete_sobrantes) {
    if (parseInt(carta.id.split("-")[0]) == (13 - parseInt(tapeteSeleccionado.childElementCount))) {
      if (tapeteSeleccionado.childElementCount != 1) {
        switch (tapeteSeleccionado.lastChild.id.split("-")[1]) {
          case "hex":
          case "cir":
            switch (carta.id.split("-")[1]) {
              case "hex":
              case "cir":
                hasFallado();
                break;
              case "ova":
              case "cua":
                movimientoValido = true;
                break;
            }
            break;
          case "ova":
          case "cua":
            switch (carta.id.split("-")[1]) {
              case "hex":
              case "cir":
                movimientoValido = true;
                break;
              case "ova":
              case "cua":
                hasFallado();
                break;
            }
            break;
        }
      } else {
        movimientoValido = true;
      }
    } else {
      hasFallado();
    }
  }
  if (movimientoValido == true) {
    tapeteSeleccionado.appendChild(document.getElementById(data));
    carta.removeAttribute("style");
    if (tapeteSeleccionado != tapete_sobrantes) {
      carta.setAttribute("draggable", "false");
    }
    switch (tapete_origen.id) {
      case "inicial":
        tapete_inicial.lastChild.setAttribute("draggable", "true");
        mazo_inicial.pop();
        break;
      case "sobrantes":
        if (tapete_sobrantes.childElementCount != 1) {
          tapete_sobrantes.lastChild.setAttribute("draggable", "true");
        }
        mazo_sobrantes.pop();
        break;
    }
    mazoSeleccionado.push(carta.id);
    inc_contador(cont_movimientos);
  }
  if (tapete_inicial.childElementCount == 1) {
    barajar(mazo_sobrantes);
    mazo_inicial = mazo_inicial.concat(mazo_sobrantes);
    mazo_sobrantes = [];
    paso = 1;
    cargar_tapete_inicial();
    while (tapete_sobrantes.childNodes[2]) {
      tapete_sobrantes.removeChild(tapete_sobrantes.childNodes[2]);
    }
  }
  actualizarContadores();
  if (mazo_inicial.length == 0 && mazo_sobrantes.length == 0) {
    hasGanado();
  }
}

function limpiar() {
  while (tapete_inicial.childNodes[2]) {
    tapete_inicial.removeChild(tapete_inicial.childNodes[2]);
  }
  while (tapete_receptor1.childNodes[2]) {
    tapete_receptor1.removeChild(tapete_receptor1.childNodes[2]);
  }
  while (tapete_receptor2.childNodes[2]) {
    tapete_receptor2.removeChild(tapete_receptor2.childNodes[2]);
  }
  while (tapete_receptor3.childNodes[2]) {
    tapete_receptor3.removeChild(tapete_receptor3.childNodes[2]);
  }
  while (tapete_receptor4.childNodes[2]) {
    tapete_receptor4.removeChild(tapete_receptor4.childNodes[2]);
  }
  while (tapete_sobrantes.childNodes[2]) {
    tapete_sobrantes.removeChild(tapete_sobrantes.childNodes[2]);
  }
  mazo_inicial = [];
  mazo_sobrantes = [];
  mazo_receptor1 = [];
  mazo_receptor2 = [];
  mazo_receptor3 = [];
  mazo_receptor4 = [];
  paso = 1;
}

function inc_contador(contador) {
  contador.innerHTML = +contador.innerHTML + 1;
} // inc_contador

function dec_contador(contador) {
  contador.innerHTML = +contador.innerHTML - 1;
} // dec_contador

function set_contador(contador, valor) {
  contador.innerHTML = valor;
} // set_contador o set_tiempo

function actualizarContadores() {
  set_contador(cont_inicial, mazo_inicial.length);
  set_contador(cont_sobrantes, mazo_sobrantes.length);
  set_contador(cont_receptor1, mazo_receptor1.length);
  set_contador(cont_receptor2, mazo_receptor2.length);
  set_contador(cont_receptor3, mazo_receptor3.length);
  set_contador(cont_receptor4, mazo_receptor4.length);
}

function hasFallado() {
  bruh.play();
  alert("¿No sabes jugar al solitario?\nLos números de las cartas van del 12 al 1\nNo olvides que despues de una carta gris va una naranja y viceversa\n\nSigue intentándolo\n;)")
}

function hasGanado() {
  victoria.play();
  tapete_inicial.setAttribute("style", "background-image: url('./imgs/gifs/chad.gif'); background-position: center 25%; background-size: cover; ")
  tapete_sobrantes.setAttribute("style", "background-image: url('./imgs/gifs/pingu.gif'); background-position: center 25%; background-size: cover; ")
  alert("¡¡¡Enhorabuena!!!\nHas ganado la partida :D\n\nTiempo: "+cont_tiempo.textContent+"\nMovimientos: "+cont_movimientos.textContent+"\n\nPulsa el botón de Reiniciar para jugar otra partida :)")
}
