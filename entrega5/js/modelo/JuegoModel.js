import { Pajaro } from "./Pajaro.js";
import { FondoParallax } from "./FondoParallax.js";
import { Tuberia } from "./Tuberia.js";

export class JuegoModel {
    constructor() {

        // Fondos (agregás los que quieras)

        // Pajaro con tu spritesheet
        this.pajaro = new Pajaro("./assets/sprite-vuelo.png");

        // Tuberías iniciales
        this.tuberias = [
            new Tuberia("./assets/pc2.png", 750),
            new Tuberia("./assets/pc6.png", 20),
            new Tuberia("./assets/pc8.png", 300)
        ];
    }

    actualizar() {
        //this.fondos.forEach(f => f.actualizar());
        this.pajaro.actualizar();
        this.tuberias.forEach(t => t.actualizar());
    }

    hayColision() {
        return this.tuberias.some(t => t.colisiona(this.pajaro));
    }
}
