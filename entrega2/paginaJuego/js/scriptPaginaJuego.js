document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-comentario")
    const textarea = document.getElementById("texto-comentario")
    const btnComentar = document.getElementById("btn-comentar")
    const btnCancelar = document.getElementById("btn-cancelar")
    const loadingSpinner = document.getElementById("loading-spinner")
    const listaComentarios = document.getElementById("lista-comentarios")
  
    // Manejar el envío del formulario
    form.addEventListener("submit", (e) => {
      e.preventDefault()
  
      const textoComentario = textarea.value.trim()
  
      if (textoComentario === "") {
        return
      }
  
      // Activar estado de carga
      textarea.classList.add("loading")
      loadingSpinner.classList.add("active")
      btnComentar.disabled = true
      btnCancelar.disabled = true
  
      // Simular envío durante 3 segundos
      setTimeout(() => {
        // Crear el nuevo comentario
        agregarComentario(textoComentario)
  
        // Reiniciar el formulario
        resetearFormulario()
      }, 3000)
    })
  
    // Manejar el botón cancelar
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

    // Insertar el comentario al inicio de la lista
    listaComentarios.insertBefore(nuevoComentario, listaComentarios.firstChild)

    // Hacer scroll al nuevo comentario
    listaComentarios.scrollTop = 0
  }

  function resetearFormulario() {
    // Remover estado de carga
    textarea.classList.remove("loading")
    loadingSpinner.classList.remove("active")
    btnComentar.disabled = false
    btnCancelar.disabled = false

    // Limpiar el textarea
    textarea.value = ""

    // Quitar el foco del textarea para ocultar los botones
    textarea.blur()
  }
})

