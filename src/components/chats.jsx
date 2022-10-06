import { useEffect, useState, useContext } from 'react'
import { deleteField, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { AuthContext } from '../context/authContext'
import { db } from '../firebase/firebase'
import { ChatContext } from '../context/chatContext'
import { MdDelete } from "react-icons/md"

const Conversacion = ({ usuario, handleClick, handleEliminar })=> {

  const [hover, setHover] = useState(false)

  return(
    <div onMouseEnter={()=> setHover(true)} onMouseLeave={()=> setHover(false)} key={usuario[0]} onClick={(ev)=> handleClick(usuario[1].informacion, ev)} className="chat-usuario">
      <img src={usuario[1].informacion.photoURL} alt={usuario[1].informacion.displayName} />
      <div className="chat-info">
        <span>{usuario[1].informacion.displayName}</span>
        <p>{usuario[1].ultimoMensaje}</p>
      </div>
      {hover && <MdDelete className='eliminar' onClick={()=> handleEliminar(usuario)} />}
    </div>
  )
}

const Chats = () => {

  const [chats, setChats] = useState([])
  const { usuario } = useContext(AuthContext)
  const { estado, despacho } = useContext(ChatContext)

  useEffect(()=> {
    const obtenerChats = ()=> {
      const unsub = onSnapshot(doc(db, "usuariosChats", usuario.uid), doc => {
        setChats(doc.data())
      })
      return ()=> unsub()
    }
    usuario.uid && obtenerChats()
  }, [usuario.uid])

  const handleClick = (informacionUsuario, ev)=> {
    if (typeof(ev.target.className) !== "object") {
      despacho({type: "CAMBIAR_USUARIO", payload: informacionUsuario})
    }
  }

  const handleEliminar = async (informacionUsuario) => {
    await updateDoc(doc(db, "usuariosChats", usuario.uid), {
      [informacionUsuario[0]]: deleteField()
    })
    if (estado.chatId === informacionUsuario[0]) {
      despacho({type: "LIMPIAR"})
    }
  }

  return (
    <div className='chats'>
      {Object.entries(chats)?.sort((a, b)=> b[1].fecha - a[1].fecha).map(usuario => {
        return(
          <Conversacion usuario={usuario} handleClick={handleClick} handleEliminar={handleEliminar} />
        )
      })}
    </div>
  )
}

export default Chats