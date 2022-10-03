import Agregar from "../assets/agregar.png"
import Menu from "../assets/menu.png"
import Input from "./input"
import Mensajes from "./mensajes"

const Chat = () => {
  return (
    <div className='chat'>
      <div className="chat-info">
        <span>Un usuario</span>
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