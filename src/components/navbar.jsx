import Salir from "../assets/salir.png"
import { useNavbar } from "../hooks/useNavbar"

const Navbar = () => {

    const {
        usuario,
        cambiarImagenPerfil,
        handleClick
    } = useNavbar()

    return (
      <div className='navbar'>
        <div className="usuario">
          <input id="imagenPerfil" type="file" accept="image/*" style={{display: "none"}} onChange={ev => cambiarImagenPerfil(ev)} />
          <label htmlFor="imagenPerfil">
            <img src={usuario.photoURL} alt="Avatar" />
          </label>
          <span>{usuario.displayName}</span>
        </div>
        <img src={Salir} alt="Cerrar sesión" className="salir" onClick={handleClick} width={20} />
      </div>
    )
}

export default Navbar