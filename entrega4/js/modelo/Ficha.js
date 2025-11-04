export class Ficha {
    /**
     Esto le dice a ciertas herramientas de desarrollo (como VS Code, WebStorm o generadores de documentación) lo siguiente:
     Primer argumento: Debe ser un número, representa la fila de la ficha (entre 0 y 6).
     Segundo argumento: Debe ser un número, representa la columna de la ficha (entre 0 y 6).
     Tercer argumento: Debe ser un string (cadena de texto) y es la URL de la imagen que se usará para representar la ficha en la pantalla.

     JSDoc es una sintaxis de comentarios utilizada en JavaScript para documentar el código
     * @param {number} fila - Fila actual (0-6).
     * @param {number} columna - Columna actual (0-6).
     * @param {string} imagenUrl - URL para la Vista (se usará como dato, no como dibujo aquí).
     */
    constructor(fila, columna, imagenUrl) {
        this.fila = fila;
        this.columna = columna;
        this.imagenUrl = imagenUrl;
    }

    /**
     * Actualiza la posición de la ficha.
     */
    mover(nuevaFila, nuevaColumna) {
        this.fila = nuevaFila;
        this.columna = nuevaColumna;
    }
    
    // No necesitamos un método 'eliminar()' aquí. La ficha se elimina
    // del tablero (la matriz en Tablero.js)
}