import { signOut } from "firebase/auth"
import { useContext } from "react"
import { auth, db, storage } from "../firebase/firebase"
import { AuthContext } from "../context/authContext"
import { ChatContext } from "../context/chatContext"
import Salir from "../assets/salir.png"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { updateProfile } from "firebase/auth"
import { v4 as uuid } from "uuid"
import { doc, onSnapshot, updateDoc } from "firebase/firestore"

const Navbar = () => {

  const { usuario } = useContext(AuthContext)
  const { despacho } = useContext(ChatContext)

  console.log(usuario)

  const handleClick = ()=> {
    signOut(auth)
    despacho({type: "LIMPIAR", payload: {}})
  }

  const cambiarImagenPerfil = async (ev)=> {
    let imagen = ev.target.files[0]
    ev.target.files = null
    
    if (imagen && (imagen.size / 1024 / 1024) < 2) {
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