import { useMensajes } from "../hooks/useMensajes"
import Mensaje from "./mensaje"

const Mensajes = () => {

    const { mensajes } = useMensajes()
    // Guardo el emisor de cada mensaje para ocultar las imagenes si un usuario envia varios mensajes (solo mostrar la imagen del usuario en el primer mensaje)
    let emisor = ""

    return (
      <div className="mensajes">
          {mensajes.map(mensaje => {
            if (mensaje.emisorId === emisor) {
              return <Mensaje key={mensaje.id} contenido={mensaje} imagen={false} />
            }
            emisor = mensaje.emisorId
            return <Mensaje key={mensaje.id} contenido={mensaje} imagen={true} />
          })}
      </div>
    )
}

export default Mensajes