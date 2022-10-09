import Navbar from "./navbar"
import Busqueda from "./busqueda"
import { Chats } from "./chats"
import { Bloqueados } from "./bloqueados"


const Lateral = () => {
  return (
    <div className='lateral'>
      <div>
        <Navbar />
        <Busqueda />
        <Chats />
      </div>
      <Bloqueados />
    </div>
  )
}

export default Lateral