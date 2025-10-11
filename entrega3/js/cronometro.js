// ------------------------------------------------------------------------------------------------
//                                  variables del método para tomar el tiempo
// ------------------------------------------------------------------------------------------------
let tiempoInicio = null;
let intervaloCronometro = null;

// ------------------------------------------------------------------------------------------------
//                                  método para comenzar el tiempo
// ------------------------------------------------------------------------------------------------
export const iniciarCronometro = () => {
    tiempoInicio = Date.now();
    const cronometroEl = document.getElementById('cronometro');

    intervaloCronometro = setInterval(() => {
        const ahora = Date.now();
        const tiempoTranscurrido = Math.floor((ahora - tiempoInicio) / 1000);
        const minutos = String(Math.floor(tiempoTranscurrido / 60)).padStart(2, '0');
        const segundos = String(tiempoTranscurrido % 60).padStart(2, '0');
        cronometroEl.textContent = `Tiempo: ${minutos}:${segundos}`;
    }, 1000);
};

// ------------------------------------------------------------------------------------------------
//                                  método para parar el tiempo
// ------------------------------------------------------------------------------------------------
export const detenerCronometro = () => {
    clearInterval(intervaloCronometro);
};
