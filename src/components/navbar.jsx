import { signOut } from "firebase/auth"
import { useContext } from "react"
import { auth } from "../firebase/firebase"
import { AuthContext } from "../context/authContext"

const Navbar = () => {

  const {usuario} = useContext(AuthContext)

  return (
    <div className='navbar'>
      <span className="titulo">Chats</span>
      <div className="usuario">
        <img src={usuario.photoURL} alt="Avatar" />
        <span>{usuario.displayName}</span>
        <button onClick={()=> signOut(auth)}>Salir</button>
      </div>
    </div>
  )
}

export default Navbar