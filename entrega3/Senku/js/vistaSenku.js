console.log("✅ vistaSenku.js cargado");

// ----------------------------------------------------------------------------------------------------------
// ------------------------------ Funciones de Ayuda para Dibujar sobre el Canvas ---------------------------
// ----------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------
//                método que muestra visualmente la penalización de tiempo
// ------------------------------------------------------------------------------------------------
export function mostrarPenalizacionVisual() {
    const cronometroEl = document.getElementById('cronometro');
    if (!cronometroEl) return;
    // Efecto flotante de penalización
    const rect = cronometroEl.getBoundingClientRect();
    const penalizacionEl = document.createElement('div');
    penalizacionEl.textContent = 'Sin Tiempo';
    penalizacionEl.className = 'penalizacion';
    // Posicionamos cerca del cronómetro
    penalizacionEl.style.position = 'fixed';
    penalizacionEl.style.top = `${rect.top - 20}px`;// un poco arriba
    penalizacionEl.style.left = `${rect.left + 20}px`;// ligeramente desplazado
    penalizacionEl.style.zIndex = '199';
    document.body.appendChild(penalizacionEl);
    setTimeout(() => penalizacionEl.remove(), 3000);
    // Efecto de sacudida en el cronómetro
    cronometroEl.classList.add('shake');
    setTimeout(() => cronometroEl.classList.remove('shake'), 400);
}

// ------------------------------------------------------------------------------------------------
//                método que muestra efecto de victoria con manitos
// ------------------------------------------------------------------------------------------------
export function mostrarVictoriaConManitos() {
    const contenedor = document.createElement('div');
    contenedor.id = "victoriaEffect";
    document.body.appendChild(contenedor);
    // crear múltiples imágenes de manitos subiendo
    for (let i = 0; i < 20; i++) {
        const mano = document.createElement('img');
        mano.src = "./Senku/img/pulgar_arriba.png";
        mano.className = "manoVictoria";
        mano.style.left = `${Math.random() * 90}%`;
        mano.style.bottom = `-60px`;
        contenedor.appendChild(mano);
        // Animación subida
        setTimeout(() => {
            mano.style.bottom = "100vh";
        }, i * 100);
    }
}

// ------------------------------------------------------------------------------------------------
//                método que muestra efecto de derrota con manitos
// ------------------------------------------------------------------------------------------------
export function mostrarDerrotaConManitos() {
    const contenedor = document.createElement('div');
    contenedor.id = "derrotaEffect";
    document.body.appendChild(contenedor);
    // Crear múltiples imágenes de manitos cayendo
    for (let i = 0; i < 20; i++) {
        const mano = document.createElement('img');
        mano.src = "./Senku/img/pulgar_abajo.png";
        mano.className = "manoDerrota";
        mano.style.left = `${Math.random() * 90}%`;
        mano.style.top = `-60px`;
        contenedor.appendChild(mano);
        // Animación caída
        setTimeout(() => {
            mano.style.top = "100vh";
        }, i * 100);
    }
}

// ------------------------------------------------------------------------------------------------
//                                                                                  empieza confeti
// ------------------------------------------------------------------------------------------------
// --- Tu Función de Éxito (Disparador) --- linea 135
export function exito() {
    // Número óptimo para un buen efecto sin sobrecargar el DOM es 100 papelitos
    const cantidadConfeti = 200; 
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
    // -------------- Generación de Variables Aleatorias (La Explosión y Movimiento Diagonal) ---
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
    // --- Añadir al Contenedor ---
    container.appendChild(pieza);
    // --- Limpieza (Optimización Crucial) ---
    // Eliminar la pieza del DOM cuando su animación termine
    pieza.addEventListener('animationend', () => {
        pieza.remove();
    });
}
//                                                                                            termina confeti
// ------------------------------------------------------------------------------------------ FIn -----------