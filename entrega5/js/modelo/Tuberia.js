export class Tuberia {
    constructor(ruta, xInicial) {
        this.img = new Image();
        this.img.src = ruta;
        this.ancho = 750;
        this.espacio = 50;
        

        this.x = xInicial;

        this.velocidad = 2;

        // Altura aleatoria
        this.alturaSuperior = Math.floor(Math.random() * 220) + 80;
    }

    actualizar() {
        this.x -= this.velocidad;

        // Cuando sale de pantalla → reiniciar
        if (this.x < -this.ancho) {
            this.x = 500;  
            this.alturaSuperior = Math.floor(Math.random() * 220) + 80;
        }
    }

    dibujar(ctx) {
        if (!this.img.complete) return;

        // Tubo de arriba
        ctx.drawImage(
            this.img,
            0, 0, this.ancho, this.alturaSuperior,
            this.x, 0, this.ancho, this.alturaSuperior
        );

        // Tubo de abajo
        const alturaInferior = ctx.canvas.height - (this.alturaSuperior + this.espacio);

        ctx.drawImage(
            this.img,
            0, 0, this.ancho, alturaInferior,
            this.x, this.alturaSuperior + this.espacio,
            this.ancho, alturaInferior
        );
    }

    colisiona(pajaro) {
        const box = pajaro.getColisionBox();

        // chequeo simple de caja
        if (box.x < this.x + this.ancho &&
            box.x + box.w > this.x) {

            if (box.y < this.alturaSuperior ||
                box.y + box.h > this.alturaSuperior + this.espacio) {
                return true;
            }
        }
        return false;
    }
}
