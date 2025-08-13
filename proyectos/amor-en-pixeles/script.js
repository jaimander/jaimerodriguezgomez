let situacionActual = 0;
let situacion = [];
let situacionFueElegida = [];
let situacionesElegidas = [];
let feedback = [];
let contenidoFeedback = [];
let situacionNum = [];
let corazon = [];
let btnSiguiente;

let contenedorSituacionesElegidas = document.getElementById(
  "contenedor-situaciones-elegidas"
);

let imagen = document.getElementById("imagen");
let contador = 0;

let textoSituacion = document.getElementById("situacion");

let btnSi = document.getElementById("si");
let btnNo = document.getElementById("no");
let btnCerrar = document.getElementById("boton-cerrar");

let ventana = document.getElementById("contenedor-respuesta");

const pasos = document.querySelectorAll("#linea-progreso li");
let barraProgreso = document.getElementById("linea-progreso");

let contenido = document.getElementById("contenido");

let resultados = document.getElementById("resultados");

let imagenFinal = document.getElementById("imagen-final");

let puntaje = document.getElementById("puntaje");

resultados.style.display = "none";

contenidoFeedback[0] =
  "<b>Habilidades de comunicación</b> / Encuentra formas sanas de expresar desacuerdos y resolver conflictos. Diseña unos pasos para resolver conflictos, que inicie con darse un tiempo para que la emoción no deseada  (ej. ira, frustración, tristeza) baje y puedan dialogar.";
contenidoFeedback[1] =
  "<b>Gestión de las emociones</b> / Expresa tus emociones sanamente. Podemos sentir diferentes emociones intensas pero las expresiones violentas como gritarse, golpearse, lanzar objetos o imponerse sobre el otro no son sanas y por tanto no son válidas.";
contenidoFeedback[2] =
  "<b>Límites</b> / Fortalece habilidades para decir  'No' en sintuaciones donde te sientas obligado, vulnerado o lastimado.";
contenidoFeedback[3] =
  "<b>Ideas sobre el amor</b> / Revisa cómo influyen tu familia y amistades en creencias como 'si me ama, me cela', 'me grita porque me ama', ya que esto puede alimentar conductas violentas.";
contenidoFeedback[4] =
  "<b>Comunicación</b> / Esta es una manera de lastimar al otro y no resolver el conflicto y hace mas compleja la dificultad entre los dos. Si estás enojado evita tomar acción de manera impulsiva con tus redes sociales sin antes resolver el conflicto principal.";
contenidoFeedback[5] =
  "<b>Confianza</b> / La confianza se construye cuando hay coherencia entre lo que se dice y se hace, revisar los espacios privados del otro te generará aun mas desconfiaza. Acuerden decir la verdad siempre.";
contenidoFeedback[6] =
  "<b>Libertad</b> / Una relación sana es aquella donde podemos ser nosotros mismos. Habla con tu pareja y lleguen a acuerdos sobre lo negociable y lo no negociable, de manera que ambos se sientan cómodos y auténticos.";
contenidoFeedback[7] =
  "<b>Respeto</b> / Comunica a tu pareja qué te está lastimando y establece límites (retírate del espacio físico o rechaza este comportamiento comunicándoselo). Si eres tú quien lastima al otro, practica respirar y sentirte más tranquilo antes de hablar. Cuando estás enojado, triste o frustrado puedes decir de manera incorrecta lo que sientes y lastimar al otro";

situacion[0] = "Se gritan.";
situacion[1] = "Se golpean.";
situacion[2] =
  "Existe presión para tener encuentros sexuales o contacto físico no deseado.";
situacion[3] =
  "Alguno de los dos decide con qué personas se puede relacionar el otro.";
situacion[4] = "Cuando discuten se ignoran o bloquean en redes.";
situacion[5] = "Se piden las claves del celular, correo y redes sociales";
situacion[6] = "Uno de los dos decide cómo se debe vestir el otro.";
situacion[7] = "Usan expresiones que lastiman su autoestima.";

corazon[0] =
  "https://cdn.glitch.global/2c8d2548-b758-42c8-89c8-d34140ef9248/10.png?v=1731259263559";
corazon[1] =
  "https://cdn.glitch.global/2c8d2548-b758-42c8-89c8-d34140ef9248/11.png?v=1731259265932";
corazon[2] =
  "https://cdn.glitch.global/2c8d2548-b758-42c8-89c8-d34140ef9248/12.png?v=1731259267495";
corazon[3] =
  "https://cdn.glitch.global/2c8d2548-b758-42c8-89c8-d34140ef9248/13.png?v=1731259268900";
