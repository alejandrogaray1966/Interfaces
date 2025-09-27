// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

// ------------------------------------------------------------------------------------------------
// --------------------------- Alert cuando chequea -----------------------------------------------
// ------------------------------------------------------------------------------------------------

// Obtiene el elemento del checkbox usando su ID
const rememberMeCheckbox = document.getElementById('remember');

// Declara la función que se ejecutará
function mandarAlert() {
  // `this.checked` es `true` si el checkbox está marcado
  if (rememberMeCheckbox.checked) {
      alert("Se le ha enviado un correo para recuperar su contraseña.");
  }
}

// Añade el escuchador de eventos. Nota: no hay paréntesis en 'mandarAlert'
rememberMeCheckbox.addEventListener('change', mandarAlert);

// ------------------------------------------------------------------------------------------------
// --------------------------- Cambia ojo cerrado por abierto -------------------------------------
// ------------------------------------------------------------------------------------------------

// Obtiene el input de la contraseña y el ícono
const passwordInput = document.getElementById('password');
const togglePasswordIcon = document.querySelector('.toggle-password');

// Añade el escuchador de eventos al ícono
togglePasswordIcon.addEventListener('click', function () {
    // Alterna el tipo de input entre 'password' y 'text'
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    // Alterna la imagen del ícono
    if (type === 'password') {
        // La contraseña está oculta, muestra el ojo cerrado
        togglePasswordIcon.src = '../img/icono/cerradoL.png';
    } else {
        // La contraseña está visible, muestra el ojo abierto
        togglePasswordIcon.src = '../img/icono/abiertoL.png';
    }
});

// ------------------------------------------------------------------------------------------------
// --------------------------- Animación de transición al ir a Registrarse ------------------------
// ------------------------------------------------------------------------------------------------

    // Obtiene el link de registro y el body
    const registerLink = document.getElementById('register-link');
    const body = document.body;
    // Verifica que el link exista
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            // 1. Previene la redirección inmediata del navegador
            e.preventDefault(); 
            // Guarda la URL de destino (register.html)
            const targetUrl = registerLink.href; 
            // 2. Agrega la clase de animación al <body>
            // (La animación de fade-out estará definida en CSS)
            body.classList.add('fade-out'); 
            // 3. Espera el tiempo que dura la animación CSS (ej. 900ms)
            // y luego realiza la redirección
            const animationDuration = 900; // Debe coincidir con el 'transition-duration' en CSS
            setTimeout(() => {
                window.location.href = targetUrl; // 4. Redirige a register.html
            }, animationDuration);
        });
    }
});
