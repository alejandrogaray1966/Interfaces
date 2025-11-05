import { Ficha } from './Ficha.js';

export class Tablero {
    static TAMANIO = 7;
    // Las posiciones que NO son parte del tablero de cruz (se inicializarán con null, pero por seguridad)
    static POSICIONES_JUEGO = [
        // Filas 0 y 1 (extremos superiores)
                        [0, 2], [0, 3], [0, 4], 
                        [1, 2], [1, 3], [1, 4], 
        // Filas 2, 3, 4 (el centro expandido)
        [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], 
        [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], // (3, 3) está incluido, luego lo vaciamos
        [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6],
        // Filas 5 y 6 (extremos inferiores)
                        [5, 2], [5, 3], [5, 4], 
                        [6, 2], [6, 3], [6, 4]
    ];

   // Propiedades de la ficha (Color y URL del Icono SVG)
   static MAPA_FICHA_PROPIEDADES = {
    'antiguo': {
        color: 'rgba(116, 81, 64, 0.67)', // Color café/tierra
        iconoUrl:'./assets/armadura1.png' // RUTA EJEMPLO: Asegúrate de que el archivo exista
    }, 
    'medieval': {
        color: 'rgba(70, 131, 180, 0.5)', // Color azul acero
        iconoUrl: './assets/armadura2.png'
        // RUTA EJEMPLO
    }, 
    'moderno': {
        color: 'rgba(22, 62, 56, 0.5)', // Color verde medio
        iconoUrl: './assets/armadura3.png' // RUTA EJEMPLO
    }
    };

    constructor(temaTablero = 'antiguo') {
        this.tableroMatriz = []; 
        this.fichasRestantes = 32;
        this.temaTablero = temaTablero; 
        this.inicializarTablero();
    }

    // Crea la matriz 7x7 y coloca las fichas en la configuración inicial del Senku.
    // Usamos bucles for para inicializar.
    
    inicializarTablero() {
        this.tableroMatriz = []; 
        this.fichasRestantes = 32;

        const propiedadesFicha = Tablero.MAPA_FICHA_PROPIEDADES[this.temaTablero] || Tablero.MAPA_FICHA_PROPIEDADES['antiguo'];
        const colorFicha = propiedadesFicha.color;
        const iconoFichaUrl = propiedadesFicha.iconoUrl;

        // ... (Crear la matriz 7x7 vacía primero) ...
        for (let i = 0; i < Tablero.TAMANIO; i++) {
            this.tableroMatriz[i] = []; 
            for (let j = 0; j < Tablero.TAMANIO; j++) {
                this.tableroMatriz[i][j] = null;
            }
        }
        
        // Colocar las fichas SOLAMENTE en las posiciones de la lista
        for (let i = 0; i < Tablero.POSICIONES_JUEGO.length; i++) {
            const fila = Tablero.POSICIONES_JUEGO[i][0];
            const col = Tablero.POSICIONES_JUEGO[i][1];

            if (fila === 3 && col === 3) {
                continue; 
            }
            
            // Pasamos color e iconoUrl al constructor de Ficha
            const nuevaFicha = new Ficha(fila, col, colorFicha, iconoFichaUrl); 
            this.tableroMatriz[fila][col] = nuevaFicha;
        }
    }
    // Función auxiliar para verificar si una posición pertenece a la forma de cruz.
     
    esPosicionDeJuego(fila, col) {
            // Recorremos la lista estática y comprobamos si la coordenada coincide
            for (let i = 0; i < Tablero.POSICIONES_JUEGO.length; i++) {

                //Dado que pos es un array de dos elementos:  [0, 2], [0, 3], [0, 4]
                //pos[0]: Siempre accede al primer elemento de ese array. Por convención, el primer elemento es la Fila.
                //pos[1]: Siempre accede al segundo elemento de ese array. Por convención, el segundo elemento es la Columna.
                const pos = Tablero.POSICIONES_JUEGO[i];

                if (pos[0] === fila && pos[1] === col) {
                    return true;
                }
            }
            return false;
        }


    // Verifica si una posición está dentro de los límites y es parte de la cruz.
    
    esPosicionValida(fila, col) {
        // 1. Está dentro de los límites 7x7
        if (fila < 0 || fila >= Tablero.TAMANIO || col < 0 || col >= Tablero.TAMANIO) {
            return false;
        }
        // 2. Es parte del área de juego
        return this.esPosicionDeJuego(fila, col); 
    }

