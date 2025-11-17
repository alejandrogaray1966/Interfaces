import { Pajaro } from "./Pajaro.js";
import { FondoParallax } from "./FondoParallax.js";
import { Tuberia } from "./Tuberia.js";

export class JuegoModel {
    constructor() {

        // Fondos (agregás los que quieras)
        this.fondos = [
            new FondoParallax("./assets/ContenedorCImgJuego.png", 0.1),
            new FondoParallax("./assets/2.Trees_back.png", 0.2),
            new FondoParallax("./assets/3.Trees_back.png", 0.4),
            new FondoParallax("./assets/3.Trees_front.png", 0.8),
            new FondoParallax("./assets/4.Ground.png", 1.0),

            // Puedes agregar más:
            // new FondoParallax("img/capa6_loquesea.png", 1.2),
            // new FondoParallax("img/capa7_loquesea.png", 1.4),
        ];

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
        this.fondos.forEach(f => f.actualizar());
        this.pajaro.actualizar();
        this.tuberias.forEach(t => t.actualizar());
    }

    hayColision() {
        return this.tuberias.some(t => t.colisiona(this.pajaro));
    }
}
