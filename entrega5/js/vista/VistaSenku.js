// No necesita importar Ficha ni Tablero, solo los manipula el Controlador.
// Pero necesitamos una clase auxiliar para manejar las imágenes (opcional, pero útil)

export class VistaSenku {
    // Definición de las constantes visuales del Canvas (630x630)
    static CANVAS_TAMANIO = 630;
    static TAMANIO_TABLERO_LOGICO = 7; // El tablero es 7x7

    constructor(canvas, imagenTableroUrl) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // 1. Cálculos de Píxeles (Lo más importante)
        this.TAMANIO_CELDA = VistaSenku.CANVAS_TAMANIO / VistaSenku.TAMANIO_TABLERO_LOGICO; // 90
        
        // 2. Elementos para el Dibujo
        this.imagenFondo = new Image();
        this.imagenFondo.src = imagenTableroUrl;
        
        this.onLoadCallback = () => {}
        this.imagenFondo.onload = () => {
            this.onLoadCallback(); 
        };
        // Un caché para almacenar las imágenes de las fichas una vez cargadas.
        this.cacheImagenesFichas = {};
        
        // El Patrón "Callback" o Inyección.
        this.actualizarTiempoCronometro = () => {}; 

        //Estado de la Vista (para animaciones y selección)
        this.pistasActivas = []; 
        this.fichaArrastrada = null; 
        this.xArrastre = 0; 
        this.yArrastre = 0; 
        this.mensajeFinJuego = null; 
    }
    
    // Asigna la función (callback) de AppJuego.js que actualizará el DIV del cronómetro.
    configurarActualizacionCronometro(callback) {
        this.actualizarTiempoCronometro = callback;
    }    

    actualizarImagenTablero(nuevaUrl) {
        if (this.imagenFondo.src !== nuevaUrl) {
            this.imagenFondo.src = nuevaUrl;
        }
    }
    
    // Dibuja solo el fondo del tablero (la cuadrícula de 630x630).
    dibujarTableroFondo() {
        this.ctx.drawImage(this.imagenFondo, 0, 0, VistaSenku.CANVAS_TAMANIO, VistaSenku.CANVAS_TAMANIO);
    }
    
    // Función principal de renderizado. Dibuja el estado actual del juego.
    redibujar(matrizFichas, juegoTerminado) {
        //Limpia y dibuja el fondo
        this.dibujarTableroFondo();

        // 2. Recorre la matriz y dibuja cada ficha
        for (let fila = 0; fila < VistaSenku.TAMANIO_TABLERO_LOGICO; fila++) {
            for (let columna = 0; columna < VistaSenku.TAMANIO_TABLERO_LOGICO; columna++) {
                const ficha = matrizFichas[fila][columna];
                
                // Si hay una ficha en esa posición y NO es la que estamos arrastrando
                if (ficha && ficha !== this.fichaArrastrada) {
                    this.dibujarFicha(ficha);
                }
            }
        }
        
        // Dibuja las pistas ANIMADOS 
        if (!juegoTerminado) { 
            this.dibujarPistas();
        }        
        // Dibuja la ficha que se está arrastrando (si aplica)
        if (this.fichaArrastrada) {
            this.dibujarFichaArrastrada();
        }
    }

    // =========================================================
    // MÉTODOS DE DIBUJO DE FICHAS CON ESTILO MEDIEVAL (Actualizados)
    // =========================================================
    
    /**
     * Dibuja una única ficha en su posición de matriz (NO en su posición de arrastre).
     */
    dibujarFicha(ficha) {
        const x_pixel = ficha.columna * this.TAMANIO_CELDA;
        const y_pixel = ficha.fila * this.TAMANIO_CELDA;
        const radio = this.TAMANIO_CELDA / 2;
        const centerX = x_pixel + radio;
        const centerY = y_pixel + radio;

        // Obtiene la paleta de colores según el material
        const colores = this.obtenerColoresMaterial(ficha.tipoMaterial || 'medieval');

        // 1. DIBUJAR SOMBRA (Efecto de elevación)
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 10; // Reducido ligeramente para un tablero 7x7
        this.ctx.shadowOffsetX = 3; // Reducido ligeramente
        this.ctx.shadowOffsetY = 3; // Reducido ligeramente

        // 2. DIBUJAR BASE DE LA FICHA CON GRADIENTE 3D
        const gradientBase = this.ctx.createRadialGradient(
            centerX - radio * 0.3, // Fuente de luz desplazada
            centerY - radio * 0.3, // Fuente de luz desplazada
            radio * 0.1,
            centerX,
            centerY,
            radio * 0.9
        );
        gradientBase.addColorStop(0, colores.brillo);
        gradientBase.addColorStop(0.3, colores.claro);
        gradientBase.addColorStop(0.6, colores.base);
        gradientBase.addColorStop(0.85, colores.oscuro);
        gradientBase.addColorStop(1, colores.sombra);

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radio * 0.9, 0, Math.PI * 2);
        this.ctx.fillStyle = gradientBase;
        this.ctx.fill();
        this.ctx.restore(); // Restaura el contexto para dejar de aplicar la sombra

        // 3. DIBUJAR BORDES DE ALIVIO
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radio * 0.9, 0, Math.PI * 2);
        this.ctx.strokeStyle = colores.oscuro;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radio * 0.75, 0, Math.PI * 2);
        this.ctx.strokeStyle = colores.sombra;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // 4. DIBUJAR EL BRILLO SUPERFICIAL (Efecto "mojado")
        const gradientBrillo = this.ctx.createRadialGradient(
            centerX - radio * 0.3,
            centerY - radio * 0.3,
            0,
            centerX - radio * 0.3,
            centerY - radio * 0.3,
            radio * 0.5
        );
        gradientBrillo.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        gradientBrillo.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        gradientBrillo.addColorStop(1, 'rgba(255, 255, 255, 0)');

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radio * 0.9, 0, Math.PI * 2);
        this.ctx.fillStyle = gradientBrillo;
        this.ctx.fill();

        // 5. DIBUJAR EL ICONO
        if (ficha.iconoUrl) {
            let img = this.cacheImagenesFichas[ficha.iconoUrl];

            if (!img) {
                img = new Image();
                img.src = ficha.iconoUrl;
                this.cacheImagenesFichas[ficha.iconoUrl] = img;

                img.onload = () => {
                    if (this.onLoadCallback) {
                        this.onLoadCallback();
                    }
                };
            }

            if (img.complete) {
                const iconSize = radio * 0.9;
                //(APLICAR SOMBRA AL ICONO)
            this.ctx.save();
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'; // Color oscuro y opaco
            this.ctx.shadowBlur = 4; // Intensidad de la sombra
            this.ctx.shadowOffsetX = 2; // Desplazamiento horizontal
            this.ctx.shadowOffsetY = 2; // Desplazamiento vertical
                this.ctx.drawImage(
                    img,
                    centerX - iconSize / 2,
                    centerY - iconSize / 2,
                    iconSize,
                    iconSize
                );
            }
        }
    }

    /**
     * Devuelve la paleta de colores para el material.
     */
    obtenerColoresMaterial(tipoMaterial) {
        const materiales = {
            'antiguo': {
                /* cambio por plateadas
                base: '#8B4513',
                claro: '#CD853F',
                oscuro: '#654321',
                brillo: '#DEB887',
                sombra: '#3E2723'*/
                base: '#C0C0C0',
                claro: '#E8E8E8',
                oscuro: '#A9A9A9',
                brillo: '#F5F5F5',
                sombra: '#696969'
            },
            'medieval': {/*antes doradas, cambio por plateadas
                base: '#DAA520',
                claro: '#FFD700',
                oscuro: '#B8860B',
                brillo: '#FFF8DC',
                sombra: '#8B6914'*/
                base: '#C0C0C0',
                claro: '#E8E8E8',
                oscuro: '#A9A9A9',
                brillo: '#F5F5F5',
                sombra: '#696969'
            },
            'moderno': {
                base: '#C0C0C0',
                claro: '#E8E8E8',
                oscuro: '#A9A9A9',
                brillo: '#F5F5F5',
                sombra: '#696969'
            }
        };
        
        return materiales[tipoMaterial] || materiales['medieval'];
    }

    dibujarFichaArrastrada() {
        if (this.fichaArrastrada) {
            const radio = this.TAMANIO_CELDA / 2;
            const centerX = this.xArrastre;
            const centerY = this.yArrastre;

            const colores = this.obtenerColoresMaterial(this.fichaArrastrada.tipoMaterial || 'medieval');

            // 1. DIBUJAR SOMBRA (Efecto de elevación)
            this.ctx.save();
            this.ctx.shadowColor = 'rgba(0, 0, 0, 1.5)'; // Sombra más fuerte al arrastrar
            this.ctx.shadowBlur = 20; 
            this.ctx.shadowOffsetX = 5;
            this.ctx.shadowOffsetY = 5;

            // 2. DIBUJAR BASE DE LA FICHA CON GRADIENTE 3D
            const gradientBase = this.ctx.createRadialGradient(
                centerX - radio * 0.3,
                centerY - radio * 0.3,
                radio * 0.1,
                centerX,
                centerY,
                radio * 0.9
            );
            gradientBase.addColorStop(0, colores.brillo);
            gradientBase.addColorStop(0.3, colores.claro);
            gradientBase.addColorStop(0.6, colores.base);
            gradientBase.addColorStop(0.85, colores.oscuro);
            gradientBase.addColorStop(1, colores.sombra);

            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radio * 0.9, 0, Math.PI * 2);
            this.ctx.fillStyle = gradientBase;
            this.ctx.fill();
            this.ctx.restore();

            // 3. DIBUJAR BORDES DE ALIVIO
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radio * 0.9, 0, Math.PI * 2);
            this.ctx.strokeStyle = colores.oscuro;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radio * 0.75, 0, Math.PI * 2);
            this.ctx.strokeStyle = colores.sombra;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // 4. DIBUJAR EL BRILLO SUPERFICIAL
            const gradientBrillo = this.ctx.createRadialGradient(
                centerX - radio * 0.3,
                centerY - radio * 0.3,
                0,
                centerX - radio * 0.3,
                centerY - radio * 0.3,
                radio * 0.5
            );
            gradientBrillo.addColorStop(0, 'rgba(255, 255, 255, 0.6)'); // Más brillo al arrastrar
            gradientBrillo.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
            gradientBrillo.addColorStop(1, 'rgba(255, 255, 255, 0)');

            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radio * 0.9, 0, Math.PI * 2);
            this.ctx.fillStyle = gradientBrillo;
            this.ctx.fill();

            // 5. DIBUJAR EL ICONO
            if (this.fichaArrastrada.iconoUrl) {
                const img = this.cacheImagenesFichas[this.fichaArrastrada.iconoUrl];
                if (img && img.complete) {
                    const iconSize = radio * 0.9;
                    this.ctx.drawImage(
                        img,
                        centerX - iconSize / 2,
                        centerY - iconSize / 2,
                        iconSize,
                        iconSize
                    );
                }
            }
        }
    }

    // =========================================================
    // MÉTODOS AUXILIARES Y LÓGICA DE JUEGO (MANTENIDOS)
    // =========================================================

    // Función auxiliar para aclarar un color (ya la tenías, la mantenemos)
    aclararColor(color, porcentaje) {
        const num = parseInt(color.replace("#", ""), 16),
            amt = Math.round(2.55 * porcentaje * 100),
            R = (num >> 16) + amt,
            G = ((num >> 8) & 0x00FF) + amt,
            B = (num & 0x0000FF) + amt;
        return (
            "#" +
            (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
                (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
                (B < 255 ? (B < 1 ? 0 : B) : 255))
                .toString(16)
                .slice(1)
        );
    }
    
    // Función auxiliar para cargar y dibujar imágenes usando un caché.
    cargarYDibujarImagen(url, x, y) {
        let img = this.cacheImagenesFichas[url];
        
        if (!img) {
            img = new Image();
            img.src = url;
            this.cacheImagenesFichas[url] = img;
        }

        if (img.complete) {
            this.ctx.drawImage(img, x, y, this.TAMANIO_CELDA, this.TAMANIO_CELDA);
        } else {
            if (!img.onload) { 
                img.onload = () => {
                    if (this.onLoadCallback) { 
                        this.onLoadCallback(); 
                    }        
                };
            }
        }
    }


    setLoadCallback(callback) {
        this.onLoadCallback = callback; 
        if (this.imagenFondo.complete) { 
            this.onLoadCallback();
     }
    }
     
    //Dibuja los círculos o animaciones sobre las celdas válidas.
    dibujarPistas() {
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.4)'; // Verde semi-transparente
        this.ctx.strokeStyle = 'green';
        this.ctx.lineWidth = 3;

        for (const destino of this.pistasActivas) {
            // Calcula el centro de la celda de destino
            const x_centro = destino.columna * this.TAMANIO_CELDA + this.TAMANIO_CELDA / 2;
            const y_centro = destino.fila * this.TAMANIO_CELDA + this.TAMANIO_CELDA / 2;
            const radio = this.TAMANIO_CELDA / 3;

            this.ctx.beginPath();
            // Círculo para indicar la pista
            this.ctx.arc(x_centro, y_centro, radio, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    //resaltamos la segunda pista posible
    resaltarPistas(nuevodestino) {
        this.ctx.fillStyle = 'rgba(255, 153, 0, 0.81)'; // Verde semi-transparente
        this.ctx.strokeStyle = 'green';
        this.ctx.lineWidth = 3;

        for (const destino of this.pistasActivas) {
            // Calcula el centro de la celda de destino
            const x_centro = nuevodestino.columna * this.TAMANIO_CELDA + this.TAMANIO_CELDA / 2;
            const y_centro = nuevodestino.fila * this.TAMANIO_CELDA + this.TAMANIO_CELDA / 2;
            const radio = this.TAMANIO_CELDA / 3;

            this.ctx.beginPath();
            // Círculo para indicar la pista
            this.ctx.arc(x_centro, y_centro, radio, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();vo
        }
    }



     //Inicia el proceso de arrastre, elevando la ficha.
    iniciarArrastre(ficha, x, y) {
        this.fichaArrastrada = ficha;
        this.actualizarPosicionArrastre(x, y);
    }

    // Actualiza la posición de la ficha arrastrada con el mouse.
    actualizarPosicionArrastre(x, y) {
        const LIMITE_MINIMO_CANVAS = 0;
        const LIMITE_MAXIMO_CANVAS = VistaSenku.CANVAS_TAMANIO;

        this.xArrastre = Math.max(LIMITE_MINIMO_CANVAS, Math.min(x, LIMITE_MAXIMO_CANVAS));
        this.yArrastre = Math.max(LIMITE_MINIMO_CANVAS, Math.min(y, LIMITE_MAXIMO_CANVAS));

        if (this.fichaArrastrada) {
            this.fichaArrastrada.posicionTemporal = {
                x: this.xArrastre,
                y: this.yArrastre
            };
        }
    }    

    // Termina el arrastre.
    terminarArrastre() {
        this.fichaArrastrada = null;
    }

    
    // Convierte coordenadas de píxeles (del mouse) a coordenadas lógicas (de la matriz).
    obtenerCoordenadaLogica(xPixel, yPixel) {
        let columna = Math.floor(xPixel / this.TAMANIO_CELDA);
        let fila = Math.floor(yPixel / this.TAMANIO_CELDA);
        
        const limiteSuperior = VistaSenku.TAMANIO_TABLERO_LOGICO - 1;

        fila = Math.min(Math.max(0, fila), limiteSuperior);
        columna = Math.min(Math.max(0, columna), limiteSuperior);

        return { fila, columna };
    }

    // Determina si una coordenada lógica corresponde a una esquina no jugable.
    esPosicionNoJugable(fila, columna) {
        const estaEnFilaExtrema = (fila <= 1 || fila >= 5);
        
        if (estaEnFilaExtrema) {
            const estaEnColumnaExtrema = (columna <= 1 || columna >= 5);
            return estaEnColumnaExtrema;
        }
        
        return false;
    }

    // Muestra las celdas a resaltar para el usuario (lo llama el Controlador).
    mostrarPistas(destinos) {
        this.pistasActivas = destinos;
    }

    
     //Oculta todos las pistas activas (lo llama el Controlador cuando el arrastre termina).
    ocultarPistas() {
        this.pistasActivas = [];
    }
}