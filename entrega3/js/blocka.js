console.log("✅ blocka.js cargado");

// se importa el método iniciarJuego de la clase jugarBlocka.js
import { iniciarJuego } from './jugarBlocka.js';

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // constantes para la elección de la imagen
    const playButton = document.querySelector('.game-btnPlay');
    const ruletaContainer = document.getElementById('ruleta-container');
    const winnerDisplay = document.getElementById('winner-display');
    const gameImages = document.querySelectorAll('#ruleta-container img');
    const totalImages = gameImages.length; 
    let intervalId = null;
    // constantes para la configuración del juego
    const settingsButton = document.querySelector('.game-btn-settings button');
    const settingsMenu = document.querySelector('.game-settings-menu');
    // las 6 imágenes comienzan blureadas para que destaque el boton Play
    ruletaContainer.classList.add('blur');

    // ------------------------------------------------------------------------------------------------
    // método que abre y cierra el menú de configuración
    // ------------------------------------------------------------------------------------------------
    const toggleSettingsMenu = () => {
        settingsMenu.classList.toggle('hidden');
    };

    // ------------------------------------------------------------------------------------------------
    // método que bloquea el botón jugar y el de configuración
    // ------------------------------------------------------------------------------------------------
    const bloquearBoton = () => {
        // Bloquear botón de jugar
        playButton.classList.remove('btn-play');//agrego una clase para ocultar el boton Jugar durante el juego.
        playButton.classList.add('playing');
        //playButton.style.pointerEvents = 'none';
        //playButton.style.opacity = '0.6';
        // Bloquear botón de configuración
        settingsButton.style.pointerEvents = 'none';
        settingsButton.style.opacity = '0.6';
        setTimeout(() => {
            //playButton.style.pointerEvents = 'auto';
            //playButton.style.opacity = '1';
            settingsButton.style.pointerEvents = 'auto';
            settingsButton.style.opacity = '1';
        }, 5000);
    };

    // ------------------------------------------------------------------------------------------------
    // método que borra de todas las imágenes los estilos si fue seleccionada
    // ------------------------------------------------------------------------------------------------
    const removeSelection = () => {
        gameImages.forEach(img => {
            img.classList.remove('selected-random');
        });
    };

    // ------------------------------------------------------------------------------------------------
    // da comienzo a la selección de la imagen con la cual se jugará
    // ------------------------------------------------------------------------------------------------
    const startRandomSelection = () => {
        
        bloquearBoton();
        settingsMenu.classList.add('hidden');
        // Limpiar estados previos
        if (intervalId) clearInterval(intervalId);
        removeSelection();
        ruletaContainer.classList.remove('hidden'); // Aseguramos que la ruleta esté visible al inicio
        ruletaContainer.classList.remove('blur');
        ruletaContainer.classList.add('clearBlur');
        winnerDisplay.classList.remove('visible'); // Aseguremos que no se vea el ganador anterior
        winnerDisplay.innerHTML = ''; // Limpiamos el contenido anterior
        // acá elegimos la imagen ganadora
        const finalRandomIndex = Math.floor(Math.random() * totalImages);
        const selectedImageElement = gameImages[finalRandomIndex]; 

        // -----------------------------------------------------
        // A. INICIO DEL EFECTO DE SORTEO
        // -----------------------------------------------------
        let currentIndex = 0;
        intervalId = setInterval(() => {
            gameImages[currentIndex].classList.remove('selected-random');
            currentIndex = (currentIndex + 1) % totalImages;
            gameImages[currentIndex].classList.add('selected-random');
        }, 200); // Ajusté a 300 para una ruleta más pausada

        // -----------------------------------------------------
        // B. DETENER EL SORTEO Y REVELAR LA IMAGEN GANADORA
        // -----------------------------------------------------
        setTimeout(() => {
            clearInterval(intervalId); 
            intervalId = null; 
            removeSelection(); 

            // 1. Ocultar el contenedor de la ruleta
            //ruletaContainer.classList.add('hidden');
            
            // 2. Crear y configurar la imagen ganadora
            const winnerImageClone = selectedImageElement.cloneNode(true);
            winnerDisplay.appendChild(winnerImageClone);
            
            // 3. Revelar el contenedor de la imagen ganadora con efecto de ampliación
            // Pequeño retraso para que la ruleta se oculte primero
            setTimeout(() => {
                winnerDisplay.classList.add('visible');
                // Esperamos 2 segundo más para que se vea la imagen ganadora
                setTimeout(() => {
                    const imagenSrc = selectedImageElement.src;
                    const nivel = document.getElementById('nivel').value;
                    const dificultad = document.getElementById('dificultad').value;
                    const tiempo = document.getElementById('tiempo').value;
                    // lanzamos el juego
                    iniciarJuego(imagenSrc, nivel, dificultad, tiempo);
                }, 2000); // ⏳ Espera de 2 segundo para mostrar la imagen ganadora

            }, 100); // ⏱️ Espera breve para aplicar la clase visible
            
        }, 4000); // Duración total de la ruleta: 4 segundos
    };

    // Añade el escuchador de eventos
    settingsButton.addEventListener('click', toggleSettingsMenu);
    playButton.addEventListener('click', startRandomSelection);

});
