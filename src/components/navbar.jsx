import { signOut } from "firebase/auth"
import { useContext } from "react"
import { auth } from "../firebase/firebase"
import { AuthContext } from "../context/authContext"
import { ChatContext } from "../context/chatContext"

const Navbar = () => {

  const {usuario} = useContext(AuthContext)
  const { despacho } = useContext(ChatContext)

  const handleClick = ()=> {
    signOut(auth)
    despacho({type: "CAMBIAR_USUARIO", payload: {}})
  }

  return (
    <div className='navbar'>
      <span className="titulo">Chats</span>
      <div className="usuario">
        <img src={usuario.photoURL} alt="Avatar" />
        <span>{usuario.displayName}</span>
        <button onClick={handleClick}>Salir</button>
      </div>
    </div>
  )
}

export default Navbar