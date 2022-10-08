import { useContext, useState } from 'react'
import { collection, query, where, getDocs, getDoc, setDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase/firebase'
import { AuthContext } from "../context/authContext"

export const useBusqueda = () => {

    const [nombreUsuario, setNombreUsuario] = useState("")
    const [usuarioBuscado, setUsuarioBuscado] = useState(null)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const { usuario } = useContext(AuthContext)

    // Ejecuta la busqueda de usuarios
    const handleBusqueda = async ()=> {

        setLoading(true)

        // Traigo a un usuario cuando su nombre sea igual al buscado
        const queryUsuarioBuscado = query(collection(db, "usuarios"), where("displayName", "==", nombreUsuario.toLowerCase()))
        // Traigo al usuario actual
        const queryUsuarioActual = query(collection(db, "usuarios"), where("displayName", "==", usuario.displayName.toLowerCase()))

        try {
            const querySnapshotUsuarioBuscado = await getDocs(queryUsuarioBuscado);
            const querySnapshotUsuarioActual = await getDocs(queryUsuarioActual)
            // Uso un contador para verificar si existen usuarios
            let contador = 0
            // Uso un booleano para verificar si el usuario fue bloqueado
            let bloqueado = false
            // Reviso si existe el usuario buscado
            querySnapshotUsuarioBuscado.forEach(doc => {
                contador++
                error && setError(false)
                // Reviso los bloqueos del usuario
                doc.data().bloqueados?.forEach(usuarioBloqueado => {
                    if (usuarioBloqueado.uid === usuario.uid) {
                        bloqueado = true
                    }
                })
                // Reviso los bloqueos del usuario actual
                querySnapshotUsuarioActual.forEach(usuarioActual => {
                    // Si el usuario actual tiene bloqueado al usuario buscado
                    usuarioActual.data().bloqueados?.forEach(usuarioBloqueado => {
                        if (usuarioBloqueado.uid === doc.data().uid) {
                            bloqueado = true
                        }
                    })
                })
                // Si el usuario buscado es diferente del usuario actual y tampoco fue bloqueado, muestro la busqueda
                if (doc.data().displayName !== usuario.displayName && !bloqueado) {
                    setUsuarioBuscado(doc.data())
                } else {
                    setError(true)
                    setUsuarioBuscado(null)
                }

            });
            // Si no se encontraron usuarios
            if (contador === 0) {
                // Limpio usuarios anteriores
                setUsuarioBuscado(null)
                setError(false)
                if (nombreUsuario !== "") {
                    setError(true)
                }
            }
            setLoading(false)
        } catch (err) {
            setError(true)
            setLoading(false)
        }
    }
    
    // Ejecuta la busqueda al tocar Enter
    const handleKey = (ev)=> {
        ev.code === "Enter" && handleBusqueda()
    }
    
    const handleClick = async ()=> {
        // Genero identificacion para el chat
        const combinacionIds = usuario.uid > usuarioBuscado.uid ? usuario.uid + usuarioBuscado.uid : usuarioBuscado.uid + usuario.uid
        
        try {
            // Verifico si existe el chat, si no lo creo
            const response = await getDoc(doc(db, "chats", combinacionIds))
            if (!response.exists()) {
                await setDoc(doc(db, "chats", combinacionIds), {
                    mensajes: []
                })
            }

            // Agrego el chat a la lista de chats del usuario actual
            await updateDoc(doc(db, "usuariosChats", usuario.uid), {
                [combinacionIds+".informacion"]: {
                uid: usuarioBuscado.uid,
                displayName: usuarioBuscado.displayName,
                photoURL: usuarioBuscado.photoURL
                },
                [combinacionIds+".ultimoMensaje"]: "",
                [combinacionIds+".fecha"]: serverTimestamp()
            })

            // Agrego el chat con el usuario actual a la lista de chats del usuario agregado
            await updateDoc(doc(db, "usuariosChats", usuarioBuscado.uid), {
                [combinacionIds+".informacion"]: {
                uid: usuario.uid,
                displayName: usuario.displayName,
                photoURL: usuario.photoURL
                },
                [combinacionIds+".ultimoMensaje"]: "",
                [combinacionIds+".fecha"]: serverTimestamp()
            })
            
            // Limpio la busqueda
            setNombreUsuario("")
            setUsuarioBuscado(null)
        } catch (err) {}
    }

    return {
        nombreUsuario,
        setNombreUsuario,
        loading,
        error,
        usuarioBuscado,
        handleBusqueda,
        handleClick,
        handleKey
    }
}