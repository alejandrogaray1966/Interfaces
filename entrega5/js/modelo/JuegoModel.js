import { Pajaro } from "./Pajaro.js";
import { FondoParallax } from "./FondoParallax.js";
import { Obstaculo } from "./Obstaculo.js";
import { Coleccionable } from "./Coleccionable.js";

export class JuegoModel {
    constructor(canvasHeight = 422, canvasWidth = 750) {
        this.canvasHeight = canvasHeight; // Para pasar a Pajaro.js y usar en límites.
        this.canvasWidth = canvasWidth;
        this.gameOver = false;
        // Pajaro con spritesheet
        this.pajaro = new Pajaro("./assets/sprite-vuelo.png", this.canvasHeight);
        

        this.rutasObstaculos = [
            "./assets/nube.png",
            "./assets/obstaculo1.png", 
            "./assets/obstaculo2.png", 
            "./assets/obstaculo3.png", 
            "./assets/obstaculo4.png", 
            "./assets/obstaculo6.png", 
            "./assets/obstaculo7.png", 
        ];

        // Obstáculos iniciales
        this.obstaculos = []; // Inicializamos vacío, la generación comienza en actualizar()
        // Variables de control de dificultad y generación
        this.generacionIntervaloBase = 150; 
        this.generacionIntervaloMin = 60;  
        this.contadorGeneracion = 0;
        
        this.dificultad = 0; 
        this.contadorTiempo = 0;

        this.score = 0; // <-- NUEVA PROPIEDAD: Puntuación del juego
        
        // --- COLECCIONABLES ---
        this.coleccionables = []; // <-- NUEVA LISTA
        this.rutasColeccionables = [
            "./assets/armadura1.png", // <--- DEBES TENER ESTA IMAGEN
            "./assets/armadura2.png" // <--- DEBES TENER ESTA IMAGEN
        ];
        this.generacionColeccionableIntervalo = 300; // Cada 300 frames (aprox 5 seg)
        this.contadorGeneracionColeccionable = 0;
    }

    _obtenerRutaObstaculoAleatoria() {
        const indice = Math.floor(Math.random() * this.rutasObstaculos.length);
        return this.rutasObstaculos[indice];
    }

    _obtenerRutaColeccionableAleatoria() { 
        const indice = Math.floor(Math.random() * this.rutasColeccionables.length);
        return this.rutasColeccionables[indice];
    }

    get animacionMuerteEnCurso() {
        // El Modelo simplemente delega la pregunta al objeto Pajaro.
        return this.pajaro.animacionMuerteEnCurso; 
    }

    actualizar() {
    
        this.pajaro.actualizar();

        if (this.pajaro.estado === 'muriendo') {
            return; // Detiene el scroll y la generación
        }
        
        // El resto del código solo se ejecuta si el pájaro está 'volando'.

        let colisionDetectada = false;

        // A. Colisión con límites del canvas (piso/techo)
        // La colisión con el suelo mientras "vuela" debe detectarse aquí.
        if (this.pajaro.fueraDelCanvas()){ 
            console.log("¡Colisión con límite!");
            colisionDetectada = true;
        }


        this.contadorTiempo++;
        
        // Lógica de dificultad progresiva (se mantiene)
        if (this.contadorTiempo % 300 === 0) {
            this.dificultad++;
            this.generacionIntervaloBase = Math.max(
                this.generacionIntervaloMin, 
                this.generacionIntervaloBase - 15
            );
        }

        const obstaculosSiguientes = [];
        let colisionConObstaculo = false;

        // ITERAR SOBRE LA LISTA ACTUAL, MOVER Y FILTRAR
        for (const obs of this.obstaculos) {
            // Actualizar la posición del obstáculo
            const fuera = obs.actualizar(this.canvasWidth, this.contadorTiempo);
            
            // Si NO está fuera, lo agregamos a la lista de la próxima iteración
            if (!fuera) { 
                obstaculosSiguientes.push(obs);

                // 2. Colisión con obstáculos (Se chequea durante la iteración)
                if (obs.colisiona(this.pajaro)) {
                    colisionConObstaculo = true; // Marcamos la colisión
                }
            }
        }
        
        // Asignar la lista filtrada de vuelta al modelo
        this.obstaculos = obstaculosSiguientes; // <--- CORRECCIÓN APLICADA

        if (colisionConObstaculo) {
            colisionDetectada = true;
       }

        // 3. Chequear la colisión después de iterar
        if (colisionDetectada) {
            this.gameOver = true; 
            console.log("¡Game Over! Colisión con obstáculo.");
            this.pajaro.morir();
            return;
        }

        // --- 2. Actualización y Recolección de Coleccionables --- // <-- ¡NUEVA LÓGICA!
        const coleccionablesSiguientes = [];

        for (const col of this.coleccionables) {
            const fuera = col.actualizar(this.contadorTiempo); // Mover el coleccionable
            
            if (!fuera) {
                // Chequeo de colisión/recolección
                if (col.colisiona(this.pajaro)) {
                    this.score += 10; // Sumar puntos
                    console.log(`¡Punto! Puntuación actual: ${this.score}`);
                    // NO AGREGAR a coleccionablesSiguientes para eliminarlo
                    // Esto simula que fue 'recogido'
                } else {
                    coleccionablesSiguientes.push(col); // Mantener si no se recogió
                }
            }
        }
        this.coleccionables = coleccionablesSiguientes;

        // --- 3. Generación de Coleccionables --- // <-- ¡NUEVA LÓGICA!
        this.contadorGeneracionColeccionable++;
        if (this.contadorGeneracionColeccionable >= this.generacionColeccionableIntervalo) {
            
            const rutaColeccionable = this._obtenerRutaColeccionableAleatoria();
            
            this.coleccionables.push(new Coleccionable(
                rutaColeccionable, 
                this.canvasWidth + 50, 
                this.canvasHeight
            ));
            
            // Generar el próximo en un rango aleatorio para variar
            this.generacionColeccionableIntervalo = Math.floor(Math.random() * 200) + 200; 
            this.contadorGeneracionColeccionable = 0; 
        }

        // Lógica de generación de nuevos obstáculos (Bucle Infinito)
        this.contadorGeneracion++;
        if (this.contadorGeneracion >= this.generacionIntervaloBase) {
            
            // USAR LA RUTA ALEATORIA EN LA GENERACIÓN
            const rutaAleatoria = this._obtenerRutaObstaculoAleatoria();
            
            this.obstaculos.push(new Obstaculo(rutaAleatoria, // <-- Aquí está el cambio
             this.canvasWidth + 50, 
             this.canvasHeight));
             
            this.contadorGeneracion = Math.floor(Math.random() * 30); 
        }

     
    }

    hayColision() {
        return this.obstaculos.some(t => t.colisiona(this.pajaro));
    }
    
}
