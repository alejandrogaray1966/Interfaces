import { JuegoModel } from '../modelo/JuegoModel.js';
import { JuegoView } from '../vista/JuegoView.js';


export class JuegoController {
    constructor(canvas,tiempoInicialSegundos, actualizarCronometroUICallback, mostrarPopoverFinJuegoCallback) {
        
        this.juegoModelo = new JuegoModel();
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
                this.juegoModelo.pajaro.volar();
            }
        });

        canvas.addEventListener("click", () => {
            this.juegoModelo.pajaro.volar();
        });
    }

    /*iniciar() {
        requestAnimationFrame(this.loop);
    }*/

    loop() {
        this.juegoModelo.actualizar();
        this.juegoVista.dibujar();

        if (this.juegoModelo.hayColision()) {
            console.log("COLISIÓN!");
            // aquí puedes reiniciar el juego si querés
        }

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
