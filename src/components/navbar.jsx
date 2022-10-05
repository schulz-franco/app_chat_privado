import { signOut } from "firebase/auth"
import { useContext } from "react"
import { auth } from "../firebase/firebase"
import { AuthContext } from "../context/authContext"
import { ChatContext } from "../context/chatContext"

const Navbar = () => {

  const {usuario} = useContext(AuthContext)
  const { despacho } = useContext(ChatContext)

  const ESTADO_INICIAL = {
    chatId: null,
    usuario: {}
  }

  const handleClick = ()=> {
    signOut(auth)
    despacho({type: "CAMBIAR_USUARIO", payload: ESTADO_INICIAL})
  }

  return (
    <div className='navbar'>
      <div className="usuario">
        <img src={usuario.photoURL} alt="Avatar" />
        <span>{usuario.displayName}</span>
      </div>
      <button onClick={handleClick}>Cerrar sesión</button>
    </div>
  )
}

export default Navbar