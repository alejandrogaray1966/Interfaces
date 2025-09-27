// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------------------------------------------------------------
    // --------------------------- Limitar Fecha de Nacimiento -------------------------------
    // ---------------------------------------------------------------------------------------

    // 1. Función para obtener la fecha en formato AAAA-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        // Asegurar que el mes y el día tengan dos dígitos
        if (month < 10) month = '0' + month;
        if (day < 10) day = '0' + day;

        return `${year}-${month}-${day}`;
    }

    // 2. Calcular la fecha MÁXIMA (Hoy)
    const today = new Date();
    const maxDate = formatDate(today);

    // 3. Calcular la fecha MÍNIMA (Hace 120 años)
    const minLimitYears = 120;
    const minDateObj = new Date();
    // Restar 120 años al año actual
    minDateObj.setFullYear(today.getFullYear() - minLimitYears); 
    const minDate = formatDate(minDateObj);

    // 4. Aplicar los límites al input
    const birthdateInput = document.getElementById('birthdate');
    birthdateInput.max = maxDate; // No posterior a hoy
    birthdateInput.min = minDate; // No anterior a hace 120 años

    // ---------------------------------------------------------------------------------------
    // --------------------------- Cambia ojo cerrado por abierto (Doble Contraseña) ---------
    // ---------------------------------------------------------------------------------------

    // Obtiene todos los íconos de alternar contraseña (el ojo)
    // Usamos querySelectorAll porque ahora hay dos en la página de registro
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');

    // Itera sobre cada ícono encontrado para agregarles el evento
    togglePasswordIcons.forEach(toggleIcon => {
        toggleIcon.addEventListener('click', function () {
            // El data-target ('password' o 'repeat-password') en el HTML
            const targetId = this.getAttribute('data-target');
            // Encuentra el input de contraseña asociado
            const passwordInput = document.getElementById(targetId);

            // Alterna el tipo de input entre 'password' y 'text'
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Alterna la imagen del ícono
            if (type === 'password') {
                // La contraseña está oculta, muestra el ojo cerrado
                // Asegúrate de que la ruta a tu imagen 'cerradoL.png' es correcta
                this.src = '../img/icono/cerradoL.png'; 
            } else {
                // La contraseña está visible, muestra el ojo abierto
                // Asegúrate de que la ruta a tu imagen 'abiertoL.png' es correcta
                this.src = '../img/icono/abiertoL.png'; 
            }
        });
    });
    // --------------------------------------------------------------------------------------- 
    // --------------------------- Animación de transición al ir a Iniciar Sesión ------------ 
    // ---------------------------------------------------------------------------------------

    // Obtiene el link de iniciar sesión y el body
    const loginLink = document.getElementById('login-link'); // ID del enlace a login.html
    const body = document.body;
    
    // Verifica que el link exista
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            // 1. Previene la redirección inmediata del navegador
            e.preventDefault(); 
            
            // Guarda la URL de destino (login.html)
            const targetUrl = loginLink.href; 
            
            // 2. Agrega la clase de animación al <body>
            body.classList.add('fade-out'); 
            
            // 3. Espera el tiempo que dura la animación CSS (ej. 900ms)
            const animationDuration = 900; // Debe coincidir con el 'transition-duration' en CSS
            
            setTimeout(() => {
                window.location.href = targetUrl; // 4. Redirige a login.html
            }, animationDuration);
        });
    }

});
