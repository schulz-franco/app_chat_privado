import { useContext, useEffect, useState } from 'react'
import { collection, query, where, getDocs, getDoc, setDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase/firebase'
import { AuthContext } from "../context/authContext"

const Busqueda = () => {
  
  const [nombreUsuario, setNombreUsuario] = useState("")
  const [usuarioBuscado, setUsuarioBuscado] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const { usuario } = useContext(AuthContext)

  useEffect(()=> {
    handleBusqueda()
  }, [nombreUsuario])

  const handleBusqueda = async ()=> {
    setLoading(true)
    const q = query(collection(db, "usuarios"), where("displayName", "==", nombreUsuario))
    
    try {
      const querySnapshot = await getDocs(q);
      let contador = 0
      querySnapshot.forEach((doc) => {
        contador++
        error && setError(false)
        setUsuarioBuscado(doc.data())
      });
      if (contador === 0) {
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
  
  const handleKey = (ev)=> {
    ev.code === "Enter" && handleBusqueda()
  }
  
  const handleClick = async ()=> {
    // genero identificacion para el chat
    const combinacionIds = usuario.uid > usuarioBuscado.uid ? usuario.uid + usuarioBuscado.uid : usuarioBuscado.uid + usuario.uid
    
    try {
      // verifico si existe el chat, si no lo creo
      const response = await getDoc(doc(db, "chats", combinacionIds))
      if (!response.exists()) {
        await setDoc(doc(db, "chats", combinacionIds), {
          mensajes: []
        })

        await updateDoc(doc(db, "usuariosChats", usuario.uid), {
          [combinacionIds+".informacion"]: {
            uid: usuarioBuscado.uid,
            displayName: usuarioBuscado.displayName,
            photoURL: usuarioBuscado.photoURL
          },
          [combinacionIds+".ultimoMensaje"]: "",
          [combinacionIds+".fecha"]: serverTimestamp()
        })

        await updateDoc(doc(db, "usuariosChats", usuarioBuscado.uid), {
          [combinacionIds+".informacion"]: {
            uid: usuario.uid,
            displayName: usuario.displayName,
            photoURL: usuario.photoURL
          },
          [combinacionIds+".ultimoMensaje"]: "",
          [combinacionIds+".fecha"]: serverTimestamp()
        })
        setNombreUsuario("")
        setUsuarioBuscado(null)
      }
    } catch (err) {}
  }

  return (
    <div className='busqueda'>
      <div className="form-busqueda">
        <input value={nombreUsuario} type="text" placeholder='Buscar usuario' onKeyDown={handleKey} onChange={(ev)=> setNombreUsuario(ev.target.value)} />
      </div>
      {(error && !loading) && <span className='error'>No se encontro ese usuario!</span>}
      {loading && <span className='error'>Cargando...</span>}
      {(usuarioBuscado && !loading) && <div onClick={handleClick} className="chat-usuario">
        <img src={usuarioBuscado.photoURL} alt="" />
        <div className="chat-info">
          <span>{usuarioBuscado.displayName}</span>
        </div>
      </div>}
    </div>
    )
  }
  
  export default Busqueda