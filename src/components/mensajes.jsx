import { useState, useEffect, useContext } from "react"
import { ChatContext } from "../context/chatContext"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../firebase/firebase"
import Mensaje from "./mensaje"

const Mensajes = () => {

  const [mensajes, setMensajes] = useState([])
  const { estado } = useContext(ChatContext)

  let emisor = ""

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
        {mensajes.map((mensaje, index) => {
          if (mensaje.emisorId === emisor) {
            return <Mensaje key={mensaje.id} contenido={mensaje} imagen={false} />
          }
          emisor = mensaje.emisorId
          return <Mensaje key={mensaje.id} contenido={mensaje} imagen={true} />
        })}
    </div>
  )
}

export default Mensajes