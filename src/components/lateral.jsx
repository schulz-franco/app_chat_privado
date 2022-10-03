import Navbar from "./navbar"
import Busqueda from "./busqueda"
import Chats from "./chats"

const Lateral = () => {
  return (
    <div className='lateral'>
      <Navbar />
      <Busqueda />
      <Chats />
    </div>
  )
}

export default Lateral