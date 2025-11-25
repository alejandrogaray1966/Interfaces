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
        let img, frameW, frameH, frameActual;
    
        // --- LÓGICA DE SELECCIÓN DE SPRITESHEET ---
        if (pajaro.estado === 'muriendo') {
            img = pajaro.imgMuerte; // ¡Usar el spritesheet de muerte!
            frameW = pajaro.frameWMuerte; 
            frameH = pajaro.frameHMuerte;
            frameActual = pajaro.frameActualMuerte;
    
            // Opcional: Rotación para simular la caída (se requiere una transformación del contexto)
            this.ctx.save();
            // Trasladar al centro del pájaro (para que rote sobre su centro)
            this.ctx.translate(pajaro.x + frameW / 2, pajaro.y + frameH / 2);
            // Rotación progresiva, por ejemplo, basada en la velocidad de caída (velY)
            const rotacion = Math.min(90, Math.max(-90, pajaro.velY * 8)); // Límite a 90 grados
            this.ctx.rotate(rotacion * Math.PI / 180); // Convertir grados a radianes
    
            // Dibujar el frame de la animación de muerte
            this.ctx.drawImage(
                img,
                frameActual * frameW, 0,
                frameW, frameH,
                -frameW / 2, -frameH / 2, // Dibujar centrado en el nuevo origen
                frameW, frameH
            );
    
            this.ctx.restore(); // Restaurar el contexto sin rotación
    
        } else {
            // Estado 'volando' normal
            img = pajaro.img;
            frameW = pajaro.frameW;
            frameH = pajaro.frameH;
            frameActual = pajaro.frameActual;
    
            this.ctx.drawImage(
                img,
                frameActual * frameW, 0,
                frameW, frameH,
                pajaro.x, pajaro.y,
                frameW, frameH
            );
        }
    
        // NO DIBUJAR LA CAJA DE COLISIÓN SI LA ANIMACIÓN TERMINÓ
        //if (pajaro.estado !== 'muriendo' || !pajaro.animacionMuerteTerminada) {
           // const box = pajaro.getColisionBox();
            //this.ctx.strokeStyle = 'red';
            //this.ctx.lineWidth = 2;
            //this.ctx.strokeRect(box.x, box.y, box.w, box.h);
       // }
    }
    
    _dibujarPuntuacion(score) { // <-- ¡NUEVO MÉTODO!
        const ctx = this.ctx;
        ctx.fillStyle = 'white';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Puntos: ${score}`, 20, 40); 
    }

}
