console.log("✅ rotacionPiezas.js cargado");

let piezasEstado = [];
let imagen = null;
let ctx = null;
let piezaSize = 0;
let lado = 0;

let imagenOriginalSrc = null;

// Inicializa el estado de las piezas y dibuja el puzzle con rotaciones aleatorias
export const inicializarRotacion = (canvas, imagenSrc, nivel, dificultad) => {
    // Configura el canvas
    ctx = canvas.getContext('2d');
    imagen = new Image();
    imagen.src = imagenSrc;
    // Guardar la imagen original para futuras referencias
    imagenOriginalSrc = imagenSrc;
    const piezas = parseInt(nivel);
    lado = Math.sqrt(piezas);
    piezaSize = canvas.width / lado;
    piezasEstado = [];
    // Cuando la imagen se carga, inicializa las piezas con rotaciones aleatorias
    imagen.onload = () => {
        // Aplica filtro de principiantes si la dificultad es "principiante"
        if (dificultad === "principiante") {
            const srcFiltrada = aplicarFiltroPrincipiante(imagen);
            imagen = new Image();
            imagen.src = srcFiltrada;
        }
        // Aplica filtro de gris si la dificultad es "normal"
        if (dificultad === "normal") {
            const srcFiltrada = aplicarFiltroGris(imagen);
            imagen = new Image(); // ← actualiza la imagen global
            imagen.src = srcFiltrada;
        }
        // Aplica filtro de brillo si la dificultad es "intermedio"
        if (dificultad === "intermedio") {
            const srcFiltrada = aplicarFiltroBrillo(imagen);
            imagen = new Image();
            imagen.src = srcFiltrada;
        }
        // Aplica filtro de negativo si la dificultad es "experto"
        if (dificultad === "experto") {
            const srcFiltrada = aplicarFiltroNegativo(imagen);
            imagen = new Image();
            imagen.src = srcFiltrada;
        }
                // Dibuja la imagen completa inicialmente
        imagen.onload = () => {
            for (let fila = 0; fila < lado; fila++) {
                for (let col = 0; col < lado; col++) {
                    const angulos = [90, 180, 270];
                    const rotacion = angulos[Math.floor(Math.random() * angulos.length)];
                    // Guarda el estado de cada pieza
                    piezasEstado.push({ fila, col, rotacion });
                    dibujarPieza(fila, col, rotacion);
                }
            }
        };    
        console.log(`🧩 Puzzle inicializado con ${lado}x${lado} piezas rotadas`);
    };
};

// Dibuja una pieza en su posición con la rotación dada
function dibujarPieza(fila, col, rotacion) {
    // Calcula las coordenadas de la pieza en la imagen original
    const sx = col * (imagen.width / lado);
    const sy = fila * (imagen.height / lado);
    const sw = imagen.width / lado;
    const sh = imagen.height / lado;
    // Calcula las coordenadas y tamaño en el canvas
    const dx = col * piezaSize;
    const dy = fila * piezaSize;
    const dw = piezaSize;
    const dh = piezaSize;
    // Dibuja la pieza rotada en el canvas
    ctx.save();
    ctx.clearRect(dx, dy, dw, dh);
    ctx.translate(dx + dw / 2, dy + dh / 2);
    ctx.rotate((Math.PI / 180) * rotacion);
    ctx.drawImage(imagen, sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
}

// Maneja clics izquierdo y derecho para rotar piezas
export const activarRotacionInteractiva = (canvas) => {
    // Clic izquierdo para rotar a la izquierda (-90 grados)
    canvas.addEventListener('click', (e) => {
        const { fila, col } = obtenerPiezaClickeada(e, canvas);
        rotarPieza(fila, col, -90); // izquierda
    });
    // Clic derecho para rotar a la derecha (+90 grados)
    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const { fila, col } = obtenerPiezaClickeada(e, canvas);
        rotarPieza(fila, col, 90); // derecha
    });
};

// Calcula qué pieza fue clickeada
function obtenerPiezaClickeada(e, canvas) {
    // recibe el evento y el canvas
    // obtiene las coordenadas del clic relativo al canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // calcula la fila y columna de la pieza clickeada
    const col = Math.floor(x / piezaSize);
    const fila = Math.floor(y / piezaSize);
    // retorna la fila y columna de la pieza clickeada
    return { fila, col };
}

// Actualiza la rotación de una pieza y la redibuja
function rotarPieza(fila, col, deltaAngulo) {
    const pieza = piezasEstado.find(p => p.fila === fila && p.col === col);
    if (!pieza) return;
    // Actualiza la rotación de la pieza (0, 90, 180, 270)
    pieza.rotacion = (pieza.rotacion + deltaAngulo + 360) % 360;
    dibujarPieza(fila, col, pieza.rotacion);
}

// Verifica si todas las piezas están correctamente orientadas
export const verificarPuzzleResuelto = () => {
    const todasCorrectas = piezasEstado.every(p => p.rotacion === 0);
    return todasCorrectas;
};

