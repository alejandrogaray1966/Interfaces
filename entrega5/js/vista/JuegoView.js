export class JuegoView {
    constructor(canvas, model) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.model = model;
    }

   

    dibujar() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Obstaculos
        this.model.obstaculos.forEach(obs => {obs.dibujar(ctx);});    
        
        // Coleccionables // <-- ¡NUEVA LÍNEA!
        this.model.coleccionables.forEach(col => {col.dibujar(ctx);});

        // Pajaro
        this._dibujarPajaro(this.model.pajaro);

        // Puntuación // <-- ¡NUEVA LÍNEA!
        this._dibujarPuntuacion(this.model.score);
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

        //Dibujar la caja de colisión del pájaro
        const box = pajaro.getColisionBox();
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(box.x, box.y, box.w, box.h);
    }

    _dibujarPuntuacion(score) { // <-- ¡NUEVO MÉTODO!
        const ctx = this.ctx;
        ctx.fillStyle = 'black';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Puntos: ${score}`, 20, 40); 
    }

}
