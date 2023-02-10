/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos
let palos = ["ova", "cua", "hex", "cir"];
// Array de número de cartas
//let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
let numeros = [9, 10, 11, 12];

// paso (top y left) en pixeles de una carta a la siguiente en un mazo
let paso = 5;
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
let cont_inicial = document.getElementById("cont_inicial");
let cont_sobrantes = document.getElementById("cont_sobrantes");
let cont_receptor1 = document.getElementById("cont_receptor1");
let cont_receptor2 = document.getElementById("cont_receptor2");
let cont_receptor3 = document.getElementById("cont_receptor3");
let cont_receptor4 = document.getElementById("cont_receptor4");
let cont_movimientos = document.getElementById("cont_movimientos");

// Tiempo
let cont_tiempo = document.getElementById("cont_tiempo"); // span cuenta tiempo
let segundos = 0; // cuenta de segundos
let temporizador = null; // manejador del temporizador

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/

// Rutina asociada a boton reset: comenzar_juego
document.getElementById("resetBoton").onclick = comenzar_juego;

// El juego arranca ya al cargar la página: no se espera a reiniciar
/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/

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

  // Barajar
  barajar(mazo_inicial);

  // Dejar mazo_inicial en tapete inicial
  cargar_tapete_inicial(mazo_inicial);

  // Puesta a cero de contadores de mazos
  set_contador(cont_sobrantes, 0);
  set_contador(cont_receptor1, 0);
  set_contador(cont_receptor2, 0);
  set_contador(cont_receptor3, 0);
  set_contador(cont_receptor4, 0);
  set_contador(cont_movimientos, 0);

  // Arrancar el conteo de tiempo
  arrancar_tiempo();
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
    document.getElementById("contador_tiempo").innerHTML = tiempo;
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
function barajar(mazo) {
  for (var i = 0; i < 48; i++) {
    //se va a recorrer el array de cartas
    var cartaSeleccionada = mazo[i]; //a cada carta del index se le va asignar una posición en el mazo por orden
    var cartaAlAzar = Math.floor(Math.random() * 48); //a la variable carta al azar se le asigna un valor aleatorio hasta un máximo de 48
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
function cargar_tapete_inicial(mazo) {
  var formas = ["-ova", "-cua", "-hex", "-cir"]; //incluimos en un array los símbolos
  var mazo = []; //creamos un array para incluir en él cada carta
  //creamos un bucle en el cual vamos a ir introduciendo la combinación de números y símbolos de cada carta
  for (var iFormas = 0; iFormas < 4; iFormas++) {
    //a cada carta le asigna un símbolo
    for (var iNum = 1; iNum <= 12; iNum++) {
      //a cada símbolo le asigna un número
      mazo.push(iNum + formas[iFormas]); //se va introduciendo cada carta al mazo
    } //fin del for
  } //fin del for
  barajar(mazo);

  //Mostrar cartas en pantalla
  let cartas = ""; //inicializamos el string que luego meterá todas las imagenes en el tapete inicial

  for (let i = 0; i <= mazo.length; i++) {
    //creamos un for que recorra todas las cartas de mazo
    if (mazo[i] != undefined) {
      //en caso de que no reconozca la carta no se añadirá
      cartas += '<img id="carta" src="/imgs/baraja/' + mazo[i] + '.png" />'; //añadimos la carta al string
    }
  } //fin del for
  tapete_inicial.innerHTML = cartas; //añadimos todas las cartas en el tapete inicial
} // cargar_tapete_inicial

/**
 	Esta función debe incrementar el número correspondiente al contenido textual
   	del elemento que actúa de contador
*/
function inc_contador(contador) {
  contador.innerHTML = +contador.innerHTML + 1;
} // inc_contador

/**
	Idem que anterior, pero decrementando 
*/
function dec_contador(contador) {
  /*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! ***/
} // dec_contador

/**
	Similar a las anteriores, pero ajustando la cuenta al
	valor especificado
*/
function set_contador(contador, valor) {
  /*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/
} // set_contador
