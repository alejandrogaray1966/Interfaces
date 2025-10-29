console.log("✅ Senku.js cargado");

// se importa el método iniciarJuego de la clase jugarSenku.js
// import { iniciarJuego } from './jugarSenku.js';

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
    // se muestra el canvas con la imagen de fondo y se llama a iniciarJuego con sus parámetros
    // ------------------------------------------------------------------------------------------------
    const startGame = () => {

        ocultarBotones();
   
        // tomamos la configuración del juego
        const tablero = document.getElementById('tableros').value;
        const ficha = document.getElementById('fichas').value;
        const tiempo = document.getElementById('tiempos').value;
        
        // Cambiar el fondo del canvas según el tablero escogido
        const canvas = document.getElementById('senkuCanvas');
        if (tablero === 'moderno') {
            canvas.style.backgroundImage = "url('./Senku/img/tablero_moderno.svg')";
        } else if (tablero === 'medieval') {
            canvas.style.backgroundImage = "url('./Senku/img/tablero_medieval.png')";
        }

        // Mostrar el canvas y ocultar la imagen de previsualización
        document.querySelector('.canvas-wrapper').classList.remove('hidden');
        document.querySelector('.game-preview').classList.add('faded-blur');

        // lanzamos el juego
        iniciarJuego( tablero, ficha, tiempo);

    }

    // Añade el escuchador de eventos
    // ✅ Aquí van los listeners, fuera de startGame
    settingsButton.addEventListener('click', toggleSettingsMenu);
    playButton.addEventListener('click', startGame);

})
