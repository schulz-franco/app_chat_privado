import { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/authContext'
import { ChatContext } from '../context/chatContext'

export const useMensaje = (contenido, imagen) => {
    const { usuario } = useContext(AuthContext)
    const { estado } = useContext(ChatContext)
  
    const mensajeRef = useRef()
  
    // Cada vez que se actualizan los mensajes llevo el scroll abajo
    useEffect(()=> {
      mensajeRef.current?.scrollIntoView()
    }, [contenido])
  
    const imagenStyles = {
      opacity: imagen ? 1 : 0 
    }

    return {
        usuario,
        estado,
        mensajeRef,
        imagenStyles
    }
}