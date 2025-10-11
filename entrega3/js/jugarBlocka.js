console.log("✅ jugarBlocka.js cargado");

// se importan los métodos de la clase rotacionPiezas.js
import { inicializarRotacion, activarRotacionInteractiva, verificarPuzzleResuelto } from './rotacionPiezas.js';
// se importan los métodos de la clase cronometro.js
import { iniciarCronometro, detenerCronometro } from './cronometro.js';

// ------------------------------------------------------------------------------------------------
//                método que oculta la selección de imágenes y muestra el CANVAS 
// ------------------------------------------------------------------------------------------------
export const mostrarCanvas = () => {
    // Ocultar elementos de la interfaz
    document.querySelector('.game-preview-blocka').classList.add('hidden');
    document.getElementById('winner-display').classList.add('hidden');
    document.querySelector('.game-btn-settings').classList.add('hidden');
    document.querySelector('.game-settings-menu').classList.add('hidden');
    document.querySelector('.game-btnPlay').classList.add('hidden');

    // Mostrar el contenedor del canvas centrado
    document.querySelector('.canvas-wrapper').classList.remove('hidden');

    // Mostrar el canvas (por si tiene clases adicionales)
    const canvas = document.getElementById('puzzleCanvas');
    canvas.classList.remove('canvas-hidden');
    canvas.classList.add('canvas-visible');
};

// ------------------------------------------------------------------------------------------------
//                                  método que lanza el juego 
// ------------------------------------------------------------------------------------------------
export const iniciarJuego = (imagenSrc, nivel, dificultad, tiempo) => {
    mostrarCanvas(); // 👈 Prepara la vista
    iniciarCronometro(); // ⏱️ ¡Arranca el tiempo!

    const canvas = document.getElementById('puzzleCanvas');

    // Inicializa el puzzle con rotaciones aleatorias
    inicializarRotacion(canvas, imagenSrc, nivel);

    // Activa la interacción por clic izquierdo/derecho
    activarRotacionInteractiva(canvas);
};

// ------------------------------------------------------------------------------------------------
//                      método que verifica si están las piezas correctas
// ------------------------------------------------------------------------------------------------
const verificarBtn = document.getElementById('verificarBtn');
if (verificarBtn) {
    verificarBtn.addEventListener('click', () => {
        if (verificarPuzzleResuelto()) {
            detenerCronometro(); // ⏹️ Detiene el tiempo
            alert("🎉 ¡Puzzle resuelto correctamente!");
        } else {
            alert("❌ Algunas piezas están mal orientadas.");
        }
    });
}


