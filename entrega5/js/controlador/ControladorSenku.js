import { Tablero } from '../modelo/Tablero.js';
import { VistaSenku } from '../vista/VistaSenku.js';

export class ControladorSenku {

    constructor(canvas, imagenTableroUrl, temaTablero,tiempoInicialSegundos, actualizarCronometroUICallback, actualizarFichasUICallback, mostrarPopoverFinJuegoCallback) {
        //Inicializar el Modelo y la Vista
        this.modelo = new Tablero(temaTablero);
        this.vista = new VistaSenku(canvas, imagenTableroUrl);

        this.vista.setLoadCallback(this.redibujarJuego.bind(this));
        
        // Variables de Estado del Controlador (para Drag and Drop)
        this.fichaSeleccionada = null; // Ficha del Modelo que se está arrastrando
        this.origenSeleccionado = null; // Coordenada {fila, columna} de donde se tomó la ficha

        this.idCronometro = null; // ID del intervalo para poder detenerlo
        this.tiempoRestante = tiempoInicialSegundos;
        this.juegoTerminado = false; // Estado para bloquear movimientos al final

        //Guardar el callback para la UI
        this.actualizarCronometroUI = actualizarCronometroUICallback;
        this.actualizarFichasUI = actualizarFichasUICallback;
        this.mostrarPopoverFinJuego = mostrarPopoverFinJuegoCallback;

        this.inicializarEventos();
         // 5. Iniciar el cronómetro (Empieza la cuenta regresiva) <--- ¡Aquí va!
        this.inicializarCronometro();
        this.actualizarCuentaFichasUI();

    }

    //Asocia los eventos del mouse del canvas a los métodos del controlador.
     
    inicializarEventos() {
        // this.manejarMouseDown.bind(this) le dice a JavaScript:
        // Toma mi función manejarMouseDown y, cada vez que la ejecutes, asegúrate de que el this interno apunte a esta instancia del Controlador, no al Canvas
        this.vista.canvas.addEventListener('mousedown', this.manejarMouseDown.bind(this));
        this.vista.canvas.addEventListener('mousemove', this.manejarMouseMove.bind(this));
        this.vista.canvas.addEventListener('mouseup', this.manejarMouseUp.bind(this));
        this.vista.canvas.addEventListener('mouseleave', this.manejarMouseUp.bind(this)); 
    }


    //Maneja si el botón del mouse es presionado.
    
    manejarMouseDown(event) {
        // Bloquea la interacción si el juego terminó
        if (this.juegoTerminado) { 
            return; 
        }

        const rectanguloCanvas = this.vista.canvas.getBoundingClientRect();
        const x = event.clientX - rectanguloCanvas.left;
        const y = event.clientY - rectanguloCanvas.top;

        // Convierte píxeles a coordenadas lógicas
        const coordsLogicas = this.vista.obtenerCoordenadaLogica(x, y);

        //La sintaxis con las llaves ({ }) le dice a JavaScript:
        //De la constante coordsLogicas, quiero extraer las propiedades llamadas exactamente fila y columna
        // y crearé dos nuevas constantes locales con esos mismos nombres y sus respectivos valores.
        const { fila, columna } = coordsLogicas;
        
        // Verifica si hay una ficha en esa posición
        const ficha = this.modelo.tableroMatriz[fila][columna];

        if (ficha) {
            //INICIAR ARRASTRE
            this.fichaSeleccionada = ficha;
            this.origenSeleccionado = coordsLogicas;
            
            this.vista.iniciarArrastre(ficha, x, y);
            
            // OBTENER Y MOSTRAR PISTAS 
            const destinosValidos = this.modelo.obtenerMovimientosPosibles(fila, columna);
            this.vista.mostrarPistas(destinosValidos);

            // Muestra la ficha flotando y las pistas
            this.redibujarJuego(); 
        }
    }

    // El mouse se mueve mientras está sobre el elemento.
    
