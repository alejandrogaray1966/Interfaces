export class Pajaro {
    constructor(ruta, canvasHeight) {//por parametro paso la altura del canvas para los límites
        this.img = new Image();
        this.img.src = ruta;

        this.frameW = 100;
        this.frameH = 110;
        this.totalFrames = 4;
        this.velAnim = 8;
        this.canvasHeight = canvasHeight;

        this.frameActual = 0;
        this.cont = 0;

        this.x = 100;
        this.y = 200;

        // Física
        this.velY = 0;
        this.gravedad = 0.2;
        this.salto = -3;
    }

    actualizar() {
        // animación
        this.cont++;
        if (this.cont >= this.velAnim) {
            this.frameActual = (this.frameActual + 1) % this.totalFrames;
            this.cont = 0;
        }

        // física
        this.velY += this.gravedad;
        this.y += this.velY;
    }

    volar() {
        this.velY = this.salto;
    }

    fueraDelCanvas(){
        const box= this.getColisionBox();

        //colision con el techo
        if(box.y < 0){
            this.y=0;//matengo el pajaro en el límite del techo
            return true;
        }
        //colision con el piso
        if(box.y + box.h > this.canvasHeight){
            //ajusto la posición para que quede en exactamente en el piso
            //box.h es la altura de la caja de colisión, y 2 es el desplazamiento inicial de y
            this.y= this.canvasHeight - box.h -2;
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
