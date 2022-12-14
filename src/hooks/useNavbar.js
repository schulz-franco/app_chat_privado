import { signOut } from "firebase/auth"
import { useContext } from "react"
import { auth, db, storage } from "../firebase/firebase"
import { AuthContext } from "../context/authContext"
import { ChatContext } from "../context/chatContext"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { updateProfile } from "firebase/auth"
import { v4 as uuid } from "uuid"
import { doc, getDoc, updateDoc } from "firebase/firestore"

export const useNavbar = () => {
    const { usuario } = useContext(AuthContext)
    const { despacho } = useContext(ChatContext)
  
    // Cierra la sesion y limpia el chat actual
    const handleClick = ()=> {
      signOut(auth)
      despacho({type: "LIMPIAR", payload: {}})
    }
  
    // Sube la imagen al storage, actualiza la URL en el usuario y en las listas de chats de los usuarios que tengan un chat con el usuario actual
    const cambiarImagenPerfil = async (ev)=> {

        // Almaceno la imagen y limpio el input
        let imagen = ev.target.files[0]
        ev.target.files = null
        
        // Si el peso de la imagen es menor a 1mb
        if (imagen && (imagen.size / 1024 / 1024) < 1) {
            // Subo la imagen
            const storageRef = ref(storage, uuid())
            const uploadTask = uploadBytesResumable(storageRef, imagen)
    
            // Obtengo la URL
            uploadTask.on(err => console.log("error"), ()=> {
                getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
                    // Actualizo el perfil del usuario
                    await updateProfile(usuario, {
                        photoURL: downloadURL
                    })
                    // Actualizo la imagen en el perfil del usuario de la base de datos
                    await updateDoc(doc(db, "usuarios", usuario.uid), {
                        photoURL: downloadURL
                    });
                    // Obtengo los chats del usuario actual
                    let chatsUsuario = await getDoc(doc(db, "usuariosChats", usuario.uid))
                    // Itero esos chats
                    Object.entries(chatsUsuario.data()).forEach(async documento1 => {
                        // Obtengo chats de cada usuario
                        let chatsUsuarioObjetivo = await getDoc(doc(db, "usuariosChats", documento1[1].informacion.uid))
                        // Itero esos chats
                        Object.entries(chatsUsuarioObjetivo.data()).forEach(async documento2 => {
                            // Elijo el chat que sea con el usuario actual
                            if (documento2[1].informacion.uid === usuario.uid) {
                            // Actualizo la URL dentro de ese chat
                            await updateDoc(doc(db, "usuariosChats", documento1[1].informacion.uid), {
                                [documento1[0] + ".informacion.photoURL"]: downloadURL
                            })
                            }
                        })
                    })
                })
            })
        }
    
    }

    return {
        usuario,
        cambiarImagenPerfil,
        handleClick
    }
}