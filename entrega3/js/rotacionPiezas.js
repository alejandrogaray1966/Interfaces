console.log("✅ rotacionPiezas.js cargado");

let piezasEstado = [];
let imagen = null;
let ctx = null;
let piezaSize = 0;
let lado = 0;

// Inicializa el estado de las piezas y dibuja el puzzle con rotaciones aleatorias
export const inicializarRotacion = (canvas, imagenSrc, nivel) => {
    ctx = canvas.getContext('2d');
    imagen = new Image();
    imagen.src = imagenSrc;

    const piezas = parseInt(nivel);
    lado = Math.sqrt(piezas);
    piezaSize = canvas.width / lado;
    piezasEstado = [];

    imagen.onload = () => {
        for (let fila = 0; fila < lado; fila++) {
            for (let col = 0; col < lado; col++) {
                const angulos = [90, 180, 270];
                const rotacion = angulos[Math.floor(Math.random() * angulos.length)];

                piezasEstado.push({ fila, col, rotacion });
                dibujarPieza(fila, col, rotacion);
            }
        }
        console.log(`🧩 Puzzle inicializado con ${lado}x${lado} piezas rotadas`);
    };
};

// Dibuja una pieza en su posición con la rotación dada
function dibujarPieza(fila, col, rotacion) {
    const sx = col * (imagen.width / lado);
    const sy = fila * (imagen.height / lado);
    const sw = imagen.width / lado;
    const sh = imagen.height / lado;

    const dx = col * piezaSize;
    const dy = fila * piezaSize;
    const dw = piezaSize;
    const dh = piezaSize;

    ctx.save();
    ctx.clearRect(dx, dy, dw, dh);
    ctx.translate(dx + dw / 2, dy + dh / 2);
    ctx.rotate((Math.PI / 180) * rotacion);
    ctx.drawImage(imagen, sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
}

// Maneja clics izquierdo y derecho para rotar piezas
export const activarRotacionInteractiva = (canvas) => {
    canvas.addEventListener('click', (e) => {
        const { fila, col } = obtenerPiezaClickeada(e, canvas);
        rotarPieza(fila, col, -90); // izquierda
    });

    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const { fila, col } = obtenerPiezaClickeada(e, canvas);
        rotarPieza(fila, col, 90); // derecha
    });
};

// Calcula qué pieza fue clickeada
function obtenerPiezaClickeada(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / piezaSize);
    const fila = Math.floor(y / piezaSize);

    return { fila, col };
}

// Actualiza la rotación de una pieza y la redibuja
function rotarPieza(fila, col, deltaAngulo) {
    const pieza = piezasEstado.find(p => p.fila === fila && p.col === col);
    if (!pieza) return;

    pieza.rotacion = (pieza.rotacion + deltaAngulo + 360) % 360;
    dibujarPieza(fila, col, pieza.rotacion);
}

// Verifica si todas las piezas están correctamente orientadas
export const verificarPuzzleResuelto = () => {
    const todasCorrectas = piezasEstado.every(p => p.rotacion === 0);
    return todasCorrectas;
};
