console.log("✅ jugarBlocka.js cargado");

// jugarBlocka.js

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

    mostrarCanvas(); // 👈 Llamamos al método para preparar la vista

    const canvas = document.getElementById('puzzleCanvas');
    const ctx = canvas.getContext('2d');

    const piezas = parseInt(nivel);
    const lado = Math.sqrt(piezas); // ej: 9 → 3x3
    const piezaSize = canvas.width / lado;

    const imagen = new Image();
    imagen.src = imagenSrc;

    imagen.onload = () => {
        // Dibujar cada pieza en su posición correcta
        for (let fila = 0; fila < lado; fila++) {
            for (let col = 0; col < lado; col++) {
                
                const sx = col * (imagen.width / lado); // origen x en imagen
                const sy = fila * (imagen.height / lado); // origen y en imagen
                const sw = imagen.width / lado; // ancho de recorte
                const sh = imagen.height / lado; // alto de recorte

                const dx = col * piezaSize; // destino x en canvas
                const dy = fila * piezaSize; // destino y en canvas
                const dw = piezaSize;
                const dh = piezaSize;

                // Rotación aleatoria: 90, 180 o 270 grados
                const angulos = [90, 180, 270];
                const angulo = angulos[Math.floor(Math.random() * angulos.length)];
                const rad = (Math.PI / 180) * angulo;

                // Guardar estado del contexto
                ctx.save();

                // Mover el origen al centro de la pieza
                ctx.translate(dx + dw / 2, dy + dh / 2);
                ctx.rotate(rad);

                // Dibujar la pieza centrada en el nuevo origen
                ctx.drawImage(imagen,
                    sx, sy, sw, sh,             // recorte de la imagen
                    -dw / 2, -dh / 2, dw, dh     // destino en canvas (centrado)
                );

                // Restaurar el contexto
                ctx.restore();

            }
        }

        console.log(`🧩 Imagen dividida en ${lado}x${lado} piezas, cada una rotada aleatoriamente`);

    };
};

