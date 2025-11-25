export function toggleSettingsMenu() {
    const settingsMenu = document.querySelector('.game-settings-menu');
    
    if (settingsMenu) {
        settingsMenu.classList.toggle('hidden');
        console.log("Menú de configuración toggled. Estado 'hidden':", settingsMenu.classList.contains('hidden'));
        return !settingsMenu.classList.contains('hidden');
    } else {
        console.error("Error: No se encontró el menú de configuración con el selector '.game-settings-menu'.");
        return false;
    }
}
export function bloquearBotones(bloquear) {
    // Nota: El botón de Play se gestiona generalmente con la propiedad .disabled
    // pero aquí usaremos el enfoque de 'pointer-events' que tenías para Configuración
    // para ambos, y la clase 'playing' para el de Jugar.

    const playButton = document.querySelector('.game-btnPlay');
    // IMPORTANTE: Asegúrate de que este selector sea correcto si el botón no es la ruedita misma
    const settingsButton = document.querySelector('.game-btn-settings button') || 
                           document.querySelector('.game-btn-settings'); // Intenta con el contenedor si no hay <button> dentro

    if (playButton) {
        if (bloquear) {
            playButton.classList.add('playing'); // Agrego la clase que usas
            playButton.style.pointerEvents = 'none';
            playButton.style.opacity = '0.6';
        } else {
            playButton.classList.remove('playing');
            playButton.style.pointerEvents = 'auto';
            playButton.style.opacity = '1';
        }
    }

    if (settingsButton) {
        settingsButton.style.pointerEvents = bloquear ? 'none' : 'auto';
        settingsButton.style.opacity = bloquear ? '0.6' : '1';
    } else {
         console.warn("Advertencia: No se encontró el botón/contenedor de configuración.");
    }

    if (bloquear) {
        console.log("Botones principales Bloqueados.");
    } else {
        console.log("Botones principales Desbloqueados.");
    }
}






/**
 * =================================================================
 * FUNCIONES DE RANKING
 * =================================================================
 * (Extraídas y adaptadas de jugarBlocka.js)
 */

// ⚠️ IMPORTANTE: Esta variable debe ser global para todo el proyecto si quieres mantener 
// el estado del ranking durante la sesión. Si usas localStorage, se inicializará desde allí.
// Aquí la inicializamos con los valores por defecto que tenías.
export let rankingJugadores = [
    { nombre: 'Fabricio', fichaAcumulada: 1105 },
    { nombre: 'Belén', fichaAcumulada: 940 },
    { nombre: 'Pamela', fichaAcumulada: 760 },
    { nombre: 'Soledad', fichaAcumulada: 730 },
    { nombre: 'Alejandro', fichaAcumulada: 710 }
]; 
// Ordenamos el ranking una vez (por si acaso no lo está)
rankingJugadores.sort((a, b) => b.fichaAcumulada - a.fichaAcumulada); 

//Muestra los datos del ranking del juego en el contenedor especificado.
export function mostrarRanking(ranking) {
    // ⚠️ Se asume que el contenedor del ranking en tu HTML tiene el ID 'rankingList'
    const rankingContainer = document.getElementById('rankingList');
    if (!rankingContainer) {
        console.error("Error: Contenedor de ranking (id='rankingList') no encontrado.");
        return;
    }
    
    let htmlContent = ''; // Variable para acumular el HTML de la lista

    // USAMOS BUCLE FOR EN LUGAR DE .MAP()
    for (let index = 0; index < ranking.length; index++) {
        const jugador = ranking[index];
        // Ejemplo de clase de destaque (si el nombre es 'Matías', por ejemplo)
        const nombreClase = jugador.nombre === 'Matías' ? 'destacado' : '';
        
        // Concatenamos el fragmento HTML a la variable
        htmlContent += `
            <li class="ranking-item ${nombreClase}">
                <span class="ranking-nombre">${jugador.nombre}</span>
                <p class="ranking-ficha">${jugador.fichaAcumulada}</p>
            </li>
        `;
    }

    // Insertamos todo el HTML acumulado de una sola vez
    rankingContainer.innerHTML = htmlContent;
}

export function actualizarRanking(nombre, totalFicha) {

    //  Agregar el nuevo puntaje
    rankingJugadores.push({ nombre, fichaAcumulada: totalFicha });

    //  Ordenar de menor a mayor tiempo
    rankingJugadores.sort((a, b) => b.fichaAcumulada - a.fichaAcumulada);

    // Limitar a 6 jugadores (o el número que desees)
    if (rankingJugadores.length > 6) {
        rankingJugadores = rankingJugadores.slice(0, 6);
    }

    // Mostrar ranking actualizado
    mostrarRanking(rankingJugadores);
    
}

let confetiActivo = [];

export function startConfetti() {
    const cantidadConfeti = 80; // Número óptimo
    for (let i = 0; i < cantidadConfeti; i++) {
        crearConfeti();
    }
}

export function stopConfetti() {
    confetiActivo.forEach(pieza => pieza.remove());
    confetiActivo = [];
}


function crearConfeti() {
    const pieza = document.createElement('div');
    const container = document.getElementById('confeti-container');
    
    if (!container) {
        console.error("Error: Contenedor de confeti (id='confeti-container') no encontrado.");
        return;
    }
    
    // Asignación de clases y color aleatorio
    const colores = ['c1', 'c2', 'c3'];
    pieza.classList.add('confeti-pieza', colores[Math.floor(Math.random() * colores.length)]);

    // Posición inicial y variables aleatorias (rotación, destino)
    pieza.style.left = Math.random() * 100 + '%'; 
    const destinoX = (Math.random() - 0.5) * 1200; 
    const rotacionZ = (Math.random() - 0.5) * 2000; 
    const rotacionY = (Math.random() - 0.5) * 2000;
    const duracion = Math.random() * 3 + 4; // 4s a 7s
    const retraso = Math.random() * 0.5;    // 0s a 0.5s

    // Aplicación de Estilos y Variables
    pieza.style.animationName = 'caída-aleatoria';
    pieza.style.animationDuration = duracion + 's';
    pieza.style.animationDelay = retraso + 's';
    pieza.style.animationFillMode = 'forwards';

    // Inyectar las variables aleatorias al CSS Keyframe (Necesitas tener el CSS asociado)
    pieza.style.setProperty('--end-x', destinoX + 'px');
    pieza.style.setProperty('--end-rotate-z', rotacionZ + 'deg');
    pieza.style.setProperty('--end-rotate-y', rotacionY + 'deg');
    
    container.appendChild(pieza);
    confetiActivo.push(pieza);

    // Limpieza al finalizar la animación
    pieza.addEventListener('animationend', () => {
        pieza.remove();
        // Opcional: limpiar de confetiActivo si es necesario, pero remove() es suficiente.
    });
}


export function mostrarDatosDelJuego(settings) {
    const infoContainer = document.getElementById('gameInfo');
    if (!infoContainer) {
        console.error("Error: Contenedor de información (id='gameInfo') no encontrado.");
        return;
    }
    infoContainer.innerHTML = `
        <li><strong>Nivel:</strong> ${settings.nivel}</li>
        <li><strong>Dificultad:</strong> ${settings.dificultad}</li>
    `;
}

