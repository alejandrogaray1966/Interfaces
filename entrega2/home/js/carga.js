// Simulación de carga con barra de progreso y animación de letras (realista)
document.addEventListener('DOMContentLoaded', () => {

    // 1. Obtener elementos del DOM
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const loadingScreen = document.getElementById('loading-screen');
    const siteNameSpans = document.querySelectorAll('#site-name span');

    // 2. Parámetros
    const totalDuration = 5000; // 50ms * 100 pasos = 5 segundos "reales"
    const lettersCount = siteNameSpans.length;
    let currentStep = 0;
    let lastAnimatedLetter = -1;

    // 3. Secuencia de intervalos variables (ms de espera entre pasos)
    //    👉 A veces rápido, a veces lento, con pausas incluidas
    const intervals = [
        10, 15, 20, 10, 15, 20, 30, 40 , 50, 50, 20, 30,        // medio rápido
        50, 70, 200, 250, 150, 200, 150, 50, 50, 20, 30,        // pequeña pausa
        30, 40, 200, 60, 50, 300, 70, 80, 100, 500, 800,        // irregular
        1000, 1400, 2000,                                       // lento lento
        50 , 200, 250, 300, 250, 200, 150, 100, 50, 40,         // otro pequeña "traba"
        20, 15, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5                    // muy rápido
    ];
    let intervalIndex = 0;

    // 4. Función de actualización
    function updateProgress() {
        currentStep++;

        // Calcular porcentaje (0 a 100)
        let percentage = Math.floor((currentStep / 100) * 100);
        if (percentage > 100) percentage = 100;

        // Actualizar barra y texto
        progressBar.style.width = percentage + '%';
        progressText.textContent = percentage + '%';

        // Animar letras progresivamente
        const stepPerLetter = 100 / lettersCount;
        const letterIndex = Math.floor(currentStep / stepPerLetter);

        // Asegurarse de no exceder el índice
        if (letterIndex < lettersCount && letterIndex > lastAnimatedLetter) {
            // Solo aplica la animación si es una letra nueva
            siteNameSpans[letterIndex].classList.add('span-animate');
            lastAnimatedLetter = letterIndex;
        }

        // ¿Terminó?
        if (percentage >= 100) {
            loadingScreen.classList.add('loaded');
            setTimeout(() => {
                window.location.href = './index.html'; // Aquí podrías redirigir o mostrar el Home
            }, 900); // Espera 0.9 segundos con el 100%
            return; // Detener el intervalo
        }

        // Calcular el próximo intervalo (si no hay más, usar 50ms por defecto)
        const nextInterval = intervals[intervalIndex] || 50;
        intervalIndex++;

        setTimeout(updateProgress, nextInterval);
    }

    // 5. Iniciar la simulación
    updateProgress();
});

