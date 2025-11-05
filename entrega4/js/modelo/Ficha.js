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

}