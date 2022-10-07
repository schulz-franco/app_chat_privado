import { useEffect, useState, useContext } from 'react'
import { deleteField, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { AuthContext } from '../context/authContext'
import { db } from '../firebase/firebase'
import { ChatContext } from '../context/chatContext'

export const useChats = () => {
    const [chats, setChats] = useState([])
    const { usuario } = useContext(AuthContext)
    const { estado, despacho } = useContext(ChatContext)

    // Cada que cambia el usuario actual actualizo los chats
    useEffect(()=> {
        const obtenerChats = ()=> {
        const unsub = onSnapshot(doc(db, "usuariosChats", usuario.uid), doc => {
            setChats(doc.data())
        })
        return ()=> unsub()
        }
        usuario.uid && obtenerChats()
    }, [usuario.uid])

    // Si se hace click en el chat, actualizo el chat actual
    const handleClick = (informacionUsuario, ev)=> {
        if (typeof(ev.target.className) !== "object") {
            despacho({type: "CAMBIAR_USUARIO", payload: informacionUsuario})
        }
    }

    // Elimino el chat de la lista de chats del usuario y limpio el chat actual si es el eliminado
    const handleEliminar = async (informacionUsuario) => {
        await updateDoc(doc(db, "usuariosChats", usuario.uid), {
            [informacionUsuario[0]]: deleteField()
        })
        if (estado.chatId === informacionUsuario[0]) {
            despacho({type: "LIMPIAR"})
        }
    }

    return {
        chats,
        handleClick,
        handleEliminar
    }
}