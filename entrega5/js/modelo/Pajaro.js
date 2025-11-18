export class Pajaro {
    constructor(ruta, canvasHeight) {//por parametro paso la altura del canvas para los límites
        this.img = new Image();
        this.img.src = ruta;
        this.canvasHeight = canvasHeight;
        //animacion vuelo
        this.frameW = 100;
        this.frameH = 110;
        this.totalFrames = 4;
        this.velAnim = 8;
        this.frameActual = 0;
        this.cont = 0;

        // animación de MUERTE (Nuevo Spritesheet 504x126, frame 126x126)
        this.imgMuerte = new Image();
        this.imgMuerte.src = "./assets/spriteColision.png"; 
        this.frameWMuerte = 126; // Ancho de cada frame de muerte
        this.frameHMuerte = 126; // Alto de cada frame de muerte
        this.totalFramesMuerte = 4; // 504 / 126 = 4 frames
        this.velAnimMuerte = 10; // Velocidad de la animación de muerte
        this.frameActualMuerte = 0;
        this.contMuerte = 0;
        this.animacionMuerteTerminada = false;


        this.x = 100;
        this.y = 200;

        // Física
        this.velY = 0;
        this.gravedad = 0.2;
        this.salto = -3;

        // Estado de juego
        this.estado = 'volando'; // 'volando', 'muriendo'
    }

    actualizar() {
        if (this.estado === 'volando') {
        // Animación normal (vuelo)
            this.cont++;
            if (this.cont >= this.velAnim) {
                this.frameActual = (this.frameActual + 1) % this.totalFrames;
                this.cont = 0;
            }

        // física
        this.velY += this.gravedad;
        this.y += this.velY;

        }else if (this.estado === 'muriendo') {
            // 1. Animación de muerte (rotación)
            if (!this.animacionMuerteTerminada) {
                this.contMuerte++;
                if (this.contMuerte >= this.velAnimMuerte) {
                    this.frameActualMuerte = (this.frameActualMuerte + 1);
                    this.contMuerte = 0;
                }               
                if (this.frameActualMuerte >= this.totalFramesMuerte) {
                    this.frameActualMuerte = this.totalFramesMuerte - 1; // Se detiene en el último frame
                    this.animacionMuerteTerminada = true;
                }
            }
        
            
            // 2. Caída libre (física más rápida para el efecto)

            this.velY += this.gravedad;
            this.y += this.velY;
        }

        // Colisión con el suelo (si aún está cayendo)
        const box = this.getColisionBox();
        if (this.estado === 'muriendo' && box.y + box.h > this.canvasHeight) {
            this.y = this.canvasHeight - this.frameH + 10; // Ajuste para que se vea en el suelo
            this.velY = 0;
            // Opcional: Aseguramos que la animación de sprite se detenga cuando toca el suelo
            this.animacionMuerteTerminada = true; 
        }    
    }

    volar() {
        if (this.estado === 'volando') {
            this.velY = this.salto;
        }
    }

    get animacionMuerteEnCurso() {
        // La secuencia de muerte termina cuando toca el suelo .
        return this.estado === 'muriendo' && this.velY !== 0; 
 
    }
    // Función para cambiar al estado de muerte (llamada por el modelo)
    morir() {
        this.estado = 'muriendo';
        this.velY = -3; // Un pequeño rebote al empezar a morir
        this.gravedad = 0.2; // Resetear la gravedad para el estado de muerte
    }


     // Usado por JuegoModel para detectar colisión con límites del canvas
    fueraDelCanvas(){
        const box= this.getColisionBox();

        // Si colisiona con el techo o el piso (en estado 'volando')
        if(this.estado === 'volando' && (box.y < 0 || box.y + box.h > this.canvasHeight)){
            return true;
        }

        // Si está cayendo (muriendo) y toca el suelo
        if(this.estado === 'muriendo' && box.y + box.h > this.canvasHeight){
            return true;
        }

        return false;
    }


    
    getColisionBox() {
        return {
            x: this.x ,
            y: this.y +25,
            w: this.frameW,//pico
            h: this.frameH-40
        };
    }
}
