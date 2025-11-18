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

        // 1. Si el juego aún no ha terminado (gameOver = false), sigue el loop normal.
        if (!this.juegoModelo.gameOver) {
            requestAnimationFrame(this.loop);
            return;
        }

        // --- Lógica de Fin de Juego (Solo si this.juegoModelo.gameOver es TRUE) ---

        // 2. Si el juego terminó PERO la animación de muerte/caída AÚN está en curso,
        // continuamos el loop SOLO para la animación.
        if (this.juegoModelo.animacionMuerteEnCurso) { 
            requestAnimationFrame(this.loop);
            return;
        }
    
        // 3. Si el juego terminó Y la animación de muerte YA NO está en curso,
        // detenemos el loop y mostramos el resultado.
        console.log("COLISIÓN! Juego Terminado. Deteniendo el loop de animación.");
        this.finalizarJuego(false); // Llama a la función que muestra el popover
        
        // No hay llamada a requestAnimationFrame aquí, el juego se detiene.
    }

    finalizarJuego(victoria) {

        if (this.juegoTerminado) return; // Ya terminó
        this.juegoTerminado = true;
        
        if (this.idCronometro) {
            clearInterval(this.idCronometro);
            this.idCronometro = null;
        }

        let mensaje = "";
        if (victoria) {
            mensaje = "¡VICTORIA! 🎉 Solo te queda una ficha.";

        } else if (this.tiempoRestante <= 0) {
            mensaje = "El tiempo se ha agotado. Intenta de nuevo con una estrategia más rápida.";

        } else {
            mensaje = "Te has quedado sin movimientos posibles. ¡Mejora tu estrategia!.";

        }

        if (this.mostrarPopoverFinJuego) {
            this.mostrarPopoverFinJuego(victoria, this.juegoModelo.pajaro); // Aquí pasamos el pájaro por si necesitamos sus stats
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
}
