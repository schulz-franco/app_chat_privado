import "../styles/formulario.scss"
import agregarAvatar from "../assets/agregarAvatar.png"

const Registro = () => {
  return (
    <div className="form-container">
        <div className="form">
            <span className="titulo">Chatea ahora</span>
            <span className="subtitulo">Registro</span>
            <form>
                <input type="text" placeholder="Nombre de usuario" />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Contraseña" />
                <input type="file" id="avatar" />
                <label htmlFor="avatar">
                  <img src={agregarAvatar} alt="Agregar un avatar" />  
                  Elegir avatar</label>
                <button>Registrarse</button>
            </form>
            <p>¿Ya tenes cuenta? Inicia sesión</p>
        </div>
    </div>
  )
}

export default Registro