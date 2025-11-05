// Modelo/Ficha.js

export class Ficha {
    /**
     * @param {number} fila - Fila actual (0-6).
     * @param {number} columna - Columna actual (0-6).
     * @param {string} color - Color hexadecimal de la ficha para la Vista (ej: '#007bff').
     * @param {string} iconoUrl - URL del icono SVG para la Vista.
     */
    constructor(fila, columna, color, iconoUrl) {
        this.fila = fila;
        this.columna = columna;
        this.color = color;
        this.iconoUrl = iconoUrl;
        
        // Mantenemos imagenUrl por si alguna parte del código de arrastre lo sigue usando
        this.imagenUrl = iconoUrl; 
    }

    /**
     * Actualiza la posición de la ficha.
     */
    mover(nuevaFila, nuevaColumna) {
        this.fila = nuevaFila;
        this.columna = nuevaColumna;
    }

    /**
     * Dibuja la ficha en un canvas.
     * @param {CanvasRenderingContext2D} context - Contexto del canvas.
     * @param {number} tamanoCelda - Tamaño de cada celda en el canvas.
     */
    /*dibujar(context, tamanoCelda) {
        const x = this.columna * tamanoCelda;
        const y = this.fila * tamanoCelda;

        // Dibujar el círculo de la ficha
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(x + tamanoCelda / 2, y + tamanoCelda / 2, tamanoCelda / 3, 0, 2 * Math.PI);
        context.fill();

        // Dibujar el icono SVG si está definido
        if (this.iconoUrl) {
            const img = new Image();
            img.src = this.iconoUrl;
            img.onload = () => {
                context.drawImage(img, x + tamanoCelda / 4, y + tamanoCelda / 4, tamanoCelda / 2, tamanoCelda / 2);
            };
        }
    }*/
}