    manejarMouseMove(event) {
        if (this.fichaSeleccionada) {
            const rectanguloCanvas = this.vista.canvas.getBoundingClientRect();
            const x = event.clientX - rectanguloCanvas.left;
            const y = event.clientY - rectanguloCanvas.top;

            // Obtener la coordenada LÓGICA (matriz) de la posición actual del mouse.
            const coordsLogicas = this.vista.obtenerCoordenadaLogica(x, y);
            const { fila, columna } = coordsLogicas;

            // Comprobar si esa coordenada lógica NO ES parte del tablero de cruz (es una esquina vacía).
            // Usamos una función auxiliar en la Vista para esta comprobación de la forma.
// 2. Comprobar si esa coordenada lógica NO ES parte del tablero de cruz (es una esquina vacía).
        if (this.vista.esPosicionNoJugable(fila, columna)) {
            
            // Si está en una esquina NO jugable, forzamos el fin del arrastre.
            // Esto es correcto, ¡pero debemos asegurarnos de no actualizar la posición antes!
            
            // Aquí termina el arrastre, y la ficha vuelve a su posición original.
            this.vista.terminarArrastre();
            this.vista.ocultarPistas(); // Agregado: limpia las pistas al terminar
            this.fichaSeleccionada = null; 
            this.origenSeleccionado = null; 
            
        } else { 
            // Si es una posición jugable (o un píxel en el centro), ACTUALIZAMOS la posición.
            // Ahora la actualización de posición SÓLO ocurre si no se está en una esquina no jugable.
            this.vista.actualizarPosicionArrastre(x, y);
        }

            // Animación fluida    
            this.redibujarJuego(); 
          
            
    }

     
    }  

    /*for (const destino of this.pistasActivas) {
                alert("primer for")
                // Calcula el centro de la celda de destino
                if (fila==destino.fila && columna== destino.columna ){
                   const nuevosMovimientos = obtenerMovimientosPosibles(destino.fila, destino.columna); 
                   
                    for(const nuevodestino of nuevosMovimientos ) {
                        this.vista.resaltarPistas(nuevodestino); // Resalta la pista
                        alert("entre al for");
                    }
        
                }  
            }*/

    //El botón del mouse es liberado y ejecuta el movimiento si es válido.
     
    manejarMouseUp(event) {
        if (this.fichaSeleccionada) {
            const rectanguloCanvas = this.vista.canvas.getBoundingClientRect();
            const x = event.clientX - rectanguloCanvas.left;
            const y = event.clientY - rectanguloCanvas.top;

            //Obtiene las coordenadas lógicas de donde se soltó la ficha
            const coordsDestino = this.vista.obtenerCoordenadaLogica(x, y);
            const { fila, columna } = coordsDestino;

            //Intentar mover la ficha en el Modelo 
            const movidoExitosamente = this.modelo.moverFicha(this.origenSeleccionado.fila,this.origenSeleccionado.columna,fila,columna);

            //Limpiar el estado del arrastre y pistas
            this.vista.terminarArrastre();
            this.vista.ocultarPistas();
            this.fichaSeleccionada = null;
            this.origenSeleccionado = null;

            //Finalizar el dibujo
            this.redibujarJuego();
            
            if (movidoExitosamente) {
                this.actualizarCuentaFichasUI();
                this.verificarEstadoJuego(); // Llama a la nueva función
            } else {
                console.log("Movimiento inválido: La ficha regresó a su posición original.");
            }       
        }
    }

    inicializarCronometro() {
        //  Asegura que no haya cronómetros corriendo antes de iniciar uno nuevo
        if (this.idCronometro) {
            clearInterval(this.idCronometro); // Detiene el anterior
            this.idCronometro = null; // Reinicializa la ID
        }
        
        // Reinicia el estado de juego terminado
        this.juegoTerminado = false;

        // Solo iniciamos si hay tiempo restante (para juegos cronometrados)
        if (this.tiempoRestante > 0) { 
            
            // Llama al callback inmediatamente para mostrar el tiempo inicial (Crucial para el primer display)
            if (this.actualizarCronometroUI) {
                this.actualizarCronometroUI(this.tiempoRestante);
            }

            this.idCronometro = setInterval(() => {
                this.tiempoRestante--;
                
                // Llama al callback en cada tick para actualizar el DIV HTML
                if (this.actualizarCronometroUI) {
                    this.actualizarCronometroUI(this.tiempoRestante);
                }

                if (this.tiempoRestante <= 0) {
                    this.finalizarJuego(false); // Tiempo agotado
                }
            }, 1000);
        }
    }

