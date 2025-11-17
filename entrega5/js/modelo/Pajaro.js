export class Pajaro {
    constructor(ruta) {
        this.img = new Image();
        this.img.src = ruta;

        this.frameW = 100;
        this.frameH = 110;
        this.totalFrames = 4;
        this.velAnim = 6;

        this.frameActual = 0;
        this.cont = 0;

        this.x = 100;
        this.y = 200;

        // Física
        this.velY = 0;
        this.gravedad = 0.4;
        this.salto = -6;
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

    getColisionBox() {
        return {
            x: this.x + 2,
            y: this.y + 2,
            w: this.frameW - 40,
            h: this.frameH - 40
        };
    }
}
