import { arrayUnion, deleteDoc, deleteField, doc, updateDoc } from "firebase/firestore";
import { createContext, useContext, useReducer } from "react";
import { db } from "../firebase/firebase";
import { AuthContext } from "./authContext";

export const ChatContext = createContext()

export const ChatContextProvider = ({ children })=> {
    
    const { usuario } = useContext(AuthContext)

    const ESTADO_INICIAL = {
        chatId: null,
        usuario: {}
    }

    const eliminarChats = async (chatId, usuarioId)=> {
        await deleteDoc(doc(db, "chats", chatId))
        await updateDoc(doc(db, "usuariosChats", usuarioId), {
            [chatId]: deleteField()
        })
        await updateDoc(doc(db, "usuariosChats", usuario.uid), {
            [chatId]: deleteField()
        })
    }

    const bloquearUsuario = async (uid)=> {
        await updateDoc(doc(db, "usuarios", usuario.uid), {
            bloqueados: arrayUnion({
                uid
            })
        })
    }

    const chatReducer = (estado, accion) => {
        switch(accion.type) {
            case "CAMBIAR_USUARIO":
                return {
                    usuario: accion.payload,
                    chatId: usuario.uid > accion.payload.uid ? usuario.uid + accion.payload.uid : accion.payload.uid + usuario.uid
                }

            case "BLOQUEAR_USUARIO":
                bloquearUsuario(accion.payload.usuario.uid)
                eliminarChats(accion.payload.chatId, accion.payload.usuario.uid)
                return ESTADO_INICIAL

            case "LIMPIAR":
                return ESTADO_INICIAL

            default:
                return estado
        }
    }

    const [estado, despacho] = useReducer(chatReducer, ESTADO_INICIAL)

    return (
        <ChatContext.Provider value={{ estado, despacho }}>
            {children}
        </ChatContext.Provider>
    )

}