corazon[4] =
  "https://cdn.glitch.global/2c8d2548-b758-42c8-89c8-d34140ef9248/14.png?v=1731259270061";
corazon[5] =
  "https://cdn.glitch.global/2c8d2548-b758-42c8-89c8-d34140ef9248/15.png?v=1731259271307";
corazon[6] =
  "https://cdn.glitch.global/2c8d2548-b758-42c8-89c8-d34140ef9248/16.png?v=1731259272563";
corazon[7] =
  "https://cdn.glitch.global/2c8d2548-b758-42c8-89c8-d34140ef9248/17.png?v=1731259273773";
corazon[8] =
  "https://cdn.glitch.global/2c8d2548-b758-42c8-89c8-d34140ef9248/18.png?v=1731260009112";

window.onload = function () {
  for (let i = 0; i < situacion.length; i++) {
    situacionNum[i] = i + 1;
  }
};

textoSituacion.innerHTML = situacion[situacionActual];
pasos[situacionActual].style.outlineStyle = "solid";
pasos[situacionActual].style.outlineColor = "red";
contenedorSituacionesElegidas.style.display = "none";

btnSi.onclick = function () {
  //mostrarFeedback(situacionActual);
  situacionFueElegida[situacionActual] = true;
  contador++;
  situacionActual++;
  actualizarSituacion();
  actualizarBarraProgreso();
};

btnNo.onclick = function () {
  situacionFueElegida[situacionActual] = false;
  situacionActual++;
  actualizarSituacion();
  actualizarBarraProgreso();
};

function mostrarFeedback(sa) {
  ventana.style.visibility = "visible";
}

btnCerrar.onclick = function () {
  ventana.style.visibility = "hidden";
  actualizarSituacion();
   actualizarBarraProgreso();
};

function actualizarSituacion() {
  if(situacionActual == 8){
    if(contador == 0) {
      window.location.href = "tomaaccionb.html"
      }
    else{
     
    mostrarResultados();
    }
  }
  if(situacionActual < 8){
  imagen.src = corazon[contador];
   textoSituacion.innerHTML = situacion[situacionActual];
  }
}

function actualizarBarraProgreso() {
  pasos.forEach((item, index) => {
    //console.log(`Elemento ${index + 1}: ${item.textContent}`);
    item.style.outline = "none";
  });
  pasos[situacionActual].style.outlineStyle = "solid";
  pasos[situacionActual].style.outlineColor = "red";
}

function mostrarResultados() {
  contenido.style.display = "none";
  barraProgreso.style.display = "none";
  resultados.style.display = "block";
  contenedorSituacionesElegidas.style.display = "block";
  imagenFinal.src = corazon[contador];
  if (contador >= 1) {
    let textoPresentacion = document.createElement("p");
    textoPresentacion.innerHTML =
      "Respondiste que sí a las siguientes afirmaciones. Te compartimos algunas ideas que te pueden ayudar a comprender y reflexionar sobre tu relación.";
    contenedorSituacionesElegidas.appendChild(textoPresentacion);
    contenedorSituacionesElegidas.classList.add("texto");
  } else {
    /*
    let textoPresentacion = document.createElement("p");
    textoPresentacion.innerHTML =
      "Si ves que un amigo o amiga están siendo víctima, comparte este contenido. No guardes silencio.";
    resultados.appendChild(textoPresentacion);
    
  */
    window.location.href = "tomaaccionb.html";
  }
  puntaje.innerHTML = contador + "/8";
  let index = 0;
  for (let i = 0; i < situacion.length; i++) {
    if (situacionFueElegida[i] == true) {
      situacionesElegidas[index] = document.createElement("p");
      situacionesElegidas[index].classList.add("situacion-elegida");
      situacionesElegidas[index].classList.add("colapsable");
      situacionesElegidas[index].innerHTML =
        situacionNum[i] + ". " + situacion[i];
      contenedorSituacionesElegidas.appendChild(situacionesElegidas[index]);
      
      //
      feedback[index] = document.createElement("p");
      feedback[index].classList.add("contenido-colapsable");

      feedback[index].innerHTML = contenidoFeedback[i];
      contenedorSituacionesElegidas.appendChild(feedback[index]);
      //

      index++;
    }
  }
  btnSiguiente = document.createElement("button");
  contenedorSituacionesElegidas.appendChild(btnSiguiente);
  btnSiguiente.classList.add("boton");
  btnSiguiente.innerHTML = "Siguiente";

  btnSiguiente.onclick = function () {
    window.location.href = "tomaaccion.html";
  };
}

//

var coll = document.getElementsByClassName("colapsable");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    console.log("dsa")
    this.classList.toggle("active"); //¿por qué este toggle no funciona bien en mobile?
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
