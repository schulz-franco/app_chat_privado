import { useMensaje } from "../hooks/useMensaje"

const Mensaje = ({ contenido, imagen }) => {

  const {
      usuario,
      estado,
      mensajeRef,
      imagenStyles
  } = useMensaje(contenido, imagen)

  return (
    <div ref={mensajeRef} className={"mensaje " + (contenido.emisorId === usuario.uid && "propietario")}>
      <div className="mensaje-info">
        <img style={imagenStyles} src={contenido.emisorId === usuario.uid ? usuario.photoURL : estado.usuario.photoURL} alt="Usuario" />
      </div>
      <div className="mensaje-contenido">
        {contenido.texto !== "" && <p>{contenido.texto}</p>}
        {contenido.imagen && <img src={contenido.imagen} alt="Imagen" />}
      </div>
    </div>
  )
}

export default Mensaje