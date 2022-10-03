import { signOut } from "firebase/auth"
import { auth } from "../firebase/firebase"

const Navbar = () => {
  return (
    <div className='navbar'>
      <span className="titulo">Chats</span>
      <div className="usuario">
        <img src="https://www.elgatofeliz.es/wp-content/uploads/2020/09/maine-coon-atigrado.jpg" alt="Avatar" />
        <span>Nombre</span>
        <button onClick={()=> signOut(auth)}>Salir</button>
      </div>
    </div>
  )
}

export default Navbar