export class JuegoView {
    constructor(canvas, model) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.model = model;
    }

    dibujar() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Fondos
        this.model.fondos.forEach(f => this._dibujarFondo(f));

        // Tuberías
        this.model.tuberias.forEach(t => t.dibujar(ctx));

        // Pajaro
        this._dibujarPajaro(this.model.pajaro);
    }

    _dibujarFondo(fondo) {
        const img = fondo.img;
        if (!img.complete) return;

        const ctx = this.ctx;

        ctx.drawImage(img, fondo.x, 0);
        ctx.drawImage(img, fondo.x + img.width, 0);
    }

    _dibujarPajaro(pajaro) {
        const img = pajaro.img;
        if (!img.complete) return;

        this.ctx.drawImage(
            img,
            pajaro.frameActual * pajaro.frameW, 0,
            pajaro.frameW, pajaro.frameH,
            pajaro.x, pajaro.y,
            pajaro.frameW, pajaro.frameH
        );
    }
}
