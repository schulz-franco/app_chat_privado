import { useState, useEffect, useContext } from "react"
import { ChatContext } from "../context/chatContext"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../firebase/firebase"
import Mensaje from "./mensaje"

const Mensajes = () => {

  const [mensajes, setMensajes] = useState([])
  const { estado } = useContext(ChatContext)

  useEffect(()=> {
    const obtenerMensajes = ()=> {
      const unsub = onSnapshot(doc(db, "chats", estado.chatId), doc => {
        doc.exists() && setMensajes(doc.data().mensajes)
      })
  
      return ()=> unsub()
    }
    estado.chatId && obtenerMensajes()
  }, [estado.chatId])

  return (
    <div className="mensajes">
        {mensajes.map(mensaje => {
          return <Mensaje key={mensaje.id} contenido={mensaje} />
        })}
    </div>
  )
}

export default Mensajes