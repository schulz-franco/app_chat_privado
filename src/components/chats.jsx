import { useState } from 'react'
import { MdDelete } from "react-icons/md"
import { useChats } from '../hooks/useChats'

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

export const Chats = () => {

  const {
      chats,
      handleClick,
      handleEliminar
  } = useChats()

  return (
    <div className='chats'>

      {Object.entries(chats)?.sort((a, b)=> b[1].fecha - a[1].fecha).map(usuario => {
        return(
          <Conversacion key={usuario[0]} usuario={usuario} handleClick={handleClick} handleEliminar={handleEliminar} />
        )
      })}

    </div>
  )
}
