console.log("✅ jugarBlocka.js cargado");

// se importan los métodos de la clase rotacionPiezas.js
import { inicializarRotacion, activarRotacionInteractiva, verificarPuzzleResuelto, corregirUnaPiezaIncorrecta } from './rotacionPiezas.js';
// se importan los métodos de la clase cronometro.js
import { iniciarCronometro, detenerCronometro, penalizarTiempo } from './cronometro.js';

// 🌍 Definila fuera de iniciarJuego como variables globales
let rankingJugadores = [
    { nombre: 'Fabricio', tiempo: 21 },
    { nombre: 'Belén', tiempo: 34 },
    { nombre: 'Pamela', tiempo: 40 },
    { nombre: 'Soledad', tiempo: 55 },
    { nombre: 'Alejandro', tiempo: 62 }
]; // Constantes del ranking del juego iniciado
let multa = 10; // segundos de penalización según tiempo 

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

    // Constantes del juego iniciado
        const gameSettings = {
                                    nivel: nivel,
                                    dificultad: dificultad,
                                    tiempo: tiempo
                            };

    // 👈 Prepara la vista
    mostrarCanvas(); 
    mostrarDatosDelJuego(gameSettings);
    mostrarRanking(rankingJugadores);

    // ⏱️ ¡Arranca el tiempo!
    multa = tiempo / 3; 


 


    iniciarCronometro(tiempo, () => {
        mostrarDerrotaConManitos();
        // Podés ocultar el canvas, mostrar un mensaje, reiniciar, etc.
        //reiniciarJuegoCompleto(); // no funciona se rompe revisar !!!!!!!!!
        setTimeout(() => {
            alert("⏱️ ¡Tiempo agotado! Matías... has perdido el juego.");
            location.reload();
        }, 4000); // Espera 4 segundos antes de alert + reload
    });
    const canvas = document.getElementById('puzzleCanvas');

    // Inicializa el puzzle con rotaciones aleatorias
    inicializarRotacion(canvas, imagenSrc, nivel, dificultad);

    // Activa la interacción por clic izquierdo/derecho
    activarRotacionInteractiva(canvas);
};

// ------------------------------------------------------------------------------------------------
//            método que muestra los datos del juego iniciado
// ------------------------------------------------------------------------------------------------
function mostrarDatosDelJuego(settings) {
    const infoContainer = document.getElementById('gameInfo');
    infoContainer.innerHTML = `
        <li><strong>Nivel:</strong> ${settings.nivel} Piezas</li>
        <li><strong>Dificultad:</strong> ${settings.dificultad}</li>
        <li><strong>Límite:</strong> ${settings.tiempo} Seg.</li>
    `;
}

// ------------------------------------------------------------------------------------------------
//            método que muestra los datos del ranking del juego iniciado
// ------------------------------------------------------------------------------------------------
function mostrarRanking(ranking) {
    const rankingContainer = document.getElementById('rankingList');
    rankingContainer.innerHTML = ranking.map((jugador, index) => {
        const clase = jugador.nombre === 'Matías' ? 'destacado' : '';
        return `<li><mark>${jugador.nombre}</mark><small>${jugador.tiempo}</small></li>`;
    }).join('');
}

// ------------------------------------------------------------------------------------------------
//                     método para insertar a Matías en la lista del Ranking
// ------------------------------------------------------------------------------------------------
function actualizarRanking(nombre, tiempoFinal) {
    // Agregar a Matías
    rankingJugadores.push({ nombre, tiempo: tiempoFinal });

    // Ordenar de menor a mayor tiempo
    rankingJugadores.sort((a, b) => a.tiempo - b.tiempo);

    // Limitar a 9 jugadores
    if (rankingJugadores.length > 6) {
        rankingJugadores = rankingJugadores.slice(0, 6);
    }

    // Mostrar ranking actualizado
    mostrarRanking(rankingJugadores);
}

// ------------------------------------------------------------------------------------------------
//                      método que verifica si están las piezas correctas
// ------------------------------------------------------------------------------------------------
const verificarBtn = document.getElementById('verificarBtn');
if (verificarBtn) {
    verificarBtn.addEventListener('click', () => {
        if (verificarPuzzleResuelto()) {
           detenerCronometro((tiempoFinal) => {
                actualizarRanking('Matías', tiempoFinal);
                /*mostrarVictoriaConManitos();*/
                setTimeout(() => {
                    alert("🎉 Matías... ¡Puzzle resuelto correctamente!");
                    location.reload();
                }, 1000);
            });
        } else {
            // aca un método que ubique una pieza (que está mal) en su posición correcta (poniendo un recuadro verde a la pieza)
            // y no la deje clickear ( como ya está bien ubicada que no la deje rotar)
            corregirUnaPiezaIncorrecta();
            penalizarTiempo(multa); // penaliza 10/20/30 segundos en el cronómetro según nivel
            mostrarPenalizacionVisual(multa);
            // alert("❌ Matías... Algunas piezas están mal orientadas.");
        }
    });
}

