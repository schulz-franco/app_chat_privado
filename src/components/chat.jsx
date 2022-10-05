import { useContext } from "react"
import Agregar from "../assets/agregar.png"
import Menu from "../assets/menu.png"
import { ChatContext } from "../context/chatContext"
import Input from "./input"
import Mensajes from "./mensajes"

const Chat = () => {

  const { estado } = useContext(ChatContext)

  return (
    <div className='chat'>
      <div className="chat-info">
        <span>{estado.usuario.displayName}</span>
        <div className="chat-iconos">
          <img src={Agregar} alt="Agregar amigo" />
          <img src={Menu} alt="Mas opciones" />
        </div>
      </div>
      <Mensajes />
      <Input />
    </div>
  )
}

export default Chat