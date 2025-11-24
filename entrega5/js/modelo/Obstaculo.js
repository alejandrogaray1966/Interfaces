export class Obstaculo {
    constructor(ruta, xInicial, canvasHeight) {
        this.img = new Image();
        this.img.src = ruta;
        
        // Asumiendo que el obstáculo es un cuadrado o un rectángulo simple.
        this.ancho = 130; // Ancho del obstáculo
        this.alto = 130;  // Alto del obstáculo
        
        this.x = xInicial;
        this.velocidadBase = 2.5; // Ajusta la velocidad para el scroll (un poco más rápido)
        //Velocidad extra aleatoria para variación
        this.velocidadExtra = Math.random() * 0.5 + 0.1; // 0.1 a 0.6
        this.velocidad = this.velocidadBase + this.velocidadExtra; // Velocidad total


        // Posición Y aleatoria: 
        // Aparece en una posición aleatoria entre el techo (0) y el piso (canvasHeight - alto del obstáculo).
        // Restamos el alto del obstáculo y un margen de 20px para evitar el borde exacto.
        const margen = 20;
        const rangoY = canvasHeight - this.alto - 2 * margen;
        this.yInicial = Math.floor(Math.random() * rangoY) + margen;
        this.y = this.yInicial;

        // Propiedades para movimiento sinusoidal (dificultad avanzada)
        this.amplitud = Math.random() * 25; // 0 a 25px de movimiento vertical
        this.frecuencia = Math.random() * 0.03 + 0.01; // Velocidad del ciclo
        this.fase = Math.random() * 2 * Math.PI; // Fase inicial aleatoria
    }

   // Recibe el tiempo global para el movimiento complejo
   actualizar(canvasWidth = 422, tiempoJuego) { 
    // Movimiento horizontal (scroll lineal)
    this.x -= this.velocidad;

    // Movimiento vertical sinusoidal para complejidad
    if (this.amplitud > 5) { // Solo si tiene amplitud suficiente para que se note
        // Usamos el tiempo de juego para un movimiento sincronizado y suave
        this.y = this.yInicial + this.amplitud * Math.sin(tiempoJuego * this.frecuencia + this.fase);
    }

    // Si el obstáculo sale de la pantalla, devuelve true (se elimina/recicla)
    if (this.x < -this.ancho) {
        return true; 
    }
    return false;
}

    dibujar(ctx) {
        if (!this.img.complete) return;

        ctx.drawImage(
            this.img,
            this.x, this.y, 
            this.ancho, this.alto
        );

        // Dibujar la caja de colisión del obstáculo
        const box = this.getColisionBox();
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.w, box.h);
    }
    
    // Devuelve la caja de colisión para la detección.
    getColisionBox() {
        return {
            x: this.x+30,
            y: this.y+30,
            w: this.ancho-60,
            h: this.alto-60
        };
    }

    colisiona(pajaro) {
        const pajaroBox = pajaro.getColisionBox();
        const obstaculoBox = this.getColisionBox();

        // Chequeo de colisión AABB (Axis-Aligned Bounding Box)
        if (pajaroBox.x < obstaculoBox.x + obstaculoBox.w &&
            pajaroBox.x + pajaroBox.w > obstaculoBox.x &&
            pajaroBox.y < obstaculoBox.y + obstaculoBox.h &&
            pajaroBox.y + pajaroBox.h > obstaculoBox.y) {
            return true;
        }
        return false;
    }
}