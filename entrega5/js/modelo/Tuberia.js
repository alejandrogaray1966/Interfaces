export class Tuberia {
    constructor(ruta, xInicial, canvasHeight) {
        this.img = new Image();
        this.img.src = ruta;
        this.ancho = 120;
        this.espacio = 180;
        this.canvasHeight = canvasHeight;
        

        this.x = xInicial;

        this.velocidad = 2.7;

        // Altura aleatoria
        const margenSuperior = 30;
        const margenInferior = 120;
        const maxAlturaSuperior = canvasHeight - this.espacio - margenInferior;
        const minAlturaSuperior = margenSuperior;
        
        this.alturaSuperior = Math.floor(Math.random() * (maxAlturaSuperior - minAlturaSuperior)) + minAlturaSuperior; 
    }

    actualizar(canvasWidth, tiempoJuego) {
        this.x -= this.velocidad;

        // Cuando sale de pantalla → reiniciar
        /*if (this.x < -this.ancho) {
            this.x = 500;  
            this.alturaSuperior = Math.floor(Math.random() * 220) + 80;
        }*/

        if (this.x < -this.ancho) {
            return true; 
        }
        return false;
    }

    dibujar(ctx) {
        if (!this.img.complete) return;

        // Tubo de arriba
        ctx.drawImage(
            this.img,
            // Source (cortar desde la parte superior del sprite):
            0, this.img.height - this.alturaSuperior, // Inicia el corte desde abajo para que el borde quede arriba
            this.ancho, this.alturaSuperior, 
            // Destination (dibujar en el canvas):
            this.x, 0, 
            this.ancho, this.alturaSuperior
        );

        // Tubo de abajo
        const yInferior = this.alturaSuperior + this.espacio;
        const alturaInferior = this.canvasHeight - yInferior;

        // Ajustamos la altura de corte (Source) para que parezca que el tubo es continuo
        //const imgH = this.img.height; // Asumiendo que esta es la altura real del sprite
        //const sourceY = imgH - alturaInferior; // Cortar desde la parte inferior de la imagen


        ctx.drawImage(
            this.img,
            0, 0, this.ancho, alturaInferior,
            this.x, yInferior, this.ancho, alturaInferior
        );

        this.getColisionBox().forEach(box => {
            ctx.strokeStyle = 'lime';
            ctx.lineWidth = 2;
           ctx.strokeRect(box.x, box.y, box.w, box.h);
         });
    }

    getColisionBox() {
        const yInferior = this.alturaSuperior + this.espacio;
        const alturaInferior = this.canvasHeight - yInferior;

        // Devolvemos un array con las dos cajas AABB
        return [
            // Caja Superior
            { x: this.x, y: 0, w: this.ancho, h: this.alturaSuperior },
            // Caja Inferior
            { x: this.x, y: yInferior, w: this.ancho, h: alturaInferior }
        ];
    }

    colisiona(pajaro) {
        const pajaroBox = pajaro.getColisionBox();
        const tuberiaBoxes = this.getColisionBox();

// Función auxiliar de chequeo de colisión AABB
        const AABB = (boxA, boxB) => {
            return boxA.x < boxB.x + boxB.w &&
                   boxA.x + boxA.w > boxB.x &&
                   boxA.y < boxB.y + boxB.h &&
                   boxA.y + boxA.h > boxB.y;
        };
        
        // Chequear colisión con el tubo superior O el inferior
        return tuberiaBoxes.some(tuboBox => {
                    // ¡Aquí se chequea la colisión usando las variables correctas!
                    return AABB(pajaroBox, tuboBox);
                });
            }
}
