export class FondoParallax {
    constructor(ruta, velocidad) {
        this.img = new Image();
        this.img.src = ruta;

        this.x = 0;
        this.velocidad = velocidad;
    }

    actualizar() {
        this.x -= this.velocidad;
        if (this.x <= -this.img.width) {
            this.x = 0;
        }
    }
}
