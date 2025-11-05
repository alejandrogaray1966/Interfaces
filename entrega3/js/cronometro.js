console.log("✅ cronometro.js cargado");

// ------------------------------------------------------------------------------------------------
//                                  variables del método para tomar el tiempo
// ------------------------------------------------------------------------------------------------
let tiempoInicio = null;
let intervaloCronometro = null;

// ------------------------------------------------------------------------------------------------
//                                  método para comenzar el tiempo
// ------------------------------------------------------------------------------------------------
export const iniciarCronometro = (tiempoLimite, onTiempoAgotado) => {
    tiempoInicio = Date.now();
    const cronometroEl = document.getElementById('cronometro');

    intervaloCronometro = setInterval(() => {
        const ahora = Date.now();
        const tiempoTranscurrido = Math.floor((ahora - tiempoInicio) / 1000);
        const minutos = String(Math.floor(tiempoTranscurrido / 60)).padStart(2, '0');
        const segundos = String(tiempoTranscurrido % 60).padStart(2, '0');
        cronometroEl.textContent = `Tiempo ${minutos}:${segundos}`;

        // ⛔ Verificamos si se agotó el tiempo
        if(tiempoTranscurrido > (tiempoLimite * 0.66)){
            const ayudaPiezaFija= document.getElementById('ayudaPiezaFija');
            const ayuditaBtn= document.getElementById('ayuditaBtn');
            const ayudas= document.getElementById('ayudas');

            
            ayudaPiezaFija.disabled = true;
            ayuditaBtn.style.opacity = "0.2"; 
            ayudas.style.display = "none";


        }
        if (tiempoTranscurrido >= tiempoLimite) {
            // Detenemos el cronómetro
            clearInterval(intervaloCronometro);
            if (typeof onTiempoAgotado === 'function') {  
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
    clearInterval(intervaloCronometro);

    const ahora = Date.now();
    const tiempoFinal = Math.floor((ahora - tiempoInicio) / 1000);

    // Llamamos a la función externa que maneja el resultado
    if (typeof onJuegoTerminado === 'function') {
        onJuegoTerminado(tiempoFinal);
    }
};

// ------------------------------------------------------------------------------------------------
//                                  método para penalizar tiempo
// ------------------------------------------------------------------------------------------------
export function penalizarTiempo(extraSegundos) {
    if (tiempoInicio) {
        tiempoInicio -= extraSegundos * 1000;
    }
}

// --------------------------------------------------------------------------------------- FIN ----