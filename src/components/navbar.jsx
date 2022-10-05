import { signOut } from "firebase/auth"
import { useContext } from "react"
import { auth } from "../firebase/firebase"
import { AuthContext } from "../context/authContext"
import { ChatContext } from "../context/chatContext"
import Salir from "../assets/salir.png"

const Navbar = () => {

  const { usuario } = useContext(AuthContext)
  const { despacho } = useContext(ChatContext)

  const handleClick = ()=> {
    signOut(auth)
    despacho({type: "LIMPIAR", payload: {}})
  }

  return (
    <div className='navbar'>
      <div className="usuario">
        <img src={usuario.photoURL} alt="Avatar" />
        <span>{usuario.displayName}</span>
      </div>
      <img src={Salir} alt="Cerrar sesión" className="salir" onClick={handleClick} width={20} />
    </div>
  )
}

export default Navbar