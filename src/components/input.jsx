import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useContext } from "react"
import { AuthContext } from "../context/authContext"
import { ChatContext } from "../context/chatContext"
import { db, storage } from "../firebase/firebase"
import { v4 as uuid } from "uuid"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import Archivo from "../assets/archivo.png"
import { useRef } from "react"

const Input = () => {

  const [texto, setTexto] = useState("")
  const [imagen, setImagen] = useState(null)

  const { usuario } = useContext(AuthContext)
  const { estado } = useContext(ChatContext)

  const inputRef = useRef()

  useEffect(()=> {
    const reiniciarEnvios = ()=> {
      setTexto("")
      setImagen(null)
    }

    estado.chatId && reiniciarEnvios()
  }, [estado.chatId])

  const handleEnviar = async ()=> {
    
    inputRef.current.value = ""

    if (texto.trim() === "" && !imagen) {
      return
    }


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
      [estado.chatId+".ultimoMensaje"]: texto !== "" ? texto : "Imagen",
      [estado.chatId+".fecha"]: serverTimestamp()
    })

    await updateDoc(doc(db, "usuariosChats", estado.usuario.uid), {
      [estado.chatId+".ultimoMensaje"]: texto !== "" ? texto : "Imagen",
      [estado.chatId+".fecha"]: serverTimestamp()
    })

    setTexto("")
    setImagen(null)
  }

  const handleKey = (ev) => {
    ev.code === "Enter" && handleEnviar()
  }

  return (
    <div className="input">
        {imagen && <div className="imagenCargada">
          Imagen - {(imagen.size / 1024).toFixed()} kb  
          <span onClick={ev => {
              setImagen(null)
              inputRef.current.files = null
            }} className="eliminarImagen">X</span>
        </div>}
        <input ref={inputRef} onKeyDown={ev => handleKey(ev)} value={texto !== "" ? texto.trimStart() : texto.trim()} type="text" placeholder="Escribe algo..." onChange={ev=> setTexto(ev.target.value)} />
        <div className="enviar">
            <input accept="image/*" type="file" id="archivo" value={""} onChange={ev => {
              setImagen(ev.target.files[0])
              ev.target.files = null
            }} />
            <label htmlFor="archivo">
                <img src={Archivo} alt="Enviar un archivo" />
            </label>
            <button onClick={handleEnviar}>Enviar</button>
        </div>
    </div>
  )
}

export default Input