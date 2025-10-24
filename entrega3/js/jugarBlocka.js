console.log("✅ jugarBlocka.js cargado");

// se importan los métodos de la clase rotacionPiezas.js
import { inicializarRotacion, activarRotacionInteractiva, verificarPuzzleResuelto, corregirUnaPiezaIncorrecta } from './rotacionPiezas.js';
// se importan los métodos de la clase cronometro.js
import { iniciarCronometro, detenerCronometro, penalizarTiempo } from './cronometro.js';
//import{ startRandomSelection} from './blocka.js'

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
    const popover = document.getElementById('id-popover');
    const reintentarBlocka = document.getElementById('reintentar-blocka');
    const inicioBlocka = document.getElementById('inicio-blocka'); // Se mantiene comentado o se usa si es necesario

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
    popover.style.display='none';


    // **CORRECCIÓN CLAVE 1: Limpiar Listener anterior y usar una función anónima**
    // Si ya existe un listener del popover, lo quitamos para evitar múltiples llamadas
    const oldListener = reintentarBlocka.onclick;
    if (oldListener) {
        reintentarBlocka.removeEventListener('click', oldListener);
    }
    
    // Función que se llamará al agotar el tiempo
    const onTiempoAgotado = () => {
        // Detiene el cronómetro (aunque ya debería estar detenido por el if interno de cronometro.js)
        // clearInterval(intervaloCronometro) se llama dentro de iniciarCronometro.

        popover.style.display = 'flex'; // Muestra el popover de "Tiempo Agotado"
        verificarBtn.disabled=true;
        ayudaPiezaFija.disabled=true;
        canvas.style.pointerEvents='none';
        canvas.style.opacity="0.3";
        

        // **CORRECCIÓN CLAVE 2: Pasar una función que LLAMA a iniciarJuego (Closure)**
        // Esto asegura que se inicie un nuevo juego al hacer clic
        const nuevoJuegoListener = () => {
            reiniciarJuegoCompleto();
            iniciarJuego(imagenSrc, nivel, dificultad, tiempo);
            verificarBtn.disabled= false;
            ayudaPiezaFija.disabled=false;
            canvas.style.pointerEvents='auto';
            canvas.style.opacity="1";
            // Es buena práctica reiniciar la vista antes de iniciar un nuevo juego
            
            
        };

        // Asigna la función (el listener)
        reintentarBlocka.addEventListener('click', nuevoJuegoListener, { once: true });
        
        // Si tienes el botón 'inicioBlocka' también, lo puedes manejar aquí:
        if (inicioBlocka) {
             inicioBlocka.addEventListener('click', () => {
                 location.reload();
             }, { once: true });
        }
    };


    iniciarCronometro(tiempo, onTiempoAgotado);


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
                exito();//aca pongo la funcion de exito

                setTimeout(() => {
                    location.reload();
                   // alert("🎉 Matías... ¡Puzzle resuelto correctamente!");
                    //location.reload();
               }, 3000);
             
            });
        }else {
            // aca un método que ubique una pieza (que está mal) en su posición correcta (poniendo un recuadro verde a la pieza)
            // y no la deje clickear ( como ya está bien ubicada que no la deje rotar)
            //corregirUnaPiezaIncorrecta();
           // penalizarTiempo(multa); // penaliza 10/20/30 segundos en el cronómetro según nivel
           // mostrarPenalizacionVisual(multa);
            alert("❌ Matías... Algunas piezas están mal orientadas.");
        }
    });
}
// no funciona se rompe revisar !!!!!!!!!
//agrego funcionalidad ayuditas fijar pieza
const ayudaPiezaFija= document.getElementById('ayudaPiezaFija');

if(ayudaPiezaFija){
    ayudaPiezaFija.addEventListener('click',()=>{
        corregirUnaPiezaIncorrecta();
        penalizarTiempo(multa);
        mostrarPenalizacionVisual(multa);
    })
}




// ------------------------------------------------------------------------------------------------
//                método que oculta el CANVAS y muestra la selección de imágenes
// ------------------------------------------------------------------------------------------------
export const reiniciarJuegoCompleto = () => {
    /*const canvasWrapper = document.querySelector('.canvas-wrapper');
    const canvas = document.getElementById('puzzleCanvas');
    canvasWrapper.classList.add('hidden');
    canvas.classList.remove('canvas-visible');
    canvas.classList.add('canvas-hidden');

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const winnerDisplay = document.getElementById('winner-display');
    winnerDisplay.classList.remove('visible');
    winnerDisplay.innerHTML = '';
*/
    document.querySelector('.game-preview-blocka').classList.remove('hidden');
    document.querySelector('.game-btn-settings').classList.remove('hidden');
    document.querySelector('.game-settings-menu').classList.remove('hidden');
    document.querySelector('.game-btnPlay').classList.remove('hidden');

    const playButton = document.querySelector('.game-btnPlay');
    playButton.disabled = false;
};

//empieza confeti
// --- Tu Función de Éxito (Disparador) --- linea 135
function exito() {
    const cantidadConfeti = 80; // Número óptimo para un buen efecto sin sobrecargar
    for (let i = 0; i < cantidadConfeti; i++) {
        crearConfeti();
    }
}

// --- Lógica de Creación y Animación Individual ---
function crearConfeti() {
    const pieza = document.createElement('div');
    const container = document.getElementById('confeti-container');
    
    // Asignación de clases y color aleatorio (menos código que un switch/if)
    const colores = ['c1', 'c2', 'c3'];
    pieza.classList.add('confeti-pieza', colores[Math.floor(Math.random() * colores.length)]);

    // Posición inicial horizontal aleatoria DENTRO del contenedor (0% a 100% del 25vw)
    pieza.style.left = Math.random() * 100 + '%'; 

    // --- Generación de Variables Aleatorias (La Explosión y Movimiento Diagonal) ---

    // 1. Destino X: Rango amplio para explosión diagonal (-600px a +600px)
    const destinoX = (Math.random() - 0.5) * 1200; 
    
    // 2. Rotación Z y Y: Giros aleatorios (-1000deg a +1000deg)
    const rotacionZ = (Math.random() - 0.5) * 2000; 
    const rotacionY = (Math.random() - 0.5) * 2000;

    // 3. Duración y Retraso: Para simular diferentes velocidades de caída
    const duracion = Math.random() * 3 + 4; // 4s a 7s
    const retraso = Math.random() * 0.5;    // 0s a 0.5s

    // --- Aplicación de Estilos y Variables al Elemento ---
    pieza.style.animationName = 'caída-aleatoria';
    pieza.style.animationDuration = duracion + 's';
    pieza.style.animationDelay = retraso + 's';
    pieza.style.animationFillMode = 'forwards';

    // Inyectar las variables aleatorias al CSS Keyframe
    pieza.style.setProperty('--end-x', destinoX + 'px');
    pieza.style.setProperty('--end-rotate-z', rotacionZ + 'deg');
    pieza.style.setProperty('--end-rotate-y', rotacionY + 'deg');
    
    container.appendChild(pieza);

    // --- Limpieza (Optimización Crucial) ---
    // Eliminar la pieza del DOM cuando su animación termine
    pieza.addEventListener('animationend', () => {
        pieza.remove();
    });
}
//termina confeti

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