// método que sirve para restaurar la imagen original sin filtros
export const mostrarImagenOriginal = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imgFinal = new Image();
    imgFinal.src = imagenOriginalSrc;
    imgFinal.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imgFinal, 0, 0, canvas.width, canvas.height);
    };
};

// Aplica un filtro personalizado para principiantes (aquí podés definir lo que quieras)
function aplicarFiltroPrincipiante(imagen) {
    // Crea un canvas auxiliar para procesar la imagen
    const auxCanvas = document.createElement('canvas');
    auxCanvas.width = imagen.width;
    auxCanvas.height = imagen.height;
    const auxCtx = auxCanvas.getContext('2d');
    // Dibuja la imagen en el canvas auxiliar
    auxCtx.drawImage(imagen, 0, 0);
    const imageData = auxCtx.getImageData(0, 0, imagen.width, imagen.height);
    const data = imageData.data;
    // Aplica un filtro personalizado (aquí podés definir lo que quieras)
    for (let i = 0; i < data.length; i += 4) {
        // R = data[i]
        // G = data[i + 1]
        // B = data[i + 2]
        // A = data[i + 3]

        // Ejemplo: aumentar rojo un poco (descomentar si querés probar)
        // data[i] = Math.min(255, data[i] + 20);

        // Ejemplo: reducir verde (descomentar si querés probar)
        // data[i + 1] = Math.max(0, data[i + 1] - 30);

        // Ejemplo: invertir azul (descomentar si querés probar)
        // data[i + 2] = 255 - data[i + 2];
    }
    // Actualiza el canvas auxiliar con los datos modificados
    auxCtx.putImageData(imageData, 0, 0);
    return auxCanvas.toDataURL();
}

// Aplica un filtro de gris a la imagen dada y devuelve una nueva imagen en base64
function aplicarFiltroGris(imagen) {
    // Crea un canvas auxiliar para procesar la imagen
    const auxCanvas = document.createElement('canvas');
    auxCanvas.width = imagen.width;
    auxCanvas.height = imagen.height;
    const auxCtx = auxCanvas.getContext('2d');
    // Dibuja la imagen en el canvas auxiliar
    auxCtx.drawImage(imagen, 0, 0);
    const imageData = auxCtx.getImageData(0, 0, imagen.width, imagen.height);
    const data = imageData.data;
    // Aplica el filtro de gris
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gris = 0.3 * r + 0.59 * g + 0.11 * b;
        data[i] = data[i + 1] = data[i + 2] = gris;
        // Alpha (data[i + 3]) se mantiene igual - El canal Alpha controla la transparencia.
    }
    // Actualiza el canvas auxiliar con los datos modificados
    auxCtx.putImageData(imageData, 0, 0);
    return auxCanvas.toDataURL();
}

// Aplica un filtro de brillo a la imagen dada y devuelve una nueva imagen en base64
function aplicarFiltroBrillo(imagen) {
    // Crea un canvas auxiliar para procesar la imagen
    const auxCanvas = document.createElement('canvas');
    auxCanvas.width = imagen.width;
    auxCanvas.height = imagen.height;
    const auxCtx = auxCanvas.getContext('2d');
    // Dibuja la imagen en el canvas auxiliar
    auxCtx.drawImage(imagen, 0, 0);
    const imageData = auxCtx.getImageData(0, 0, imagen.width, imagen.height);
    const data = imageData.data;
    // Aplica el filtro de brillo (aumenta el brillo en un 30%)
    for (let i = 0; i < data.length; i += 4) {
        data[i]     = Math.min(255, data[i] * 1.3);     // R
        data[i + 1] = Math.min(255, data[i + 1] * 1.3); // G
        data[i + 2] = Math.min(255, data[i + 2] * 1.3); // B
        // Alpha (data[i + 3]) se mantiene igual - El canal Alpha controla la transparencia.
    }
    // Actualiza el canvas auxiliar con los datos modificados
    auxCtx.putImageData(imageData, 0, 0);
    return auxCanvas.toDataURL();
}

// Aplica un filtro de negativo a la imagen dada y devuelve una nueva imagen en base64
function aplicarFiltroNegativo(imagen) {
    // Crea un canvas auxiliar para procesar la imagen
    const auxCanvas = document.createElement('canvas');
    auxCanvas.width = imagen.width;
    auxCanvas.height = imagen.height;
    const auxCtx = auxCanvas.getContext('2d');
    // Dibuja la imagen en el canvas auxiliar
    auxCtx.drawImage(imagen, 0, 0);
    const imageData = auxCtx.getImageData(0, 0, imagen.width, imagen.height);
    const data = imageData.data;
    // Aplica el filtro de negativo
    for (let i = 0; i < data.length; i += 4) {
        data[i]     = 255 - data[i];     // R
        data[i + 1] = 255 - data[i + 1]; // G
        data[i + 2] = 255 - data[i + 2]; // B
        // Alpha se mantiene igual - El canal Alpha controla la transparencia.
    }
    // Actualiza el canvas auxiliar con los datos modificados
    auxCtx.putImageData(imageData, 0, 0);
    return auxCanvas.toDataURL();
}




// ------------------------------------------------------------------------------------------------