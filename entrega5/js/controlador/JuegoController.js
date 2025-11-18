import { JuegoModel } from '../modelo/JuegoModel.js';
import { JuegoView } from '../vista/JuegoView.js';


export class JuegoController {
    constructor(canvas,tiempoInicialSegundos, actualizarCronometroUICallback, mostrarPopoverFinJuegoCallback) {
        
        this.juegoModelo = new JuegoModel(canvas.height, canvas.width);
        this.juegoVista = new JuegoView(canvas, this.juegoModelo);


        //this.vista.setLoadCallback(this.redibujarJuego.bind(this));

        this.loop = this.loop.bind(this); // Asegura el contexto correcto en el loop
       

        this.idCronometro = null; // ID del intervalo para poder detenerlo
        this.tiempoRestante = tiempoInicialSegundos;
        this.juegoTerminado = false; // Estado para bloquear movimientos al final

        //Guardar el callback para la UI
        this.actualizarCronometroUI = actualizarCronometroUICallback;
        this.mostrarPopoverFinJuego = mostrarPopoverFinJuegoCallback;
         // 5. Iniciar el cronómetro (Empieza la cuenta regresiva) <--- ¡Aquí va!
        this.inicializarCronometro();

        // vuelo del pájaro
        window.addEventListener("keydown", (e) => {
            if (e.key === " " || e.key === "ArrowUp") {
                e.preventDefault();
                //Solo permite volar si el juego no ha terminado
                if (!this.juegoModelo.gameOver) { 
                    this.juegoModelo.pajaro.volar();
                }
            }
        });

        canvas.addEventListener("click", () => {
            // Solo permite volar si el juego no ha terminado
            if (!this.juegoModelo.gameOver) {
               this.juegoModelo.pajaro.volar();
           }
       });
    }

    //esto estaba comentado, porque habiamos cambiado la forma de redibujar el juego VER...
    iniciar() {
        requestAnimationFrame(this.loop);
    } 

    loop() {
        this.juegoModelo.actualizar();
        this.juegoVista.dibujar();

        // Chequea si la bandera 'gameOver' se activó en el modelo
        if (this.juegoModelo.gameOver) {
            console.log("COLISIÓN! Juego Terminado. Deteniendo el loop de animación.");
            
            // Llama a tu función para mostrar la ventana de fin de juego/reiniciar
            if (this.mostrarPopoverFinJuego) {
                 // Asumo que tu callback necesita un argumento 'false' si es derrota
                 this.mostrarPopoverFinJuego(false); 
            }
            
            // RETURN: La clave para que el juego se detenga es NO llamar a requestAnimationFrame
            return; 
        }

        // Si el juego no ha terminado, continúa el loop
        requestAnimationFrame(this.loop);
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
}
