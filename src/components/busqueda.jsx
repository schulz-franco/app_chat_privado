import { AiOutlineSearch } from "react-icons/ai" 
import { useBusqueda } from "../hooks/useBusqueda"

const Busqueda = () => {

  const {
      nombreUsuario,
      setNombreUsuario,
      loading,
      error,
      usuarioBuscado,
      handleBusqueda,
      handleClick,
      handleKey
  } = useBusqueda()

  return (
    <div className='busqueda'>
      <div className="form-busqueda">
        <input value={nombreUsuario} type="text" placeholder='Buscar usuario' onKeyDown={handleKey} onChange={(ev)=> setNombreUsuario(ev.target.value)} />
        <AiOutlineSearch className='lupa' onClick={handleBusqueda} />
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