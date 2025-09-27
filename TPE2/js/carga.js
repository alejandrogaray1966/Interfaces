// Simulación de carga con barra de progreso y animación de letras
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Obtener elementos del DOM
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const loadingScreen = document.getElementById('loading-screen');
    const siteNameSpans = document.querySelectorAll('#site-name span');

    // 2. Parámetros de la simulación
    const totalDuration = 5000; // 5000 ms = 5 segundos
    const intervalTime = 50; // Intervalo de actualización (en ms)
    const totalSteps = totalDuration / intervalTime;
    let currentStep = 0;
    let lastAnimatedLetter = -1; // Para controlar qué letras ya fueron animadas
    
    // 3. Función de actualización
    const loadingInterval = setInterval(() => {
        currentStep++;

        // Calcular el porcentaje (de 0 a 100)
        let percentage = Math.floor((currentStep / totalSteps) * 100);
        
        // Asegurarse de que no pase del 100%
        if (percentage > 100) percentage = 100;

        // Actualizar la Barra y el Texto
        progressBar.style.width = percentage + '%';
        progressText.textContent = percentage + '%';
        
        // Efecto de las letras: Aparecer progresivamente
        // Dividimos el total de letras (11) por el total de pasos para saber 
        // cuándo "activar" la siguiente letra.
        const lettersCount = siteNameSpans.length; // 11 letras
        const stepPerLetter = totalSteps / lettersCount; 
        const letterIndex = Math.floor(currentStep / stepPerLetter);
        // Asegurarse de no exceder el índice
        if (letterIndex < lettersCount && letterIndex > lastAnimatedLetter) {
            // Solo aplica la animación si es una letra nueva
            siteNameSpans[letterIndex].classList.add('span-animate');
            lastAnimatedLetter = letterIndex; // Actualiza el flag
        }

        // 4. Finalizar la Carga
        if (currentStep >= totalSteps) {
            clearInterval(loadingInterval); // Detener el intervalo
            // Una pequeña pausa antes de ocultar para que el 100% sea visible
            setTimeout(() => {
                loadingScreen.classList.add('loaded');
                window.location.href = 'html/register.html'; // Aquí podrías redirigir o mostrar el Home
            }, 500); // Espera 0.5 segundos con el 100%
        }

    }, intervalTime);
});
