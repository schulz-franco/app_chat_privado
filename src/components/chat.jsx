import { useContext, useState } from "react"
import Menu from "../assets/menu.png"
import { ChatContext } from "../context/chatContext"
import Input from "./input"
import Mensajes from "./mensajes"

const Opciones = ({ despacho, estado })=> {
	
	const [open, setOpen] = useState(false)

	return(
		<>
			<div className="chat-iconos">
				<img className="opciones" onClick={()=> setOpen(!open)} src={Menu} alt="Mas opciones" />
				{open && <div onMouseLeave={()=> setOpen(false)} className="menu">
					<span onClick={()=> despacho({type: "BLOQUEAR_USUARIO", payload: estado})}>Bloquear</span>
				</div>}
			</div>
		</>
	)
}
	
const Chat = () => {
	
	const { estado, despacho } = useContext(ChatContext)

	// Verifico que exista un chat
	if (estado.chatId) return (
		<div className='chat'>
			<div className="chat-info">
				<span>{estado.usuario.displayName}</span>
				<Opciones despacho={despacho} estado={estado} />
			</div>
			<Mensajes />
			<Input />
		</div>
		)
	}
	
export default Chat