// no funciona se rompe revisar !!!!!!!!!
// ------------------------------------------------------------------------------------------------
//                método que oculta el CANVAS y muestra la selección de imágenes
// ------------------------------------------------------------------------------------------------
export const reiniciarJuegoCompleto = () => {
    const canvasWrapper = document.querySelector('.canvas-wrapper');
    const canvas = document.getElementById('puzzleCanvas');
    canvasWrapper.classList.add('hidden');
    canvas.classList.remove('canvas-visible');
    canvas.classList.add('canvas-hidden');

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const winnerDisplay = document.getElementById('winner-display');
    winnerDisplay.classList.remove('visible');
    winnerDisplay.innerHTML = '';

    document.querySelector('.game-preview-blocka').classList.remove('hidden');
    document.querySelector('.game-btn-settings').classList.remove('hidden');
    document.querySelector('.game-settings-menu').classList.remove('hidden');
    document.querySelector('.game-btnPlay').classList.remove('hidden');

    const playButton = document.querySelector('.game-btnPlay');
    playButton.disabled = false;
};

// ------------------------------------------------------------------------------------------------
//                método que muestra efecto de derrota con manitos
// ------------------------------------------------------------------------------------------------
/*function mostrarDerrotaConManitos() {
    const contenedor = document.createElement('div');
    contenedor.id = "derrotaEffect";
    document.body.appendChild(contenedor);
    // Crear múltiples imágenes de manitos cayendo
    for (let i = 0; i < 20; i++) {
        const mano = document.createElement('img');
        mano.src = "./assets/Thumbs down.png";
        mano.className = "manoDerrota";
        mano.style.left = `${Math.random() * 90}%`;
        mano.style.top = `-60px`;
        contenedor.appendChild(mano);
        // Animación caída
        setTimeout(() => {
            mano.style.top = "100vh";
        }, i * 200);
    }
}*/

// ------------------------------------------------------------------------------------------------
//                método que muestra efecto de victoria con manitos
// ------------------------------------------------------------------------------------------------
/*function mostrarVictoriaConManitos() {
    const contenedor = document.createElement('div');
    contenedor.id = "victoriaEffect";
    contenedor.style.display = 'flex';
    contenedor.style.justifyContent = 'center';

    document.body.appendChild(contenedor);
    // crear múltiples imágenes de manitos subiendo
    for (let i = 0; i < 1210; i++) {
        const mano = document.createElement('img');
        mano.src = "./assets/Thumbs up.png";
        mano.className = "manoVictoria";
        mano.style.left = `${Math.random() * 60}%`;
        mano.style.bottom = '-60px';
        contenedor.appendChild(mano);
        // Animación subida
        setTimeout(() => {
            mano.style.bottom = "100vh";
        }, i * 200);
    }
}*/

// ------------------------------------------------------------------------------------------------
//                método que muestra visualmente la penalización de tiempo
// ------------------------------------------------------------------------------------------------
function mostrarPenalizacionVisual(segundos) {
    const cronometroEl = document.getElementById('cronometro');
    if (!cronometroEl) return;

    // Efecto flotante de penalización
    const rect = cronometroEl.getBoundingClientRect();
    const penalizacionEl = document.createElement('div');
    penalizacionEl.textContent = `+${segundos}s`;
    penalizacionEl.className = 'penalizacion';
    // Posicionamos cerca del cronómetro
    penalizacionEl.style.position = 'fixed';
    penalizacionEl.style.top = `${rect.top - 20}px`;// un poco arriba
    penalizacionEl.style.left = `${rect.left + 120}px`;// ligeramente desplazado
    penalizacionEl.style.zIndex = '199';
    document.body.appendChild(penalizacionEl);
    setTimeout(() => penalizacionEl.remove(), 3000);

    // Efecto de sacudida en el cronómetro
    cronometroEl.classList.add('shake');
    setTimeout(() => cronometroEl.classList.remove('shake'), 400);
}