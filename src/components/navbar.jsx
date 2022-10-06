import { signOut } from "firebase/auth"
import { useContext } from "react"
import { auth, db, storage } from "../firebase/firebase"
import { AuthContext } from "../context/authContext"
import { ChatContext } from "../context/chatContext"
import Salir from "../assets/salir.png"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { updateProfile } from "firebase/auth"
import { v4 as uuid } from "uuid"
import { doc, getDoc, updateDoc } from "firebase/firestore"

const Navbar = () => {

  const { usuario } = useContext(AuthContext)
  const { despacho } = useContext(ChatContext)

  const handleClick = ()=> {
    signOut(auth)
    despacho({type: "LIMPIAR", payload: {}})
  }

  const cambiarImagenPerfil = async (ev)=> {
    let imagen = ev.target.files[0]
    ev.target.files = null
    
    if (imagen && (imagen.size / 1024 / 1024) < 1) {
      const storageRef = ref(storage, uuid())
      const uploadTask = uploadBytesResumable(storageRef, imagen)

      uploadTask.on(err => console.log("error"), ()=> {
        getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
          console.log(downloadURL)
          await updateProfile(usuario, {
            photoURL: downloadURL
          })
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

  return (
    <div className='navbar'>
      <div className="usuario">
        <input id="imagenPerfil" type="file" accept="image/*" style={{display: "none"}} onChange={ev => cambiarImagenPerfil(ev)} />
        <label htmlFor="imagenPerfil">
          <img src={usuario.photoURL} alt="Avatar" />
        </label>
        <span>{usuario.displayName}</span>
      </div>
      <img src={Salir} alt="Cerrar sesión" className="salir" onClick={handleClick} width={20} />
    </div>
  )
}

export default Navbar