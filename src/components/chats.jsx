import { useEffect, useState, useContext } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { AuthContext } from '../context/authContext'
import { db } from '../firebase/firebase'
import { ChatContext } from '../context/chatContext'

const Chats = () => {

  const [chats, setChats] = useState([])
  const { usuario } = useContext(AuthContext)
  const { despacho } = useContext(ChatContext)

  useEffect(()=> {
    const obtenerChats = ()=> {
      const unsub = onSnapshot(doc(db, "usuariosChats", usuario.uid), doc => {
        setChats(doc.data())
      })
      return ()=> unsub()
    }
    usuario.uid && obtenerChats()
  }, [usuario.uid])

  const handleClick = (informacionUsuario)=> {
    despacho({type: "CAMBIAR_USUARIO", payload: informacionUsuario})
  }

  return (
    <div className='chats'>
      {Object.entries(chats)?.sort((a, b)=> b[1].fecha - a[1].fecha).map(usuario => {
        return(
          <div key={usuario[0]} onClick={()=> handleClick(usuario[1].informacion)} className="chat-usuario">
            <img src={usuario[1].informacion.photoURL} alt={usuario[1].informacion.displayName} />
            <div className="chat-info">
              <span>{usuario[1].informacion.displayName}</span>
              <p>{usuario[1].ultimoMensaje}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Chats