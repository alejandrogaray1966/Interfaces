

async function cargarComponente(url, contenedorSelector) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error al cargar el archivo: ${response.statusText} (${response.status})`);
        }

        const htmlContent = await response.text();
        const elemento = document.querySelector(contenedorSelector);

        if (elemento) {
            // Inyectar el contenido HTML
            elemento.innerHTML = htmlContent;
            console.log(`Componente ${url} cargado exitosamente en ${contenedorSelector}`);
            
            // AHORA LLAMAMOS A LA FUNCIÓN DE INICIALIZACIÓN DE MENÚ
            if (contenedorSelector === '.ContNavBar') {
                abrirMenuDesplegable(); 
            }
            
        } else {
            console.error(`Error: No se encontró el elemento con el selector ${contenedorSelector} en index.html`);
        }
    } catch (error) {
        console.error('Fallo la carga del componente:', error);
    }
}

// Lógica del Menú Desplegable

function abrirMenuDesplegable() {
    // A. ELEMENTOS DEL MENÚ HAMBURGUESA
    const toggleMenu = document.querySelector('.menuToggle');
    const menuDesplegable = document.querySelector('#menuItems');

    // B. ELEMENTOS DEL MENÚ DE PERFIL
    const togglePerfil = document.querySelector('.menuPerfil');
    const perfilDesplegable = document.querySelector('#menuPerfil');
    
    // FUNCIÓN DE CLIC: MENÚ HAMBURGUESA 
    if (toggleMenu && menuDesplegable) {
        toggleMenu.addEventListener('click', () => {
            menuDesplegable.classList.toggle('mostrar');
            
            // Actualizar ARIA (Obtiene el valor del atributo aria-expanded del elemento DOM llamado toggleMenu.Este atributo es parte de las especificaciones de ARIA (Accessible Rich Internet Applications) y se usa para indicar si un elemento controlable está expandido (true) o colapsado (false).informando a los lectores de pantalla y otras tecnologías de asistencia sobre la visibilidad del contenido asociado.)
            const isExpanded = toggleMenu.getAttribute('aria-expanded') === 'true';
            toggleMenu.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // --- FUNCIÓN DE CLIC: MENÚ DE PERFIL ---
    // .toggle('mostrar'): Es el método que comprueba si la clase CSS llamada 'mostrar' está aplicada al elemento:Si la clase está presente, el método la elimina.Si la clase no está presente, el método la añade.
    if (togglePerfil && perfilDesplegable) {
        togglePerfil.addEventListener('click', () => {
            perfilDesplegable.classList.toggle('mostrar');
            
            // Actualizar ARIA 
            const isExpanded = togglePerfil.getAttribute('aria-expanded') === 'true';
            togglePerfil.setAttribute('aria-expanded', !isExpanded);
        });
    }
}

// Lógica del HERO CAROUSEL


function heroCarousel() {
    const slidesContainer = document.getElementById('heroSlides');
    const dotsContainer = document.getElementById('heroPaginacion');
    
    // Si no encontramos el carrusel, salimos. (Importante para evitar errores en otras páginas)
    if (!slidesContainer || !dotsContainer) return; 

    const slides = slidesContainer.querySelectorAll('.carousel-slide');

    const dots = dotsContainer.querySelectorAll('.paginacion-dot');
    const totalSlides = dots.length;
    let slideActual = 0;
    const slideDuracion = 5000; // 5 segundos para la transición automática

    // Función principal para mover el carrusel y actualizar los puntos
    function moverSiguienteSlide(index) {
        // Asegura que el índice esté dentro del rango (0, 1, 2)
        const slideIndex = (index + totalSlides) % totalSlides; 
        
        // Actualiza los indicadores (círculos)
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
        });
        slides[slideIndex].classList.add('active');

        dots.forEach(dot => {
            dot.classList.remove('active');
            dot.removeAttribute('aria-current');
        });
        dots[slideIndex].classList.add('active');
        dots[slideIndex].setAttribute('aria-current', 'true');

        // Actualiza el índice actual
        slideActual = slideIndex;
    }

    // Lógica para el paso automático 
    // Esta es la parte clave. setInterval() es una función de JavaScript que ejecuta repetidamente una función (el callback) cada cierto número de milisegundos, especificado por slideDuracion. La función iniciarAutoSlide devuelve el ID de este intervalo.
    function iniciarAutoSlide() {
        return setInterval(() => {
            let siguienteSlide = (slideActual + 1) % totalSlides;
            moverSiguienteSlide(siguienteSlide);
        }, slideDuracion);
    }

    let autoSlideIntervalo = iniciarAutoSlide();

    // Lógica de navegación al hacer clic en los círculos
    dotsContainer.addEventListener('click', (event) => {
        const dot = event.target.closest('.paginacion-dot');
        if (!dot) return;

        // Detiene el paso automático temporalmente
        clearInterval(autoSlideIntervalo);

        // Mueve a la diapositiva del círculo
        const slideIndex = parseInt(dot.dataset.index);
        moverSiguienteSlide(slideIndex);

        // Reinicia el paso automático (para que siga después de 5 segundos)
        autoSlideIntervalo = iniciarAutoSlide();
    });

    // Inicializa la primera diapositiva (en caso de que el HTML no tenga la clase 'active' inicial)
    // Pero como ya lo pusimos en el HTML, solo es una capa de seguridad.
    // moveToSlide(currentSlide); 
}


// =========================================================
// 4. Lógica de Ejecución (Llama a la Carga y al Carrusel)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Carga la barra de navegación (llama a setupMenuEvents al terminar)
    cargarComponente('navBar.html', '.ContNavBar'); 
    
    // 2. Inicializa la lógica del Hero Carousel
    // Es seguro llamarla aquí porque el HTML del carrusel ya está presente en index.html
    heroCarousel();

    //3. Carga el footer
    cargarComponente('footer.html', '.ContFooter');
});