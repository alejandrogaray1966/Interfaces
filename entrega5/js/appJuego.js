// tomar el valor del tiempo que eligio el usuario para pasar el valor al controlador. El AppJuego.js leerá this.tiempoRestante directamente del controlador para actualizar el DIV).
// Importamos el ControladorSenku que maneja la lógica del juego.

import { toggleSettingsMenu, mostrarRanking,mostrarDatosDelJuego,startConfetti,stopConfetti,rankingJugadores} from './utilidades.js';


import { JuegoModel } from "./modelo/JuegoModel.js";
import { JuegoView } from "./vista/JuegoView.js";
import {JuegoController} from "./controlador/JuegoController.js";



// --- ELEMENTOS DE LA UI ---
const canvas = document.getElementById('flappyBirdCanvas');
const fondosDeJuego = document.querySelectorAll('.fondos-parallax .layer');
const selectorTiempo = document.getElementById('selectorTiempo');
const cronometroDiv = document.getElementById('cronometro'); // El div que muestra el tiempo
const selectorTableros = document.getElementById('tableros'); // Nuevo: Selector de tablero
const selectorMundos = document.getElementById('mundos'); // Nuevo: Selector de tablero
const fondosParallaxContenedor = document.querySelector('.fondos-parallax');
const fondoBosque = document.querySelector('.fondo_bosque');//contenedores de los diferentes fondos
const fondoBosqueNoche = document.querySelector('.fondo_bosqueNoche');
const fondoCiudad = document.querySelector('.fondo_ciudad');
const selectorMaterial = document.getElementById('selectorMaterial');
const selectorPersonaje = document.getElementById('selectorPersonaje');

const settingsButton = document.querySelector('.game-btn-settings'); // Nuevo: Botón de ajustes (ruedita)
const botonPlay = document.querySelector('.game-btnPlay'); // El botón para iniciar/reiniciar
const rankingContainer = document.querySelector('.leaderboard'); 
const botonReiniciar = document.getElementById('verificarBtn');
let popoverFinJuego = document.getElementById('id-popover'); // Asumo que tienes un popover para el fin de juego



// También necesitamos el contenedor del juego para mostrar/ocultar el canvas.
const canvasWrapper = document.querySelector('.canvas-wrapper'); 
const previewImage = document.querySelector('.game-preview');
// Necesitas IDs para los popovers/botones de reintentar si los vas a usar
const reintentar = document.getElementById('boton-reintentar');
const inicio = document.getElementById('boton-inicio');

// La URL de la imagen del tablero 
const MAPA_TABLEROS = {
    // IMPORTANTE: Verifica que estas rutas y extensiones sean EXACTAS a tus archivos.
    'moderno': './img/tableroModerno.png',
    'medieval': './img/tableroMedieval.png',
    'antiguo': './img/tableroAntiguo.png' // Asumo que el antiguo es PNG
};


let controlador = null;
let juegoIniciado = false;

function cambiarFondoParallax() {
    const mundoSeleccionado = selectorMundos.value;
    console.log("mundo seleccionado: " + mundoSeleccionado);

    fondoBosque.style.display = 'none';
    fondoBosqueNoche.style.display = 'none';
    fondoCiudad.style.display = 'none';
    
    fondoBosque.querySelectorAll('.layer').forEach(layer => layer.classList.add('fondo-detenido'));
    fondoBosqueNoche.querySelectorAll('.layer').forEach(layer => layer.classList.add('fondo-detenido'));
    fondoCiudad.querySelectorAll('.layer').forEach(layer => layer.classList.add('fondo-detenido'));

 
    switch (mundoSeleccionado) {
        case 'bosque': console.log("entro en bosque");
            fondoBosque.style.display = 'block'; 
            fondoBosque.querySelectorAll('.layer').forEach(layer => layer.classList.remove('fondo-detenido'));
            break;
        case 'bosqueNocturno': console.log("entro en bosque nocturno");
            fondoBosqueNoche.style.display = 'block';
            fondoBosqueNoche.querySelectorAll('.layer').forEach(layer => layer.classList.remove('fondo-detenido'));
            break;
        case 'ciudad': console.log("entro en ciudad");
            fondoCiudad.style.display = 'block'; 
            fondoCiudad.querySelectorAll('.layer').forEach(layer => layer.classList.remove('fondo-detenido'));
            break;
        default:console.log("entro en default");
            // Fondo por defecto bosque 
            fondoBosque.style.display = 'block';
            fondoBosque.querySelectorAll('.layer').forEach(layer => layer.classList.remove('fondo-detenido'));
            break;
    }
}




