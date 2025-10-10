document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.querySelector('.game-btnPlay');
    const ruletaContainer = document.getElementById('ruleta-container');
    const winnerDisplay = document.getElementById('winner-display');
    const gameImages = document.querySelectorAll('#ruleta-container img');
    const totalImages = gameImages.length; 
    let intervalId = null;

    const removeSelection = () => {
        gameImages.forEach(img => {
            img.classList.remove('selected-random');
        });
    };

    const startRandomSelection = () => {
        // Limpiar estados previos
        if (intervalId) clearInterval(intervalId);
        removeSelection();
        ruletaContainer.classList.remove('hidden'); // Aseguramos que la ruleta esté visible al inicio
        winnerDisplay.classList.remove('visible');
        winnerDisplay.innerHTML = ''; // Limpiamos el contenido anterior

        const finalRandomIndex = Math.floor(Math.random() * totalImages);
        const selectedImageElement = gameImages[finalRandomIndex]; 

        // -----------------------------------------------------
        // C. INICIO DEL EFECTO DE SORTEO
        // -----------------------------------------------------
        let currentIndex = 0;
        intervalId = setInterval(() => {
            gameImages[currentIndex].classList.remove('selected-random');
            currentIndex = (currentIndex + 1) % totalImages;
            gameImages[currentIndex].classList.add('selected-random');
        }, 200); // Ajusté a 150ms para una ruleta más pausada

        // -----------------------------------------------------
        // D. DETENER EL SORTEO Y REVELAR EL GANADOR
        // -----------------------------------------------------
        setTimeout(() => {
            clearInterval(intervalId); 
            intervalId = null; 
            removeSelection(); 
            
            // 1. Ocultar el contenedor de la ruleta
            //ruletaContainer.classList.add('hidden');
            
            // 2. Crear y configurar la imagen ganadora
            const winnerImageClone = selectedImageElement.cloneNode(true);
            winnerDisplay.appendChild(winnerImageClone);
            
            // 3. Revelar el contenedor de ganador con efecto de ampliación
            // Pequeño retraso para que la ruleta se oculte primero
            setTimeout(() => {
                winnerDisplay.classList.add('visible'); 
                
                // Mostrar el resultado en consola
                console.log(`🎉 ¡El juego elegido al azar es!: ${winnerImageClone.alt}`);
            }, 100); // 600ms para permitir la transición de ocultar (0.5s)
            
        }, 4000); // Duración total de la ruleta: 4 segundos
    };

    playButton.addEventListener('click', startRandomSelection);
});
