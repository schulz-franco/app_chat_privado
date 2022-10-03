import "../styles/formulario.scss"

const Inicio = () => {
  return (
    <div className="form-container">
        <div className="form">
            <span className="titulo">Chatea ahora</span>
            <span className="subtitulo">Iniciar sesión</span>
            <form>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Contraseña" />
                <button>Iniciar sesión</button>
            </form>
            <p>¿No tenes cuenta? Registrate</p>
        </div>
    </div>
  )
}

export default Inicio