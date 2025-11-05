// No necesita importar Ficha ni Tablero, solo los manipula el Controlador.
// Pero necesitamos una clase auxiliar para manejar las imágenes (opcional, pero útil)

export class VistaSenku {
    // Definición de las constantes visuales del Canvas (630x630)
    static CANVAS_TAMANIO = 630;
    static TAMANIO_TABLERO_LOGICO = 7; // El tablero es 7x7

    constructor(canvas, imagenTableroUrl = '../Senku/img/tablero_antiguo.png') {
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
    
    //Asigna la función (callback) de AppJuego.js que actualizará el DIV del cronómetro.
    // Esta función será llamada por el Controlador cada vez que el tiempo cambie.
    // el callback es una función que acepta un solo argumento de tipo number (los segundos restantes) y no devuelve nada.

    configurarActualizacionCronometro(callback) {
        // Renombramos la propiedad interna para usar el nuevo nombre:
        this.actualizarTiempoCronometro = callback;
    }    

    actualizarImagenTablero(nuevaUrl) {
        if (this.imagenFondo.src !== nuevaUrl) {
            this.imagenFondo.src = nuevaUrl;
            // Al cambiar el src, el evento onload se disparará cuando cargue,
            // lo que asegura el redibujado automático con el nuevo fondo.
        }
    }
    
    //Dibuja solo el fondo del tablero (la cuadrícula de 630x630).
    
    dibujarTableroFondo() {
        // 
        this.ctx.drawImage(this.imagenFondo, 0, 0, VistaSenku.CANVAS_TAMANIO, VistaSenku.CANVAS_TAMANIO);
    }
    
    //Función principal de renderizado. Dibuja el estado actual del juego.
    //Es llamada por el Controlador en cada actualización.
     
     
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
        
        //Dibuja las pistas ANIMADOS 
        if (!juegoTerminado) { 
        this.dibujarPistas();
        }        
        // Dibuja la ficha que se está arrastrando (si aplica)
        if (this.fichaArrastrada) {
            this.dibujarFichaArrastrada();
        }
        this.dibujarMensajeFinJuego();
    }

   /**
     * Dibuja una única ficha en su posición de matriz (NO en su posición de arrastre).
     */
   dibujarFicha(ficha) {
    const x_pixel = ficha.columna * this.TAMANIO_CELDA;
    const y_pixel = ficha.fila * this.TAMANIO_CELDA;
    const radio = this.TAMANIO_CELDA / 2;

    // 1. DIBUJAR EL CÍRCULO CON EFECTO 3D (Siempre se dibuja)
    const centerX = x_pixel + radio;
    const centerY = y_pixel + radio;
    const gradient = this.ctx.createRadialGradient(
        centerX, 
        centerY, 
        radio * 0.3, // Punto focal para el brillo
        centerX, 
        centerY, 
        radio
    );
    // Usa el color de la ficha (requiere el método aclararColor)
    gradient.addColorStop(0, this.aclararColor(ficha.color, 0.3)); 
    gradient.addColorStop(1, ficha.color); 

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radio * 0.9, 0, Math.PI * 2); // Un radio ligeramente menor para dejar un pequeño borde
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    // Dibujar un borde para el efecto de relieve
    this.ctx.strokeStyle = this.aclararColor(ficha.color, -0.3); // Un tono más oscuro
    this.ctx.lineWidth = 4;
    this.ctx.stroke();

    // 2. DIBUJAR EL ICONO (Si está disponible)
    if (ficha.iconoUrl) {
        let img = this.cacheImagenesFichas[ficha.iconoUrl];

        if (!img) {
            // Si no está en caché, la crea y la almacena
            img = new Image();
            img.src = ficha.iconoUrl;
            this.cacheImagenesFichas[ficha.iconoUrl] = img;

            // Si la imagen carga después, forzar un redibujado
            // Esta es la parte crucial que faltaba: asegurar que el onload llama al redibujo
            img.onload = () => {
                if (this.onLoadCallback) { 
                    this.onLoadCallback(); 
                }
            };
            
            // No dibujamos si la imagen NO está completa, esperamos el onload
        }

        if (img.complete) {
            const iconSize = radio * 0.6; // Ajustar el tamaño del icono
            this.ctx.drawImage(
                img,
                centerX - iconSize / 2,
                centerY - iconSize / 2,
                iconSize,
                iconSize
            );
        }
    }
    this.cargarYDibujarImagen(ficha.iconoUrl, x_pixel, y_pixel);
}

