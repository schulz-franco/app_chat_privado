import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore"
import { useState } from "react"
import { useContext } from "react"
import { AuthContext } from "../context/authContext"
import { ChatContext } from "../context/chatContext"
import { db, storage } from "../firebase/firebase"
import { v4 as uuid } from "uuid"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import Archivo from "../assets/archivo.png"
import Imagen from "../assets/imagen.png"

const Input = () => {

  const [texto, setTexto] = useState("")
  const [imagen, setImagen] = useState(null)

  const { usuario } = useContext(AuthContext)
  const { estado } = useContext(ChatContext)

  const handleEnviar = async ()=> {

    if (imagen) {
      const storageRef = ref(storage, uuid())
      const uploadTask = uploadBytesResumable(storageRef, imagen)

      uploadTask.on(err => console.log("error"), ()=> {
        getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
          await updateDoc(doc(db, "chats", estado.chatId), {
            mensajes: arrayUnion({
              id: uuid(),
              texto,
              emisorId: usuario.uid,
              fecha: Timestamp.now(),
              imagen: downloadURL
            })
          })
        })
      })

    } else {
      await updateDoc(doc(db, "chats", estado.chatId), {
        mensajes: arrayUnion({
          id: uuid(),
          texto,
          emisorId: usuario.uid,
          fecha: Timestamp.now()
        })
      })
    }

    await updateDoc(doc(db, "usuariosChats", usuario.uid), {
      [estado.chatId+".ultimoMensaje"]: texto,
      [estado.chatId+".fecha"]: serverTimestamp()
    })

    await updateDoc(doc(db, "usuariosChats", estado.usuario.uid), {
      [estado.chatId+".ultimoMensaje"]: texto,
      [estado.chatId+".fecha"]: serverTimestamp()
    })

    setTexto("")
    setImagen(null)

  }

  return (
    <div className="input">
        <input required value={texto !== "" ? texto.trimStart() : texto.trim()} type="text" placeholder="Escribe algo..." onChange={ev=> setTexto(ev.target.value)} />
        <div className="enviar">
            <input type="file" id="archivo" onChange={ev => setImagen(ev.target.files[0])} />
            <label htmlFor="archivo">
                <img src={Archivo} alt="Enviar un archivo" />
            </label>
            <button onClick={handleEnviar}>Enviar</button>
        </div>
    </div>
  )
}

export default Input