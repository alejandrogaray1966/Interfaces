import { Pajaro } from "./Pajaro.js";
import { FondoParallax } from "./FondoParallax.js";
import { Obstaculo } from "./Obstaculo.js";
import { Coleccionable } from "./Coleccionable.js";
import { Tuberia } from "./Tuberia.js";

export class JuegoModel {
    constructor(canvasHeight = 422, canvasWidth = 750) {
        this.canvasHeight = canvasHeight; // Para pasar a Pajaro.js y usar en límites.
        this.canvasWidth = canvasWidth;
        this.gameOver = false;

        //VER SI AGREGAMOS MAS PAJAROS-----------PUCHO
        // Pajaro con spritesheet
        this.pajaro = new Pajaro("./assets/sprite-vuelo.png", this.canvasHeight);
        //agregué 1 spritesheet nuevo pajaro verde
        

        this.rutasObstaculos = {
            'tuberia': {
                tipo: 'tuberia',
            },
            'obstaculo' : {
                tipo: 'obstaculo',
                imgUrls:["./assets/obstaculo1.png", 
                        "./assets/obstaculo2.png", 
                        "./assets/obstaculo3.png", 
                        "./assets/obstaculo4.png", 
                        "./assets/obstaculo6.png", 
                        "./assets/obstaculo7.png",]
            }
        };


        this.faseActual = 'tuberias'; // Inicia con tuberías
        this.contadorFase = 0;
        this.MAX_TUBERIAS = 5;      // Generar 5 pares de tuberías
        this.MAX_OBSTACULOS = 8;    // Generar 8 obstáculos simples
        
        // El intervalo de generación es ahora fijo para cada tipo
        this.INTERVALO_TUBERIA = 120; // Un par de tuberías cada 100 frames
        this.INTERVALO_OBSTACULO = 100; // Un obstáculo simple cada 75 frames


        // Obstáculos iniciales
        this.obstaculos = []; // Inicializamos vacío, la generación comienza en actualizar()
        // Variables de control de dificultad y generación
        this.generacionIntervaloBase = 150; 
        this.generacionIntervaloMin = 60;  
        this.contadorGeneracion = 0;
        
        this.dificultad = 0; 
        this.contadorTiempo = 0;

        this.score = 0; // <-- NUEVA PROPIEDAD: Puntuación del juego
        
        //comment pucho--- this.generarTuberia = true;

        // --- COLECCIONABLES ---
        this.coleccionables = []; // <-- NUEVA LISTA
        this.rutasColeccionables = [
            "./assets/Coleccionable1.png", // <--- DEBES TENER ESTA IMAGEN
            "./assets/Coleccionable2.png",
            "./assets/Coleccionable3.png",
            "./assets/Coleccionable4.png",
            "./assets/Coleccionable5.png" // <--- DEBES TENER ESTA IMAGEN
        ];
        this.generacionColeccionableIntervalo = 300; // Cada 300 frames (aprox 5 seg)
        this.contadorGeneracionColeccionable = 0;
    }

    _obtenerRutaObstaculoAleatoria() {
        const tipos = ['obstaculo', 'tuberia']; // Array de los tipos disponibles
        const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];
    
    // Si es una tubería, devolvemos el tipo para instanciar la clase Tuberia
        if (tipoAleatorio === 'tuberia') {
            return { tipo: 'tuberia' };
        } 
        // Si es un obstáculo simple, elegimos una ruta de imagen aleatoria
        else {
            const rutas = this.rutasObstaculos.obstaculo.imgUrls;
            const ruta = rutas[Math.floor(Math.random() * rutas.length)];
            return { tipo: 'obstaculo', ruta: ruta };
        }
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

        this.contadorTiempo++;

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


        
        // Lógica de dificultad progresiva (se mantiene)
        if (this.contadorTiempo % 300 === 0) {
            this.dificultad++;
            this.generacionIntervaloBase = Math.max(
                this.generacionIntervaloMin, 
                this.generacionIntervaloBase - 10
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
        /*this.contadorGeneracion++;
        if (this.contadorGeneracion >= this.generacionIntervaloBase) {
            
            const infoGeneracion = this._obtenerRutaObstaculoAleatoria();
            let nuevoObstaculo;

            if (infoGeneracion.tipo === 'tuberia') {
                // Generar una Tuberia. La ruta de la imagen se define dentro de Tuberia.js
                nuevoObstaculo = new Tuberia(
                    "./assets/tuberiaInferior.png", // <--- DEBES ASEGURARTE DE USAR LA RUTA CORRECTA AQUÍ
                    this.canvasWidth + 50, 
                    this.canvasHeight
                );
            } else {
                // Generar un Obstaculo
                nuevoObstaculo = new Obstaculo(
                    infoGeneracion.ruta, // Usa la ruta de la imagen simple
                    this.canvasWidth + 50, 
                    this.canvasHeight
                );
            }

            this.obstaculos.push(nuevoObstaculo);
                
            this.contadorGeneracion = Math.floor(Math.random() * 30); 
        }*/ 


        this.contadorGeneracion++;
        let nuevoObstaculo = null;

        if (this.faseActual === 'tuberias') {
            if (this.contadorFase < this.MAX_TUBERIAS) {
                if (this.contadorGeneracion >= this.INTERVALO_TUBERIA) {
                    // Generar Tuberia
                    nuevoObstaculo = new Tuberia(
                        "./assets/tuberia.png", // Asegúrate de que esta ruta sea correcta
                        this.canvasWidth + 50, 
                        this.canvasHeight
                    );
                    this.contadorFase++; // Contar que generamos 1 de 5
                    this.contadorGeneracion = 0;
                }
            } else {
                // Transicionar a la siguiente fase
                this.faseActual = 'obstaculos';
                this.contadorFase = 0;
                this.contadorGeneracion = 0;
                console.log("Cambiando a fase: Obstáculos");
            }

        } else if (this.faseActual === 'obstaculos') {
            if (this.contadorFase < this.MAX_OBSTACULOS) {
                if (this.contadorGeneracion >= this.INTERVALO_OBSTACULO) {
                    // Generar Obstáculo Simple
                    const rutas = this.rutasObstaculos.obstaculo.imgUrls;
                    const ruta = rutas[Math.floor(Math.random() * rutas.length)];
                    
                    nuevoObstaculo = new Obstaculo(
                        ruta, 
                        this.canvasWidth + 50, 
                        this.canvasHeight
                    );
                    this.contadorFase++; // Contar que generamos 1 de 8
                    this.contadorGeneracion = 0;
                }
            } else {
                // Transicionar a la siguiente fase (vuelta a tuberías)
                this.faseActual = 'tuberias';
                this.contadorFase = 0;
                this.contadorGeneracion = 0;
                console.log("Cambiando a fase: Tuberías");
            }
        }
        
        // Agregar el nuevo obstáculo (si se generó)
        if (nuevoObstaculo) {
             this.obstaculos.push(nuevoObstaculo);
        }
    }

    hayColision() {
        return this.obstaculos.some(t => t.colisiona(this.pajaro));
    }
    
}
