import Archivo from "../assets/archivo.png"
import Imagen from "../assets/imagen.png"

const Input = () => {
  return (
    <div className="input">
        <input type="text" placeholder="Escribe algo..." />
        <div className="enviar">
            <img src={Imagen} alt="Enviar una foto" />
            <input type="file" id="archivo" />
            <label htmlFor="archivo">
                <img src={Archivo} alt="Enviar un archivo" />
            </label>
            <button>Enviar</button>
        </div>
    </div>
  )
}

export default Input