// Función auxiliar para aclarar un color
aclararColor(color, porcentaje) {
    // Esta función necesita ser definida o importada. 
    // La incluyo aquí para que funcione, asumiendo que el Tablero.js no la tiene.
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



dibujarFichaArrastrada() {
    if (this.fichaArrastrada) {
        const radio = this.TAMANIO_CELDA / 2;
        const centerX = this.xArrastre;
        const centerY = this.yArrastre;

        // Dibuja la ficha arrastrada con el mismo estilo que las demás
        const gradient = this.ctx.createRadialGradient(
            centerX,
            centerY,
            radio * 0.3,
            centerX,
            centerY,
            radio
        );
        gradient.addColorStop(0, this.aclararColor(this.fichaArrastrada.color, 0.3));
        gradient.addColorStop(1, this.fichaArrastrada.color);

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radio * 0.9, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        this.ctx.strokeStyle = this.aclararColor(this.fichaArrastrada.color, -0.3);
        this.ctx.lineWidth = 4;
        this.ctx.stroke();

        // Dibuja el icono si está disponible
        if (this.fichaArrastrada.iconoUrl) {
            const img = this.cacheImagenesFichas[this.fichaArrastrada.iconoUrl];
            if (img && img.complete) {
                const iconSize = radio * 0.6;
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

    
    //Función auxiliar para cargar y dibujar imágenes usando un caché.
     
    cargarYDibujarImagen(url, x, y) {
        let img = this.cacheImagenesFichas[url];
        
        if (!img) {
            // Si no está en caché, la crea y la almacena
            img = new Image();
            img.src = url;
            this.cacheImagenesFichas[url] = img;
        }

        // Dibuja solo si la imagen ya cargó
        if (img.complete) {
            this.ctx.drawImage(img, x, y, this.TAMANIO_CELDA, this.TAMANIO_CELDA);
        } else {
            // Si no cargó, se asegura de dibujarla cuando cargue
            if (!img.onload) { 
                img.onload = () => {
                    // Llama al redibujo general para dibujar todas las fichas.
                    if (this.onLoadCallback) { 
                        this.onLoadCallback(); 
                    }        
                };
            }
        }
    }


    setLoadCallback(callback) {
        this.onLoadCallback = callback; 
    
            // Chequear si la imagen ya terminó de cargar.
            // Esto es crucial para que el redibujo funcione si la imagen ya está en caché.
        if (this.imagenFondo.complete) { 
            this.onLoadCallback();
     }
}
     //Dibuja los círculos o animaciones sobre las celdas válidas.
    
    
     //Inicia el proceso de arrastre, elevando la ficha.

    iniciarArrastre(ficha, x, y) {
        this.fichaArrastrada = ficha;
        this.actualizarPosicionArrastre(x, y);
    }

    // Actualiza la posición de la ficha arrastrada con el mouse.
    actualizarPosicionArrastre(x, y) {
        // La posición de arrastre (this.xArrastre, this.yArrastre) DEBE estar limitada 
        // al rango completo del Canvas [0, 630].

        const LIMITE_MINIMO_CANVAS = 0;
        const LIMITE_MAXIMO_CANVAS = VistaSenku.CANVAS_TAMANIO; // 630

        // Clampeamos el valor del mouse (x, y) directamente al tamaño total del Canvas
        this.xArrastre = Math.max(LIMITE_MINIMO_CANVAS, Math.min(x, LIMITE_MAXIMO_CANVAS));
        this.yArrastre = Math.max(LIMITE_MINIMO_CANVAS, Math.min(y, LIMITE_MAXIMO_CANVAS));
        
    }    

    // Termina el arrastre.
    
    terminarArrastre() {
        this.fichaArrastrada = null;
    }

    
    // Convierte coordenadas de píxeles (del mouse) a coordenadas lógicas (de la matriz).
  
    obtenerCoordenadaLogica(xPixel, yPixel) {
        //Si la celda mide 90 píxeles (this.TAMANIO_CELDA = 90) y Si el mouse está en xPixel = 200
        // $200 / 90 = aprox 2.22$Math.floor(2.22) da 2. (Columna 2)
        // Esto divide el canvas en 7 zonas, y Math.floor toma el índice de la zona donde cayó el píxel
        let columna = Math.floor(xPixel / this.TAMANIO_CELDA);
        let fila = Math.floor(yPixel / this.TAMANIO_CELDA);
        
        // Definición del límite superior
        const limiteSuperior = VistaSenku.TAMANIO_TABLERO_LOGICO - 1; // 6

        // Math.max(0, fila) asegura que no sea menor que 0.
        // Math.min(..., limiteSuperior) asegura que no sea mayor que 6.
        fila = Math.min(Math.max(0, fila), limiteSuperior);
        columna = Math.min(Math.max(0, columna), limiteSuperior);

        // Se asegura de que los valores estén dentro de los límites [0, 6]
        return { fila, columna };
    }

        // 💡 NUEVA FUNCIÓN: Determina si una coordenada lógica corresponde a una esquina no jugable.
    esPosicionNoJugable(fila, columna) {
        
        // Verifica si la fila está en los extremos (0, 1, 5, 6)
        const estaEnFilaExtrema = (fila <= 1 || fila >= 5);
        
        if (estaEnFilaExtrema) {
            // Si está en una fila extrema, solo es jugable si la columna está en el centro (2, 3, 4).
            // Por lo tanto, es NO JUGABLE si la columna está en los extremos (0, 1, 5, 6).
            const estaEnColumnaExtrema = (columna <= 1 || columna >= 5);
            
            return estaEnColumnaExtrema;
        }
        
        // Si no está en una fila extrema (es decir, está en 2, 3, 4), SIEMPRE es jugable.
        return false;
    }

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


     // Muestra las celdas a resaltar para el usuario (lo llama el Controlador).

    mostrarPistas(destinos) {
        this.pistasActivas = destinos;
    }

    
     //Oculta todos las pistas activas (lo llama el Controlador cuando el arrastre termina).
    
    ocultarPistas() {
        this.pistasActivas = [];
    }


    // Muestra un mensaje en el centro del Canvas (para victoria/derrota).

    mostrarMensaje(mensaje) {
        this.mensajeFinJuego = mensaje;
    }

    // Dibuja el mensaje de fin de juego si está activo.

    dibujarMensajeFinJuego() {
        if (this.mensajeFinJuego) {
            // Fondo semi-transparente
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, VistaSenku.CANVAS_TAMANIO / 2 - 50, VistaSenku.CANVAS_TAMANIO, 100);

            // El texto del mensaje
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 40px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.mensajeFinJuego, VistaSenku.CANVAS_TAMANIO / 2, VistaSenku.CANVAS_TAMANIO / 2);
        }
    }
}