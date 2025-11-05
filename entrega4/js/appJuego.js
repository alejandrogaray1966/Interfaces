// tomar el valor del tiempo que eligio el usuario para pasar el valor al controlador. El AppJuego.js leerá this.tiempoRestante directamente del controlador para actualizar el DIV).
// Importamos el ControladorSenku que maneja la lógica del juego.
import { ControladorSenku } from './controlador/ControladorSenku.js';
import { toggleSettingsMenu, mostrarRanking,mostrarDatosDelJuego,stopConfetti,rankingJugadores} from './utilidades.js';

// --- ELEMENTOS DE LA UI ---
const canvas = document.getElementById('senkuCanvas');
const selectorTiempo = document.getElementById('selectorTiempo');
const cronometroDiv = document.getElementById('cronometro'); // El div que muestra el tiempo
const selectorTableros = document.getElementById('tableros'); // Nuevo: Selector de tablero
const selectorFichas = document.getElementById('selectorFichas');
const settingsButton = document.querySelector('.game-btn-settings'); // Nuevo: Botón de ajustes (ruedita)
const botonPlay = document.querySelector('.game-btnPlay'); // El botón para iniciar/reiniciar
const rankingContainer = document.querySelector('.leaderboard'); 
const botonReiniciar = document.getElementById('verificarBtn');



// También necesitamos el contenedor del juego para mostrar/ocultar el canvas.
const canvasWrapper = document.querySelector('.canvas-wrapper'); 
const previewImage = document.querySelector('.game-preview');
const popoverFinJuego = document.getElementById('popoverFinJuego'); // Asumo que tienes un popover para el fin de juego
// Necesitas IDs para los popovers/botones de reintentar si los vas a usar
const reintentarSenku = document.getElementById('reintentar-senku');

// La URL de la imagen del tablero 
const MAPA_TABLEROS = {
    // IMPORTANTE: Verifica que estas rutas y extensiones sean EXACTAS a tus archivos.
    'moderno': './img/tableroModerno.png',
    'medieval': './img/tableroMedieval.png',
    'antiguo': './img/tableroAntiguo.png' // Asumo que el antiguo es PNG
};


let controlador = null;
let juegoIniciado = false;




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

function actualizarFichasUI(fichas) {
    // 1. Busca el SPAN que contiene solo el número.
    // La variable 'contadorSpan' ahora es el elemento <span id="contadorFicha">32</span>
    const contadorSpan = document.getElementById('contadorFicha'); 

    if (!contadorSpan) {
        console.error("Error: Elemento con ID 'contadorFicha' no encontrado.");
        return;
    }
    
    // 2. CORRECCIÓN: Actualiza el contenido de texto del SPAN solo con el número.
    contadorSpan.textContent = fichas.toString().padStart(2, '0');
    
    
    // --- Lógica de Estilos para el DIV contenedor ---
    // Usamos .parentElement para obtener el DIV que tiene la clase "contadorFicha"
    const divContenedor = contadorSpan.parentElement;
    
    if (divContenedor) {
        if (fichas <= 5) {
            divContenedor.classList.add('alerta-fichas-bajas');
        } else {
            divContenedor.classList.remove('alerta-fichas-bajas');
        }
    }
}

function mostrarPopoverFinJuego(mensajeDerrota) { // Puedes recibir el mensaje si quieres mostrarlo en el popover
    // popoverFinJuego ya está declarado al inicio del archivo
    if (popoverFinJuego && popoverFinJuego.showPopover) {
        popoverFinJuego.showPopover();
    }
    // Opcional: Detener confeti si lo usas para la victoria
    // if (stopConfetti) stopConfetti(); 
}

// Inicializa un nuevo juego o reinicia el existente.