    /**
     * Determina la posición de la ficha que sería saltada.
     */
    obtenerPosicionSaltada(filaOrigen, columnaOrigen, filaDestino, columnaDestino) {
            // La lógica de cálculo del punto medio es limpia y no necesita cambios.
            const difFila = filaDestino - filaOrigen;
            const difCol = columnaDestino - columnaOrigen;

            // Solo movimientos de 2 casillas en una dirección (horizontal o vertical)
            if (Math.abs(difFila) === 2 && difCol === 0) { // Vertical
                return { fila: filaOrigen + difFila / 2, columna: columnaOrigen };
            } else if (Math.abs(difCol) === 2 && difFila === 0) { // Horizontal
                return { fila: filaOrigen, columna: columnaOrigen + difCol / 2 };
            }
            return null; // No es un movimiento Senku (distancia incorrecta)
        }
    /**
     * Ejecuta el movimiento si es válido.
     */
    obtenerMovimientosPosibles(filaOrigen, columnaOrigen) {
        const destinosValidos = [];
        
        if (this.tableroMatriz[filaOrigen][columnaOrigen] === null) {
            return destinosValidos; 
        }

        const posiblesDestinos = [
            { fDestino: filaOrigen - 2, cDestino: columnaOrigen }, // Arriba
            { fDestino: filaOrigen + 2, cDestino: columnaOrigen }, // Abajo
            { fDestino: filaOrigen, cDestino: columnaOrigen - 2 }, // Izquierda
            { fDestino: filaOrigen, cDestino: columnaOrigen + 2 }, // Derecha
        ];

        for (let i = 0; i < posiblesDestinos.length; i++) {
            const dest = posiblesDestinos[i];
            
            const posSaltada = this.obtenerPosicionSaltada(filaOrigen, columnaOrigen, dest.fDestino, dest.cDestino);

            if (posSaltada) {
                const filaDestino = dest.fDestino;
                const columnaDestino = dest.cDestino;
                

                if (posSaltada.fila < 0 || posSaltada.fila >= Tablero.TAMANIO || 
                    posSaltada.columna < 0 || posSaltada.columna >= Tablero.TAMANIO) {
                    continue; 
                }

                
                // Verifica primero si el destino es una posición válida.
                // Esto previene acceder fuera de this.tableroMatriz si el destino está en [-1] o [7].
                if (!this.esPosicionValida(filaDestino, columnaDestino)) {
                    continue; 
                }
            
                const destinoEstaVacio = this.esPosicionValida(filaDestino, columnaDestino) && this.tableroMatriz[filaDestino][columnaDestino] === null;
                
                // 2. La posición saltada debe tener una ficha.
                const saltadaTieneFicha = this.tableroMatriz[posSaltada.fila][posSaltada.columna] !== null;
                
                if (destinoEstaVacio && saltadaTieneFicha) {
                    destinosValidos.push({ fila: filaDestino, columna: columnaDestino });
                }
            }
        }
        return destinosValidos;
    }
    
    hayMovimientosDisponibles() {
        // Recorremos solo las posiciones de juego válidas para optimizar
        for (let i = 0; i < Tablero.POSICIONES_JUEGO.length; i++) {
            const filaOrigen = Tablero.POSICIONES_JUEGO[i][0];
            const columnaOrigen = Tablero.POSICIONES_JUEGO[i][1];
            
            if (this.tableroMatriz[filaOrigen][columnaOrigen] !== null) {
                // Si la ficha tiene al menos UN movimiento posible, el juego sigue
                if (this.obtenerMovimientosPosibles(filaOrigen, columnaOrigen).length > 0) {
                    return true; 
                }
            }
        }
        return false;
    }

    contarFichas() {
        return this.fichasRestantes;
    }



    moverFicha(filaOrigen, columnaOrigen, filaDestino, columnaDestino) {
            // 1. Verificar si las posiciones son parte del juego (límites y cruz)
            if (!this.esPosicionValida(filaOrigen, columnaOrigen) || !this.esPosicionValida(filaDestino, columnaDestino)) {
                return false; 
            }

            // 2. Obtener la posición saltada. Si es null, no es un movimiento de Senku.
            const posSaltada = this.obtenerPosicionSaltada(filaOrigen, columnaOrigen, filaDestino, columnaDestino);
            if (!posSaltada) {
                return false;
            }

            // 3. Verificar el estado de las celdas para validar el movimiento:
            const origenTieneFicha = this.tableroMatriz[filaOrigen][columnaOrigen] !== null;
            const destinoEstaVacio = this.tableroMatriz[filaDestino][columnaDestino] === null;
            const saltadaTieneFicha = this.tableroMatriz[posSaltada.fila][posSaltada.columna] !== null;

            if (origenTieneFicha && destinoEstaVacio && saltadaTieneFicha) {
                
                // --- MOVIMIENTO VÁLIDO: ACTUALIZACIÓN DEL ESTADO ---

                // A. Mover la ficha
                const fichaAMover = this.tableroMatriz[filaOrigen][columnaOrigen];
                fichaAMover.mover(filaDestino, columnaDestino); 
                this.tableroMatriz[filaDestino][columnaDestino] = fichaAMover;
                this.tableroMatriz[filaOrigen][columnaOrigen] = null;

                // B. Eliminar la ficha saltada
                // Nota: Aquí se elimina la referencia al objeto Ficha, no es necesario llamar a un método de Ficha.
                this.tableroMatriz[posSaltada.fila][posSaltada.columna] = null;
                
                this.fichasRestantes--; 
                // Aquí se verifica el fin del juego (Requisito 5)
            if (!this.hayMovimientosDisponibles()) { 
                console.log("¡Juego terminado! Puntuación final:", this.fichasRestantes);
            }                
                return true;
            }

            return false;
    }
}