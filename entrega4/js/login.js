// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

// ------------------------------------------------------------------------------------------------
// --------------------------- Lógica para el enlace "¿Olvidaste tu contraseña?" ------------------
// ------------------------------------------------------------------------------------------------

// Obtiene el elemento del párrafo/enlace de "¿Olvidaste tu contraseña?"
const forgotPasswordLink = document.querySelector('p u'); 

// 💥 NUEVO: Obtener el contenedor donde se mostrará el mensaje
const recoveryMessageContainer = document.getElementById('recovery-message');

const newLabelText = 'Se le ha enviado un MAIL, revise su CORREO'; // Mensaje a mostrar

// Declara la función que se ejecutará al hacer clic en "¿Olvidaste tu contraseña?"
function mostrarMensajeRecuperacion(e) {
    // 1. Previene la acción por defecto (si fuera un enlace funcional)
    e.preventDefault(); 
    
    // 2. Inserta el nuevo texto en el contenedor
    if (recoveryMessageContainer) {
        recoveryMessageContainer.textContent = newLabelText;
        
        // Opcional: Podrías añadir una clase de estilo si quieres animación o color
        // recoveryMessageContainer.classList.add('active-message');

        // Opcional: Si quieres que el mensaje se borre después de 5 segundos
        setTimeout(() => {
            recoveryMessageContainer.textContent = '';
            // recoveryMessageContainer.classList.remove('active-message');
         }, 5000); 
    }
}

// Añade el escuchador de eventos al enlace
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', mostrarMensajeRecuperacion);
}


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
        togglePasswordIcon.src = './img/icono/cerradoL.png';
    } else {
        // La contraseña está visible, muestra el ojo abierto
        togglePasswordIcon.src = './img/icono/abiertoL.png';
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
