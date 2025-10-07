
//COMENTARIOS
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-comentario")
    const textarea = document.getElementById("texto-comentario")
    const btnComentar = document.getElementById("btn-comentar")
    const btnCancelar = document.getElementById("btn-cancelar")
    const loadingSpinner = document.getElementById("loading-spinner")
    const listaComentarios = document.getElementById("lista-comentarios")
  
    // detengo el submit
    form.addEventListener("submit", (e) => {
      e.preventDefault()
  
      const textoComentario = textarea.value.trim()
  
      if (textoComentario === "") {
        return
      }
  
      // Activo estado de carga
      textarea.classList.add("loading")
      loadingSpinner.classList.add("active")
      btnComentar.disabled = true
      btnCancelar.disabled = true
  
      
      setTimeout(() => {
        // Creo el nuevo comentario
        agregarComentario(textoComentario)
  
        // Reseteo el mensaje en el textarea
        resetearFormulario()
      }, 3000)
    })
  
    // botón cancelar
    btnCancelar.addEventListener("click", () => {
      resetearFormulario()
    })

function agregarComentario(texto) {
    const nuevoComentario = document.createElement("article")
    nuevoComentario.classList.add("new-comment")

    nuevoComentario.innerHTML = `
            <img src="./assets/3d_avatar_28.png" alt="avatar del usuario que comentó"> 
            <div>    
                <div>
                    <span>Tú</span>
                    <time>Ahora</time> 
                </div>
                <p>${texto}</p>
                <div>
                    <button><img src="./assets/Thumbs up.png"></button>
                    <button><img src="./assets/Thumbs down.png"></button>
                    <button>Responder</button>
                </div>
            </div>
            <div>
                <button><img src="./assets/More horizontal.png"></button>
            </div>
        `

    // Inserto el comentario nuevo primero en la lista
    listaComentarios.insertBefore(nuevoComentario, listaComentarios.firstChild)

    // scroll al nuevo comentario
    listaComentarios.scrollTop = 0
  }

  function resetearFormulario() {
    // Remuevo estado de carga
    textarea.classList.remove("loading")
    loadingSpinner.classList.remove("active")
    btnComentar.disabled = false
    btnCancelar.disabled = false

    // textarea vacío
    textarea.value = ""
    textarea.blur()
  }
})

//SECCION DEMO
document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.demo-container');

    // muestro los controles agregando el atributo con hover
    video.addEventListener('mouseenter', () => {
        video.setAttribute('controls', 'controls');
    });

    // Oculto los controles sin hover
    video.addEventListener('mouseleave', () => {
        video.removeAttribute('controls');
    });
});

