import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { AuthContext } from "./authContext";

export const ChatContext = createContext()

export const ChatContextProvider = ({ children })=> {
    
    const { usuario } = useContext(AuthContext)

    const ESTADO_INICIAL = {
        chatId: null,
        usuario: {}
    }

    const chatReducer = (estado, accion) => {
        switch(accion.type) {
            case "CAMBIAR_USUARIO":
                return {
                    usuario: accion.payload,
                    chatId: usuario.uid > accion.payload.uid ? usuario.uid + accion.payload.uid : accion.payload.uid + usuario.uid
                }

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