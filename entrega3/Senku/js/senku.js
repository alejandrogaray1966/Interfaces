console.log("✅ Senku.js cargado");

// se importa el método iniciarJuego de la clase jugarSenku.js
import { iniciarJuego } from './jugarSenku.js';

// Estado inicial del tablero MODERNO
const INITIAL_BOARD_MODERNO = [
            [9, 9, 1, 1, 1, 9, 9], 
            [9, 9, 1, 1, 1, 9, 9], 
            [1, 1, 1, 1, 1, 1, 1], 
            [1, 1, 1, 0, 1, 1, 1], 
            [1, 1, 1, 1, 1, 1, 1], 
            [9, 9, 1, 1, 1, 9, 9], 
            [9, 9, 1, 1, 1, 9, 9] 
        ];

// Estado inicial del tablero MEDIEVAL
const INITIAL_BOARD_MEDIEVAL = [
            [9, 9, 1, 1, 1, 9, 9], 
            [9, 1, 1, 1, 1, 1, 9], 
            [1, 1, 1, 1, 1, 1, 1], 
            [1, 1, 1, 0, 1, 1, 1], 
            [1, 1, 1, 1, 1, 1, 1], 
            [9, 1, 1, 1, 1, 1, 9], 
            [9, 9, 1, 1, 1, 9, 9] 
        ];

// Estado inicial del tablero ANTIGUO
const INITIAL_BOARD_ANTIGUO = [
            [9, 9, 9, 1, 1, 1, 1], 
            [9, 9, 9, 1, 1, 1, 1], 
            [9, 9, 9, 1, 1, 1, 1], 
            [1, 1, 1, 0, 1, 1, 1], 
            [1, 1, 1, 1, 9, 9, 9], 
            [1, 1, 1, 1, 9, 9, 9], 
            [1, 1, 1, 1, 9, 9, 9] 
        ];

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // constantes para el botón de play
    const playButton = document.querySelector('.game-btnPlay');
    // constantes para la configuración del juego
    const settingsButton = document.querySelector('.game-btn-settings button');
    const settingsMenu = document.querySelector('.game-settings-menu');

    // ------------------------------------------------------------------------------------------------
    // método que abre y cierra el menú de configuración
    // ------------------------------------------------------------------------------------------------
    const toggleSettingsMenu = () => {
        settingsMenu.classList.toggle('hidden');
    };

    // ------------------------------------------------------------------------------------------------
    // método que bloquea el botón jugar y el de configuración
    // ------------------------------------------------------------------------------------------------
    const ocultarBotones = () => {
        // Bloquear botón de jugar
        playButton.classList.remove('btn-play');
        //agrego una clase para ocultar el boton Jugar durante el juego.
        playButton.classList.add('playing');
        // bloquear botón de configuración
        settingsButton.classList.add('hidden');
        settingsMenu.classList.add('hidden');
    };

    // ------------------------------------------------------------------------------------------------
    //            método que muestra los datos del juego iniciado
    // ------------------------------------------------------------------------------------------------
    function mostrarDatosDelJuego(settings) {
        const infoContainer = document.getElementById('gameInfo');
        infoContainer.innerHTML = `
            <li><strong>Tablero:</strong> ${settings.tablero}</li>
            <li><strong>Fichas:</strong> ${settings.ficha}</li>
            <li><strong>Límite:</strong> ${settings.tiempo} Seg.</li>
        `;
    }

    // ------------------------------------------------------------------------------------------------
    // se muestra el canvas con la imagen de fondo y se llama a iniciarJuego con sus parámetros
    // ------------------------------------------------------------------------------------------------
    const startGame = () => {

        ocultarBotones();
   
        // tomamos la configuración del juego
        const tablero = document.getElementById('tableros').value;
        const ficha = document.getElementById('fichas').value;
        const tiempo = document.getElementById('tiempos').value;
        
        // Constantes del juego iniciado
        const gameSettings = {
            tablero: tablero,
            ficha: ficha,
            tiempo: tiempo
        };

        // Cambiar LA MATRIZ DEL JUEGO  según el tablero escogido
        let MATRIZ;
        if (tablero === 'moderno') {
            MATRIZ = INITIAL_BOARD_MODERNO;
        } else if (tablero === 'medieval') {
            MATRIZ = INITIAL_BOARD_MEDIEVAL;
        } else if (tablero === 'antiguo') {
            MATRIZ = INITIAL_BOARD_ANTIGUO;
        }

        // Cambiar el fondo del canvas según el tablero escogido
        const canvas = document.getElementById('senkuCanvas');
        if (tablero === 'moderno') {
            canvas.style.backgroundImage = "url('./Senku/img/tablero_moderno.svg')";
        } else if (tablero === 'medieval') {
            canvas.style.backgroundImage = "url('./Senku/img/tablero_medieval.png')";
        } else if (tablero === 'antiguo') {
            canvas.style.backgroundImage = "url('./Senku/img/tablero_antiguo.png')";
        }

        // Mostrar el canvas y ocultar la imagen de previsualización
        document.querySelector('.canvas-wrapper').classList.remove('hidden');
        document.querySelector('.game-preview').classList.add('faded-blur');

        // Mostrar los datos del juego iniciado
        mostrarDatosDelJuego(gameSettings);

        // lanzamos el juego
        iniciarJuego( MATRIZ, tablero, ficha, tiempo);

    }

    // Añade el escuchador de eventos
    // ✅ Aquí van los listeners, fuera de startGame
    settingsButton.addEventListener('click', toggleSettingsMenu);
    playButton.addEventListener('click', startGame);

})
