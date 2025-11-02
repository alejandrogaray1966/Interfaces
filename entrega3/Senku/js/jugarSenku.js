console.log("✅ jugarSenku.js cargado");

// se importan los métodos de la clase relojSenku.js
import { iniciarCronometro, detenerCronometro } from './relojSenku.js';
// se importan los métodos de la clase vistaSenku.js
import { exito, mostrarDerrotaConManitos, mostrarVictoriaConManitos } from './vistaSenku.js';

        // ----------------------- Variables Globales del Juego ---
        let tiempoLimite = 0;

        // ----------------------- Estado inicial del tablero
        let INITIAL_BOARD = [];

        let tablero = JSON.parse(JSON.stringify(INITIAL_BOARD)); // Clonar el tablero inicial
        let fichaArrastrandose = null; // { row, col } de la ficha seleccionada
        let isDragging = false;
        let mouseX = 0;
        let mouseY = 0;
        let validTargets = []; // Almacena { row, col } de los destinos válidos
        let hoverTarget = null; // Almacena { row, col } del destino sobre el que se está

        // ----------------------- Configuración y Contexto del Canvas ---
        const CANVAS_SIZE = 630; 
        const GRID_SIZE = 7;
        const CELL_SIZE = CANVAS_SIZE / GRID_SIZE; // 90px
        
        // ----------------------- Configuraciones de Color por tipo de ficha ---
        const COLOR_CONFIGS = {
            verde: {
                pegColor: '#a7f3d0',
                pegStrokeColor: '#065f46',
                targetRingColor: '#d1e7dd',
                hoverRingColor: '#409c69'
            },
            azul: {
                pegColor: '#60a5fa',
                pegStrokeColor: '#1e3a8a',
                targetRingColor: '#dbeafe',
                hoverRingColor: '#3b82f6'
            },
            amarilla: {
                pegColor: '#fef08a',
                pegStrokeColor: '#92400e',
                targetRingColor: '#fef9c3',
                hoverRingColor: '#facc15'
            }
        };

        // ----------------------- Parámetros de Ficha y Estilos por defecto ---
        const PEG_RADIUS = 25; 
        let PEG_COLOR = '#a7f3d0'; 
        let PEG_STROKE_COLOR = '#065f46'; 
        const PEG_STROKE_WIDTH = 3; 
        
        // ----------------------- Nuevos Estilos de Feedback por defecto ---
        let TARGET_RING_COLOR = '#d1e7dd'; // Verde claro para el destino posible
        let HOVER_RING_COLOR = '#409c69'; // Verde más oscuro para el destino "hovered"

        let canvas;
        let ctx;
        
        const statusMessage = document.getElementById('status-message');
        const pegCountDisplay = document.getElementById('peg-count');
        
        // -------------------------------- Funciones de Ayuda para Dibujar en Canvas ----------------------------------
        
        /**
         * Dibuja un círculo en coordenadas de PIXEL.
         */
        function dibujarCircleAtCoords(x, y, radius, fillColor, strokeColor, strokeWidth, shadow = true) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            
            if (shadow) {
                ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetY = 5;
            }
            
            if (strokeWidth > 0) {
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = strokeWidth;
                ctx.stroke();
            }
            
            ctx.fillStyle = fillColor;
            ctx.fill();
            
            ctx.shadowColor = 'transparent'; 
        }

        /**
         * Calcula el centro en píxeles de una celda de la cuadrícula.
         */
        function getCellCenter(row, col) {
            const centerX = col * CELL_SIZE + CELL_SIZE / 2;
            const centerY = row * CELL_SIZE + CELL_SIZE / 2;
            return { centerX, centerY };
        }
        
        /**
         * Dibuja una ficha (peg) en la cuadrícula.
         */
        function dibujarPeg(row, col, color = PEG_COLOR, hasShadow = true) {
            const { centerX, centerY } = getCellCenter(row, col);
            dibujarCircleAtCoords(centerX, centerY, PEG_RADIUS, color, PEG_STROKE_COLOR, PEG_STROKE_WIDTH, hasShadow);
        }

        /**
         * Dibuja el círculo de destino resaltado.
         */
        function dibujarTargetRing(row, col, color) {
            const { centerX, centerY } = getCellCenter(row, col);
            // Dibujamos el anillo sin relleno, solo borde.
            ctx.beginPath();
            ctx.arc(centerX, centerY, PEG_RADIUS * 1.2, 0, Math.PI * 2);
            
            // Sombra sutil para destacar
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetY = 3;
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 4;
            ctx.stroke();
            
            // Resetear la sombra
            ctx.shadowColor = 'transparent'; 
        }


        /**
         * Dibuja todo el tablero.
         */
        function dibujarTablero() {

            ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

            // 1. Dibujar los Anillos de Destino Válidos (si hay una ficha seleccionada)
            if (fichaArrastrandose) {
                for (const target of validTargets) {
                    // Determinar color: HOVER si el puntero está sobre este destino, TARGET_RING si no.
                    const color = (hoverTarget && target.row === hoverTarget.row && target.col === hoverTarget.col) 
                        ? HOVER_RING_COLOR 
                        : TARGET_RING_COLOR;
                    dibujarTargetRing(target.row, target.col, color);
                }
            }


            // 2. Dibujar las Fichas (estado '1' en la matriz)
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    if (tablero[r][c] === 1) {
                        
                        const isSelected = fichaArrastrandose && fichaArrastrandose.row === r && fichaArrastrandose.col === c;

                        // Si estamos arrastrando (isDragging) NO dibujamos el peg en la posición original.
                        // Si está seleccionado pero NO arrastrando, lo dibujamos en la posición original.
                        if (isDragging && isSelected) {
                            continue; // No la dibujamos, se dibujará después como ficha flotante
                        }

                        if (isSelected) {
                            // Usamos dibujarPeg con hasShadow = false para un efecto de 'pulsado' o 'incrustado'
                            // Mantiene el color PEG_COLOR y el borde PEG_STROKE_COLOR
                            dibujarPeg(r, c, PEG_COLOR, false); 
                        } else {
                            // Ficha normal
                            dibujarPeg(r, c, PEG_COLOR, true);
                        }
                        
                    } 
                }
            }
            // 3. Dibujar el peg flotante ÚLTIMO (con color y borde original, y con sombra)
            if (isDragging) {
                // Usamos PEG_COLOR, PEG_STROKE_COLOR, y PEG_STROKE_WIDTH para que parezca el peg original
                dibujarCircleAtCoords(
                    mouseX, 
                    mouseY, 
                    PEG_RADIUS, 
                    PEG_COLOR,          // <-- ¡CAMBIAR AQUÍ! Relleno verde claro original
                    PEG_STROKE_COLOR,   // <-- ¡CAMBIAR AQUÍ! Borde oscuro original
                    PEG_STROKE_WIDTH,   // <-- ¡CAMBIAR AQUÍ! Ancho del borde original
                    true                // Mantenemos la sombra para que parezca que está flotando
                ); 
            }
        }


        /**
         * Determina los destinos válidos para una ficha en (fromRow, fromCol).
         */
        function getValidMoves(fromRow, fromCol) {
            const moves = [
                { dr: 0, dc: 2 }, { dr: 0, dc: -2 }, 
                { dr: 2, dc: 0 }, { dr: -2, dc: 0 }  
            ];
            
            const valid = [];

            for (const move of moves) {
                const tr = fromRow + move.dr;
                const tc = fromCol + move.dc;
                const jr = fromRow + move.dr / 2;
                const jc = fromCol + move.dc / 2;

                // 1. Check de límites para destino
                if (tr >= 0 && tr < GRID_SIZE && tc >= 0 && tc < GRID_SIZE) {
                    // 2. Check: Destino está vacío y es una celda jugable (no '9')
                    if (tablero[tr][tc] === 0) {
                        // 3. Check: Celda intermedia tiene una ficha ('1')
                        if (tablero[jr][jc] === 1) {
                            valid.push({ row: tr, col: tc });
                        }
                    }
                }
            }
            return valid;
        }

        /**
         * Intenta mover la ficha. (Lógica de movimiento del código original)
         */
        function moverFicha(fromRow, fromCol, toRow, toCol) {
            // Buscamos si el destino está en la lista precalculada de destinos válidos
            const isValidTarget = validTargets.some(target => target.row === toRow && target.col === toCol);

            if (!isValidTarget) {
                statusMessage.textContent = "Movimiento. inválido: destino no es un salto legal.";
                return false;
            }
            
            // La ficha intermedia está garantizada por getValidMoves
            const dRow = toRow - fromRow;
            const dCol = toCol - fromCol;
            const jumpedRow = fromRow + dRow / 2;
            const jumpedCol = fromCol + dCol / 2;

            // Realizar el movimiento (Actualizar el estado LÓGICO del tablero)
            tablero[toRow][toCol] = 1;      
            tablero[fromRow][fromCol] = 0;  
            tablero[jumpedRow][jumpedCol] = 0; 

            statusMessage.textContent = `¡Movimiento exitoso!`;
            
            checkGameStatus();
            return true;
        }


        // --- Lógica de Interacción (Eventos del Puntero) ---

        function getGridCoordinates(clientX, clientY) {
            const rect = canvas.getBoundingClientRect();
            const canvasX = clientX - rect.left;
            const canvasY = clientY - rect.top;

            const col = Math.floor(canvasX / CELL_SIZE);
            const row = Math.floor(canvasY / CELL_SIZE);

            return { row, col, canvasX, canvasY };
        }

        /**
         * Inicia el arrastre (pointerdown handler).
         */
        function handleStart(e) {
            e.preventDefault(); 
            e.stopPropagation(); 
            
            if (e.pointerId !== undefined) {
                canvas.setPointerCapture(e.pointerId);
            }

            const { row, col, canvasX, canvasY } = getGridCoordinates(e.clientX, e.clientY);

            if (isDragging) return;

            if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE && tablero[row][col] === 1) {
                fichaArrastrandose = { row, col };
                
                // *** NUEVA LÍNEA CLAVE: Pre-calcular destinos válidos ***
                validTargets = getValidMoves(row, col);
                
                if (validTargets.length === 0) {
                    statusMessage.textContent = "Ficha seleccionada. No tiene movimientos válidos.";
                } else {
                    statusMessage.textContent = `Ficha seleccionada. Hay ${validTargets.length} destinos posibles.`;
                }
                
                mouseX = canvasX;
                mouseY = canvasY;
                
                dibujarTablero(); 
            } else {
                // Si no seleccionamos una ficha, aseguramos que el estado de destino esté limpio
                validTargets = [];
                fichaArrastrandose = null;
                dibujarTablero(); // Para limpiar visualmente
                statusMessage.textContent = "Selecciona una ficha para empezar.";
            }
            
            document.documentElement.scrollLeft = 0;
            document.body.scrollLeft = 0;
        }
        
        /**
         * Maneja el arrastre visual (pointermove handler).
         */
        function handleMove(e) {
            e.stopPropagation(); 
            
            if (!fichaArrastrandose) return;

            if (isDragging) {
                 e.preventDefault();
            }

            const { row: startRow, col: startCol } = fichaArrastrandose;
            const { canvasX, canvasY, row: currentGridRow, col: currentGridCol } = getGridCoordinates(e.clientX, e.clientY);
            
            if (!isDragging) {
                const { centerX: startX, centerY: startY } = getCellCenter(startRow, startCol);
                
                const distanceSq = (canvasX - startX)**2 + (canvasY - startY)**2;
                const MIN_DRAG_DISTANCE_SQ = 100; // 10px al cuadrado
                
                if (distanceSq > MIN_DRAG_DISTANCE_SQ) {
                    isDragging = true;
                    // Al confirmar el drag, limpiamos el status para no estorbar
                    statusMessage.textContent = "Arrastrando... Suelta sobre un círculo de destino.";
                } else {
                    return; 
                }
            }

            // Lógica de Detección de Hover (Solo si estamos arrastrando)
            let newHoverTarget = null;
            
            // Solo hacemos hover si la casilla actual está dentro de los destinos válidos.
            const isOverValidTarget = validTargets.some(target => 
                target.row === currentGridRow && target.col === currentGridCol
            );

            if (isOverValidTarget) {
                newHoverTarget = { row: currentGridRow, col: currentGridCol };
            }

            // Solo redibujamos si el hover state ha cambiado
            if (!hoverTarget || !newHoverTarget || hoverTarget.row !== newHoverTarget.row || hoverTarget.col !== newHoverTarget.col) {
                hoverTarget = newHoverTarget;
                dibujarTablero();
            }
            
            mouseX = canvasX;
            mouseY = canvasY;
            
            // Redibujar el peg flotante incluso si el hover no ha cambiado
            // Solo necesitamos llamar a dibujarTablero si el peg flotante no está dibujado aún,
            // pero para simplificar, redibujamos si el estado de arrastre está activo.
            if (isDragging) {
                dibujarTablero();
            }

            canvas.style.cursor = 'grabbing';
        }


        /**
         * Finaliza el arrastre e intenta el movimiento (pointerup handler).
         */
        function handleEnd(e) {
            if (!fichaArrastrandose) return;
            
            e.preventDefault(); 
            e.stopPropagation(); 
            
            const pointerId = e.pointerId;

            const { row: fromRow, col: fromCol } = fichaArrastrandose;
            const { row: toRow, col: toCol } = getGridCoordinates(e.clientX, e.clientY);
            
            const wasDragging = isDragging;
            isDragging = false; 
            hoverTarget = null; // Limpiar el estado de hover

            canvas.style.cursor = 'pointer';

            if (fromRow === toRow && fromCol === toCol && !wasDragging) {
                // Click simple para deseleccionar
                statusMessage.textContent = "Ficha deseleccionada.";
            } else if (wasDragging) {
                // Intento de movimiento
                moverFicha(fromRow, fromCol, toRow, toCol);
            } else {
                // Drag fallido en la misma casilla
                statusMessage.textContent = "Arrastre cancelado.";
            }
            
            // Resetear estados LÓGICOS y forzar el redibujo.
            fichaArrastrandose = null;
            validTargets = []; // Limpiar los destinos visuales
            dibujarTablero(); 

            document.documentElement.scrollLeft = 0;
            document.body.scrollLeft = 0;

            if (pointerId !== undefined) {
                canvas.releasePointerCapture(pointerId);
            }
        }
        
        /**
         * Maneja cuando el navegador interrumpe la interacción.
         */
        function handleCancel(e) {
            e.preventDefault();
            e.stopPropagation();
            
            isDragging = false;
            fichaArrastrandose = null;
            validTargets = []; // Limpiar destinos
            hoverTarget = null; // Limpiar hover
            canvas.style.cursor = 'pointer';
            statusMessage.textContent = "Acción cancelada. Selecciona una ficha.";
            dibujarTablero();
            
            document.documentElement.scrollLeft = 0;
            document.body.scrollLeft = 0;

            if (e.pointerId !== undefined) {
                canvas.releasePointerCapture(e.pointerId);
            }
        }

        // ----------------------------------------------------------------------------------------------------------
        // ------------------------------------ Lógica del Juego y Control de Flujo ---------------------------------
        // ----------------------------------------------------------------------------------------------------------
        function checkGameStatus() {
            // Inicializar contadores
            let pegCount = 0;
            let possibleMoves = 0;
            // Contar fichas y posibles movimientos
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    if (tablero[r][c] === 1) {
                        pegCount++;
                        possibleMoves += getValidMoves(r, c).length;
                    }
                }
            }
            // Actualizar el contador visible
            pegCountDisplay.textContent = pegCount; 
            // Lógica de fin de juego
            if (possibleMoves === 0) {
                // Desactivar interacción
                canvas.removeEventListener('pointerdown', handleStart);
                canvas.removeEventListener('pointerup', handleEnd);
                canvas.removeEventListener('pointermove', handleMove); 
                canvas.removeEventListener('pointercancel', handleCancel); 
                // Verificar el estado del juego y mostrar mensaje adecuado
                if (pegCount === 1) {
                    // Detener el cronómetro y obtener el tiempo final
                    detenerCronometro((tiempoFinal) => {
                                        statusMessage.textContent = `🎉 ¡Ganaste! ¡Solo queda 1 ficha!`;
                                        //actualizarRanking('Matías', tiempoFinal); --------------------------------> actualizar ranking aca !!!!!!!!!
                                        // Festejo con papelitos
                                        exito();
                                        // Espera 3 segundos y Mostrar opciones de reinicio o inicio
                                        setTimeout(() => {
                                            onTiempoAgotado();
                                        }, 3000);
                    }); 
                } else {
                    // Detener el cronómetro
                    detenerCronometro();
                    statusMessage.textContent = `🛑 ¡Juego terminado! Quedaron ${pegCount} fichas.`;
                    mostrarDerrotaConManitos();
                    // Espera 3 segundos y Mostrar opciones de reinicio o inicio
                    setTimeout(() => {
                        onTiempoAgotado();
                    }, 3000);
                }
            }
        }

        // ----------------------------------------------------------------------------------------------------------
        // -------------------- Función que se comienza nuevamente el juego con los mismos parámetros ---------------
        // ----------------------------------------------------------------------------------------------------------
        function resetGame() {
            // Clonar el estado inicial
            tablero = JSON.parse(JSON.stringify(INITIAL_BOARD)); 
            fichaArrastrandose = null;
            isDragging = false;
            validTargets = [];
            hoverTarget = null;
            // Ocultamos el popover y lo aseguramos interactivo
            const popover = document.getElementById('id-popover');
            popover.style.display = 'none';
            // Obtenemos el canvas actual (por si fue clonado/reemplazado)
            const currentCanvas = document.getElementById('senkuCanvas');
            if (currentCanvas) {
                currentCanvas.style.pointerEvents = 'auto';
                currentCanvas.style.opacity = '1';
            }
            // dibujamos el tablero reiniciado
            dibujarTablero();
            statusMessage.textContent = "Tablero reiniciado. Selecciona una ficha.";
            // Re-añadir listeners (eliminar primero en caso de que el juego estuviera terminado)
            canvas.removeEventListener('pointerdown', handleStart);
            canvas.removeEventListener('pointerup', handleEnd);
            canvas.removeEventListener('pointermove', handleMove);
            canvas.removeEventListener('pointercancel', handleCancel);
            // Re-añadir los listeners
            canvas.addEventListener('pointerdown', handleStart);
            canvas.addEventListener('pointerup', handleEnd);
            canvas.addEventListener('pointermove', handleMove);
            canvas.addEventListener('pointercancel', handleCancel);
            // Ubicar el scroll al inicio
            document.documentElement.scrollLeft = 0;
            document.body.scrollLeft = 0;
            // Reiniciar el cronómetro y el estado del juego
            iniciarCronometro(tiempoLimite, onTiempoAgotado);
            checkGameStatus();
        }

        // ----------------------------------------------------------------------------------------------------------
        // ---------------------------------  Función que se llamará al agotar el tiempo ----------------------------
        // ----------------------------------------------------------------------------------------------------------
        const onTiempoAgotado = () => {
            // Obtenemos el canvas actual (por si fue clonado/reemplazado)
            const currentCanvas = document.getElementById('senkuCanvas');
            if (currentCanvas) {
                currentCanvas.style.pointerEvents = 'none';
                currentCanvas.style.opacity = '0.3';
            }
            // Deshabilitamos los botones del juego
            const verificarBtn = document.getElementById('verificarBtn');
            verificarBtn.disabled = true;
            // Mostramos el popover y lo aseguramos interactivo
            const popover = document.getElementById('id-popover');
            popover.style.display = 'flex';
            popover.style.pointerEvents = 'auto';
            popover.style.zIndex = '1000'; // Aseguramos que esté por encima
            // Limpiamos listeners previos
            const reintentarSenku = document.getElementById('reintentar-Senku');
            reintentarSenku.replaceWith(reintentarSenku.cloneNode(true));
            const newReintentarSenku = document.getElementById('reintentar-Senku');
            // Manejador para reintentar
            newReintentarSenku.addEventListener('click', () => {
                resetGame()
            }, { once: true });
            // Manejador para volver al inicio
            const inicioSenku = document.getElementById('inicio-Senku');
            if (inicioSenku) {
                inicioSenku.addEventListener('click', () => {
                    location.reload();
                }, { once: true });
            }
        };

        // ----------------------------------------------------------------------------------------------------------
        // ------------------------------------- Inicialización -----------------------------------------------------
        // ----------------------------------------------------------------------------------------------------------
        export function iniciarJuego(MATRIZ, ficha, tiempo) {
            // Guardamos el estado inicial para reinicios
            INITIAL_BOARD = JSON.parse(JSON.stringify(MATRIZ));
            tablero = JSON.parse(JSON.stringify(INITIAL_BOARD));
            // Configuramos el límite de tiempo
            tiempoLimite = tiempo;
            // Configuramos los colores según la ficha seleccionada
            const colores = COLOR_CONFIGS[ficha] || COLOR_CONFIGS['verde']; // fallback a verde
            // Aplicar configuración de colores
            PEG_COLOR = colores.pegColor;
            PEG_STROKE_COLOR = colores.pegStrokeColor;
            TARGET_RING_COLOR = colores.targetRingColor;
            HOVER_RING_COLOR = colores.hoverRingColor;
            // Configuramos el canvas y contexto
            canvas = document.getElementById('senkuCanvas');
            ctx = canvas.getContext('2d');
            // agregamos los escuchadores de eventos para la interacción
            canvas.addEventListener('pointerdown', handleStart);
            canvas.addEventListener('pointerup', handleEnd);
            canvas.addEventListener('pointermove', handleMove);
            canvas.addEventListener('pointercancel', handleCancel); 
            // Prevenir comportamiento por defecto de arrastrar imágenes
            canvas.addEventListener('dragstart', (e) => e.preventDefault());
            // Inicializar estado del juego
            const verificarBtn = document.getElementById('verificarBtn');
            verificarBtn.disabled = false;
            verificarBtn.addEventListener('click', resetGame);
            // Dibujar el tablero inicial , iniciar cronómetro y comenzar chequeo de estado
            dibujarTablero();
            iniciarCronometro(tiempoLimite, onTiempoAgotado);
            checkGameStatus();
        };
