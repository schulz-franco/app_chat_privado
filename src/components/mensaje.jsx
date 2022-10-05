import { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/authContext'
import { ChatContext } from '../context/chatContext'

const Mensaje = ({ contenido }) => {

  const { usuario } = useContext(AuthContext)
  const { estado } = useContext(ChatContext)

  const mensajeRef = useRef()

  useEffect(()=> {
    mensajeRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [contenido])

  return (
    <div ref={mensajeRef} className={"mensaje " + (contenido.emisorId === usuario.uid && "propietario")}>
      <div className="mensaje-info">
        <img src={contenido.emisorId === usuario.uid ? usuario.photoURL : estado.usuario.photoURL} alt="Usuario" />
        <span>Ahora</span>
      </div>
      <div className="mensaje-contenido">
        {contenido.texto !== "" && <p>{contenido.texto}</p>}
        {contenido.imagen && <img src={contenido.imagen} alt="Imagen" />}
      </div>
    </div>
  )
}

export default Mensaje