    actualizarCuentaFichasUI() {
        
        const fichasRestantes = this.modelo.contarFichas(); 

        if (this.actualizarFichasUI) {
            this.actualizarFichasUI(fichasRestantes);
        }
    }

// ControladorSenku.js (Nueva función)

    verificarEstadoJuego() {

    if (this.modelo.fichasRestantes == 1) { // Cuando quedan 1 fichas
        this.finalizarJuego(true); // FORZAR LA VICTORIA
        return;
    }

    if (!this.modelo.hayMovimientosDisponibles() && this.fichasRestantes > 1) {
        this.finalizarJuego(false); // Llama a finalizarJuego() con FALSE
    }
    }



    finalizarJuego(victoria) {
        if (this.juegoTerminado) return; // Ya terminó
        this.juegoTerminado = true;
        
        if (this.idCronometro) {
            clearInterval(this.idCronometro);
            this.idCronometro = null;
        }
        
        this.vista.terminarArrastre(); // Por si estaba arrastrando
        this.vista.ocultarPistas();


        let mensaje = "";
        if (victoria) {
            mensaje = "¡PERDISTE! 🎉 Vuelve a intentarlo.";

        }else if (this.tiempoRestante <= 0) {
            mensaje = "El tiempo se ha agotado. Intenta de nuevo con una estrategia más rápida.";

        }

        if (this.mostrarPopoverFinJuego) {
        this.mostrarPopoverFinJuego(victoria, mensaje); 
    }

        //this.vista.mostrarMensaje(mensaje);
        this.redibujarJuego();
    }

    // Dibuja el estado actual del Modelo en la Vista.

    redibujarJuego() {
        //Dibuja el estado actual
        this.vista.redibujar(this.modelo.tableroMatriz,this.juegoTerminado);
        
        //Verifica si el juego ha terminado 
        // y si el Modelo indica que NO hay movimientos posibles.
        if (!this.juegoTerminado && !this.modelo.hayMovimientosDisponibles()) {
            
            // El parámetro 'false' indica que se perdió (por tablero bloqueado).
            this.finalizarJuego(false); 
        }    
    }

    // Método para reiniciar el juego
    

    reiniciarJuego(nuevaImagenTableroUrl, tipoFicha, nuevoTiempoSegundos, nuevoUICallback, nuevoUICallbackFichas, nuevoMostrarPopoverFinJuego) {
        
        // Reiniciar el Modelo y el Estado Interno
        this.modelo.inicializarTablero();
        this.fichaSeleccionada = null;
        this.origenSeleccionado = null;
        this.juegoTerminado = false; // Permite movimientos nuevamente

        // Actualizar la Vista y Ocultar elementos de UI ---
        if (this.vista.ocultarPistas) {
            this.vista.ocultarPistas();
        }
        // Actualizar la imagen del tablero (por si el usuario la cambió)
        this.vista.actualizarImagenTablero(nuevaImagenTableroUrl); 

        
        // Actualizar el callback del cronómetro
        this.actualizarCronometroUI = nuevoUICallback; 
        this.actualizarFichasUI = nuevoUICallbackFichas;
        this.mostrarPopoverFinJuego = nuevoMostrarPopoverFinJuego;


        //Establecer el nuevo tiempo restante
        this.tiempoRestante = nuevoTiempoSegundos; 

        // Detener el cronómetro anterior
        if (this.idCronometro) {
            clearInterval(this.idCronometro);
            this.idCronometro = null;
        }
        
        // Iniciar el nuevo cronómetro (que usará el nuevo tiempo y el callback)
        this.inicializarCronometro(); 
        this.actualizarCuentaFichasUI();

        // Finalizar y Redibujar 
        this.redibujarJuego();
        console.log("Juego Reiniciado con nueva configuración.");
    }
}