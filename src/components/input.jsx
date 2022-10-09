import Archivo from "../assets/archivo.png"
import { useInput } from "../hooks/useInput"

const Input = () => {

  const {
      imagen,
      setImagen,
      texto,
      setTexto,
      handleEnviar,
      handleKey,
      sizeError,
      setSizeError
  } = useInput()

  return (
    <div className="input">

        {imagen && <div className="imagenCargada">
          <span>{(imagen.size / 1024).toFixed() + "kb - " + imagen.name}</span>
          <span onClick={ev => {
              setImagen(null)
            }} className="eliminarImagen">X</span>
        </div>}
        {sizeError && <div className="imagenCargada ">
            <span className="sizeError">Imagen demasiado grande.</span>
        </div>}
        <input onKeyDown={ev => handleKey(ev)} value={texto !== "" ? texto.trimStart() : texto.trim()} type="text" placeholder="Escribe algo..." onChange={ev=> setTexto(ev.target.value)} />
        <div className="enviar">
            <input accept="image/*" type="file" id="archivo" value={""} onChange={ev => {
              if ((ev.target.files[0].size / 1024 / 1024) < 1) {
                setImagen(ev.target.files[0])
                setSizeError(false)
              } else {
                setSizeError(true)
              }
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