function iniciarJuego() {

    if (!selectorTableros || !selectorTiempo || !canvas) {
        console.error("Error: Elementos de UI necesarios no encontrados (Tablero, Tiempo o Canvas). Verifica el DOM.");
        return;
    }
    
    // Obtener la configuración elegida por el usuario
    const tableroSeleccionado = selectorTableros.value;

    // Obtener el tiempo seleccionado por el usuario.
    const tiempoSeleccionadoSegundos = parseInt(selectorTiempo.value, 10);


    const tipoFichas = selectorFichas.value; 

    //Usamos el mapa para obtener la URL correcta
    let imagenTableroUrl = MAPA_TABLEROS[tableroSeleccionado];

    // Por si acaso, si el valor seleccionado no existe en el mapa, usamos el antiguo como fallback
    if (!imagenTableroUrl) {
        console.warn(`Ruta de tablero no encontrada para '${tableroSeleccionado}'. Usando tablero antiguo.`);
        imagenTableroUrl = MAPA_TABLEROS['antiguo'];
    }

        // Mostrar los Datos del Juego Seleccionados
    const selectedOption = selectorTiempo.options[selectorTiempo.selectedIndex];
    const settings = {
        // Nivel (Tablero): Capitalizamos la primera letra (ej: 'moderno' -> 'Moderno')
        nivel: tableroSeleccionado.charAt(0).toUpperCase() + tableroSeleccionado.slice(1), 
        // Dificultad (Tiempo): Obtenemos el texto visible de la opción seleccionada.
        dificultad: selectedOption.text,
    };
    mostrarDatosDelJuego(settings);


    const settingsMenu = document.querySelector('.game-settings-menu');
    if ((settingsButton && !settingsButton.classList.contains('hidden'))||(settingsMenu && !settingsMenu.classList.contains('hidden'))) {
        settingsMenu.classList.add('hidden'); 

        settingsButton.classList.add('hidden'); 
        
    }
    
    //Mostrar el contenedor del Canvas (y el efecto de previsualización)
    if (previewImage) {
        previewImage.classList.add('hidden');
        previewImage.classList.remove('faded-blur');    
    }
    if (canvasWrapper) {
        canvasWrapper.classList.remove('hidden'); 
    }
    if (botonPlay) {
        botonPlay.classList.add('hidden'); 
        // pero aquí lo ocultamos al comenzar la partida.
    }

    if (!controlador) {
        // Primera vez que se inicia el juego
        controlador = new ControladorSenku(canvas, imagenTableroUrl, tipoFichas, tiempoSeleccionadoSegundos, actualizarCronometroUI, actualizarFichasUI, mostrarPopoverFinJuego);// CALLBACK QUE ACTUALIZA EL DIV!

        
        juegoIniciado = true;
        
    } else {
        controlador.reiniciarJuego(imagenTableroUrl, tipoFichas, tiempoSeleccionadoSegundos, actualizarCronometroUI, actualizarFichasUI, mostrarPopoverFinJuego);
    }
        
    if (popoverFinJuego && popoverFinJuego.open) {
        popoverFinJuego.hidePopover();
    }
}

window.onload = function() {
    mostrarRanking(rankingJugadores);
    if (botonPlay) {
        botonPlay.addEventListener('click', iniciarJuego);
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


    // Si existe el botón de reintentar (por ejemplo, en un pop-up de fin de juego)
    if (reintentarSenku) {
        reintentarSenku.addEventListener('click', iniciarJuego);
    }
    
    // Inicializar el display de tiempo con el valor por defecto antes de que empiece el juego
    if (selectorTiempo) {
        // Tu código usa un 'const tiempoInicial', el mío lo hace directamente. Ambos son válidos.
        actualizarCronometroUI(parseInt(selectorTiempo.value, 10));
    }
};

// Evita la selección de texto al arrastrar en el Canvas, lo cual puede interferir con el Drag and Drop.
// ESTO ES IMPORTANTE PARA LA USABILIDAD DEL CANVAS.
document.addEventListener('selectstart', (e) => e.preventDefault());
