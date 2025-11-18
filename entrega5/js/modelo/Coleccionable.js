export class Coleccionable {
    constructor(ruta, xInicial, canvasHeight) {
        this.img = new Image();
        this.img.src = ruta;
        
        // El coleccionable puede ser más pequeño que el obstáculo
        this.ancho = 50; 
        this.alto = 50;
        
        this.x = xInicial;
        // La velocidad debe coincidir con la velocidad de scroll de los obstáculos.
        this.velocidad = Math.random() * 0.5 + 2.6; // Valor similar al Obstaculo

        // Posición Y aleatoria, similar al obstáculo
        const margen = 50;
        const rangoY = canvasHeight - this.alto - 2 * margen;
        this.yInicial = Math.floor(Math.random() * rangoY) + margen;
        this.y = this.yInicial;

        // Propiedades de animación/efecto visual (ej: brillo/rotación)
        this.tiempoInicio = Date.now(); 
    }

    actualizar(tiempoJuego) { 
        // Movimiento horizontal (scroll lineal)
        this.x -= this.velocidad;

        // Efecto de flotación suave (usando tiempo de juego para sincronización)
        const offset = Math.sin(tiempoJuego * 0.1) * 5; // Flota 5px arriba y abajo
        this.y = this.yInicial + offset; 

        // Si sale de la pantalla, devuelve true (se elimina/recicla)
        if (this.x < -this.ancho) {
            return true; 
        }
        return false;
    }

    dibujar(ctx) {
        if (!this.img.complete) return;
        
        // Opcional: Implementar una animación de rotación en el canvas
        ctx.save();
        
        // Mover el punto de referencia al centro del coleccionable
        const centerX = this.x + this.ancho / 2;
        const centerY = this.y + this.alto / 2;
        ctx.translate(centerX, centerY);
        
        // Rotar basado en el tiempo para un efecto de 'brillo' o giro
        const rotacion = (Date.now() - this.tiempoInicio) / 2000; // Un giro lento
        ctx.rotate(rotacion); 

        // Dibujar la imagen centrada después de la rotación
        ctx.drawImage(
            this.img,
            -this.ancho / 2, -this.alto / 2, // Dibuja desde el punto central
            this.ancho, this.alto
        );
        
        ctx.restore(); // Restaura el contexto para no afectar otros dibujos
    }
    
    // Devuelve la caja de colisión para la detección.
    getColisionBox() {
        // Reducimos la caja para hacer la recolección más justa
        return {
            x: this.x + 10,
            y: this.y + 10,
            w: this.ancho - 20,
            h: this.alto - 20
        };
    }

    colisiona(pajaro) {
        const pajaroBox = pajaro.getColisionBox();
        const coleccionableBox = this.getColisionBox();

        // Chequeo de colisión AABB (Axis-Aligned Bounding Box)
        if (pajaroBox.x < coleccionableBox.x + coleccionableBox.w &&
            pajaroBox.x + pajaroBox.w > coleccionableBox.x &&
            pajaroBox.y < coleccionableBox.y + coleccionableBox.h &&
            pajaroBox.y + pajaroBox.h > coleccionableBox.y) {
            return true;
        }
        return false;
    }
}