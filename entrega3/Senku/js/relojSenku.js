console.log("✅ relojSenku.js cargado");

// se importan los métodos de la clase vistaSenku.js
import { mostrarPenalizacionVisual } from './vistaSenku.js';

// ------------------------------------------------------------------------------------------------
//                                  variables del método para tomar el tiempo
// ------------------------------------------------------------------------------------------------
let tiempoInicio = null;
let intervaloCronometro = null;

// ------------------------------------------------------------------------------------------------
//                                  método para comenzar el tiempo
// ------------------------------------------------------------------------------------------------
export const iniciarCronometro = (tiempoLimite, onTiempoAgotado) => {

    // Inicializar el tiempo de inicio
    tiempoInicio = Date.now();
    const cronometroEl = document.getElementById('cronometro');

    // Iniciar el intervalo para actualizar el cronómetro cada segundo
    intervaloCronometro = setInterval(() => {

        // Calcular el tiempo transcurrido
        const ahora = Date.now();
        const tiempoTranscurrido = Math.floor((ahora - tiempoInicio) / 1000);
        const minutos = String(Math.floor(tiempoTranscurrido / 60)).padStart(2, '0');
        const segundos = String(tiempoTranscurrido % 60).padStart(2, '0');
        cronometroEl.textContent = `Tiempo ${minutos}:${segundos}`;

        // 🟡 Cambiar color según el progreso: alerta visual !!!
        const progreso = tiempoTranscurrido / tiempoLimite;
        if (progreso < 0.25) {
            cronometroEl.style.color = 'white';
        } else if (progreso < 0.5) {
            cronometroEl.style.color = 'yellow';
        } else if (progreso < 0.75) {
            cronometroEl.style.color = 'orange';
        } else {
            cronometroEl.style.color = 'red';
        }

        // ⛔ Verificamos si se agotó el tiempo
        if (tiempoTranscurrido >= tiempoLimite) {
            // Detenemos el cronómetro
            clearInterval(intervaloCronometro);
            if (typeof onTiempoAgotado === 'function') {  
                mostrarPenalizacionVisual();
                // Llamamos a la función que maneja la derrota por tiempo agotado
                onTiempoAgotado(); 
            }
        }

    }, 500);

};

// ------------------------------------------------------------------------------------------------
//                                  método para parar el tiempo
// ------------------------------------------------------------------------------------------------
export const detenerCronometro = (onJuegoTerminado) => {

    // Detener el cronómetro
    clearInterval(intervaloCronometro);

    // Calcular el tiempo final en segundos
    const ahora = Date.now();
    const tiempoFinal = Math.floor((ahora - tiempoInicio) / 1000);

    // Llamamos a la función externa que maneja el resultado
    if (typeof onJuegoTerminado === 'function') {
        onJuegoTerminado(tiempoFinal);
    }

};

// --------------------------------------------------------------------------------------- FIN ----