function actualizarCronometroUI(segundos) {

    if (!cronometroDiv) return;

    // Convertir segundos a formato MM:SS
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    
    // padStart(2, '0') asegura que siempre tenga dos dígitos (ej: 05:03)
    const tiempoFormateado = `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
    
    // Actualizar el contenido del div (buscamos el <p> dentro del div)
    const pElemento = cronometroDiv.querySelector('p');
    if (pElemento) {
        pElemento.textContent = `Tiempo Restante: ${tiempoFormateado}`;
    }
    
    // Si el tiempo es bajo, podemos cambiar la clase para darle un efecto de advertencia
    if (segundos <= 60 && segundos > 0) {
        cronometroDiv.classList.add('tiempo-bajo');
    } else {
        cronometroDiv.classList.remove('tiempo-bajo');
    }
}

    // Referencias a los elementos del popover HTML
   function mostrarPopoverFinJuego(victoria, mensajePrincipal) {
    const tituloElemento = document.getElementById('mensajeFinJuegoTitulo');
    const descripcionElemento = document.getElementById('mensajeFinJuegoDescripcion'); 
        // --- 1. Definir Contenido ---
    if (victoria) {
        tituloElemento.textContent = "¡Perdiste! 😞";
        descripcionElemento.textContent = "Podés volver a intentarlo...";
        startConfetti(); 
    } else {
        tituloElemento.textContent = "Juego Terminado 😞";
        descripcionElemento.textContent = mensajePrincipal;
        stopConfetti();
    }

        // --- 2. Mostrar el Popover ---
    if (popoverFinJuego.showPopover) { // Usamos la global 'popoverFinJuego'
                popoverFinJuego.showPopover();
    }
}// Inicializa un nuevo juego o reinicia el existente.*/

function iniciar() {
    console.log("dentro de iniciar...");
   

    //traemos de iniciarJuego de senku


    if ( !selectorTiempo || !canvas ) {
        console.error("Error: Elementos de UI necesarios no encontrados. Verifica el DOM.");
        return;
    }
    
    // Obtener la configuración elegida por el usuario
    //const tableroSeleccionado = selectorTableros.value; VER BACKGROUND
    const tiempoSeleccionadoSegundos = parseInt(selectorTiempo.value, 10);
  
    // Mostrar los Datos del Juego Seleccionados
    const selectedOption = selectorTiempo.options[selectorTiempo.selectedIndex];
    const settings = {
        // Nivel (Tablero): Capitalizamos la primera letra (ej: 'moderno' -> 'Moderno')
       // nivel: tableroSeleccionado.charAt(0).toUpperCase() + tableroSeleccionado.slice(1), 
        // Dificultad (Tiempo): Obtenemos el texto visible de la opción seleccionada.
        dificultad: selectedOption.text,
    };
    mostrarDatosDelJuego(settings);


    const settingsMenu = document.querySelector('.game-settings-menu');
    if ((settingsButton && !settingsButton.classList.contains('hidden'))||(settingsMenu && !settingsMenu.classList.contains('hidden'))) {
        settingsMenu.classList.add('hidden'); 
        settingsButton.classList.add('hidden'); 
    }
    
    // Mostrar el contenedor del Canvas (y el efecto de previsualización)
    if (previewImage) {
        previewImage.classList.add('hidden');
        previewImage.classList.remove('faded-blur');    
    }
    if (canvasWrapper) {
        canvasWrapper.classList.remove('hidden'); 
    }
    if (botonPlay) {
        botonPlay.classList.add('hidden'); 
    }
    if (fondosParallaxContenedor) {
        fondosParallaxContenedor.style.display = 'block'; 
    }

    if (!controlador) {
        // Primera vez que se inicia el juego
        
        controlador = new JuegoController(canvas,tiempoSeleccionadoSegundos, actualizarCronometroUI, mostrarPopoverFinJuego, detenerFondo);

        juegoIniciado = true;
        
        requestAnimationFrame(controlador.loop.bind(controlador));

        
    } else {
        reanudarFondo();
        controlador.iniciar();
       
    }
        
    if (popoverFinJuego && popoverFinJuego.hidePopover) {
        console.log("popover de inciarjuego" + popoverFinJuego)
        popoverFinJuego.hidePopover();
    }

}


window.onload = function() {
    mostrarRanking(rankingJugadores);
    if (botonPlay) {
        console.log("dentro de boton play...");
        botonPlay.addEventListener('click', iniciar);
    } else {
        console.error('El botón "jugar" no se encontró en el DOM. Verifica el selector.');
    }

    if (settingsButton) {
        settingsButton.addEventListener('click', toggleSettingsMenu);
    }
    
    if (botonReiniciar) {
        // Llama a la misma función que ya sabe cómo reiniciar el juego.
        botonReiniciar.addEventListener('click', iniciarJuego); 
    }

    if (selectorMundos) {
        cambiarFondoParallax();
        selectorMundos.addEventListener('change', cambiarFondoParallax);
   }


    }
    


    // Si existe el botón de reintentar (por ejemplo, en un pop-up de fin de juego)
    if (inicio) {
            inicio.addEventListener('click', () => {
           
            window.location.href = 'senku.html'; // ⬅️ Cambia 'senku.html' a la ruta correcta si es diferente
        })    }
    if (reintentar) {
        reintentar.addEventListener('click', iniciar);
    }

    
    // Inicializar el display de tiempo con el valor por defecto antes de que empiece el juego
    if (selectorTiempo) {
        // Tu código usa un 'const tiempoInicial', el mío lo hace directamente. Ambos son válidos.
        actualizarCronometroUI(parseInt(selectorTiempo.value, 10));
    }


    function detenerFondo() {
        fondosDeJuego.forEach(fondo => {
            fondo.classList.add('fondo-detenido');
        });
    }

    function reanudarFondo() {
        fondosDeJuego.forEach(fondo => {
            fondo.classList.remove('fondo-detenido');
        });
    }


// Evita la selección de texto al arrastrar en el Canvas, lo cual puede interferir con el Drag and Drop.
// ESTO ES IMPORTANTE PARA LA USABILIDAD DEL CANVAS.
document.addEventListener('selectstart', (e) => e.preventDefault());
