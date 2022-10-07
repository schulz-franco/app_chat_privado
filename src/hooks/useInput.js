import { arrayUnion, doc, getDoc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useContext } from "react"
import { AuthContext } from "../context/authContext"
import { ChatContext } from "../context/chatContext"
import { db, storage } from "../firebase/firebase"
import { v4 as uuid } from "uuid"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"

export const useInput = () => {

    const [texto, setTexto] = useState("")
    const [imagen, setImagen] = useState(null)
  
    // Informacion del usuario actual
    const { usuario } = useContext(AuthContext)
    // Informacion del chat actual (id e informacion del otro usuario)
    const { estado } = useContext(ChatContext)
  
    // Cada que cambia el chat actual, limpio el input y la imagen a enviar
    useEffect(()=> {
        const reiniciarEnvios = ()=> {
            setTexto("")
            setImagen(null)
        }
    
        estado.chatId && reiniciarEnvios()
    }, [estado.chatId])
  
    const handleEnviar = async ()=> {
  
        // Almaceno y limpio el mensaje para evitar el retraso
        const textoMensaje = texto
        setTexto("")
    
        // Si no hay texto ni imagen retorno (para evitar el envio de mensajes vacios)
        if (textoMensaje.trim() === "" && !imagen) {
            return
        }
        
        // Si existe una imagen
        if (imagen) {
            // Subo la imagen al storage
            const storageRef = ref(storage, uuid())
            const uploadTask = uploadBytesResumable(storageRef, imagen)
    
            // Obtengo la URL de la imagen
            uploadTask.on(err => console.log("error"), ()=> {
                getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
                    // Agrego el mensaje al chat
                    await updateDoc(doc(db, "chats", estado.chatId), {
                    mensajes: arrayUnion({
                        id: uuid(),
                        texto: textoMensaje,
                        emisorId: usuario.uid,
                        fecha: Timestamp.now(),
                        imagen: downloadURL
                    })
                    })
                })
            })
    
        } else {
            // Agrego el mensaje al chat
            await updateDoc(doc(db, "chats", estado.chatId), {
            mensajes: arrayUnion({
                id: uuid(),
                texto: textoMensaje,
                emisorId: usuario.uid,
                fecha: Timestamp.now()
            })
            })
        }
    
        // Actualizo el ultimo mensaje en la lista de chats del usuario actual
        await updateDoc(doc(db, "usuariosChats", usuario.uid), {
            [estado.chatId+".ultimoMensaje"]: textoMensaje !== "" ? textoMensaje : "Imagen",
            [estado.chatId+".fecha"]: serverTimestamp()
        })
    
        // Obtengo la lista de chats del usuario al que envio el mensaje
        let chatsUsuarioObjetivo = await getDoc(doc(db, "usuariosChats", estado.usuario.uid))
        // Variable para determinar si existe un chat con el usuario actual en la lista de chats del otro usuario
        let exists = false
    
        // Itero la lista de chats del otro usuario
        Object.entries(chatsUsuarioObjetivo.data()).forEach(async chat => {
            // Si existe un chat del otro usuario con el usuario actual
            if (chat[0] === estado.chatId) {
                // Indico que existe
                exists = true
            // Actualizo el ultimo mensaje en el chat del otro usuario
            await updateDoc(doc(db, "usuariosChats", estado.usuario.uid), {
                [estado.chatId+".ultimoMensaje"]: textoMensaje !== "" ? textoMensaje : "Imagen",
                [estado.chatId+".fecha"]: serverTimestamp()
            })
            }
        })
    
        // Si el otro usuario no tiene un chat con el usuario actual, lo creo y actualizo el ultimo mensaje
        if (!exists) {
            await updateDoc(doc(db, "usuariosChats", estado.usuario.uid), {
            [estado.chatId+".ultimoMensaje"]: textoMensaje !== "" ? textoMensaje : "Imagen",
            [estado.chatId+".fecha"]: serverTimestamp(),
            [estado.chatId+".informacion"]: {
                displayName: usuario.displayName,
                photoURL: usuario.photoURL,
                uid: usuario.uid
            }
            })
        }
    
        // Limpio la imagen una vez enviada
        setImagen(null)
    }
  
    const handleKey = (ev) => {
      ev.code === "Enter" && handleEnviar()
    }

    return {
        imagen,
        setImagen,
        texto,
        setTexto,
        handleEnviar,
        handleKey
    }
}