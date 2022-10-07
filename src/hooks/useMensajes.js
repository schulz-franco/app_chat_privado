import { useState, useEffect, useContext } from "react"
import { ChatContext } from "../context/chatContext"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../firebase/firebase"

export const useMensajes = () => {
    const [mensajes, setMensajes] = useState([])
    const { estado } = useContext(ChatContext)

    // Obtengo los mensajes cada vez que cambia el chat actual
    useEffect(()=> {
        const obtenerMensajes = ()=> {
            const unsub = onSnapshot(doc(db, "chats", estado.chatId), doc => {
                doc.exists() && setMensajes(doc.data().mensajes)
            })
        
            return ()=> unsub()
        }
        estado.chatId && obtenerMensajes()
    }, [estado.chatId])

    return {
        mensajes
    }

}