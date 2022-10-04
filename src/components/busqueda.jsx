import { useState } from 'react'
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase/firebase'

const Busqueda = () => {

  const [nombreUsuario, setNombreUsuario] = useState("")
  const [usuario, setUsuario] = useState(null)
  const [error, setError] = useState(false)

  const handleBusqueda = async ()=> {
    const q = query(collection(db, "usuarios"), where("displayName", "==", nombreUsuario))

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUsuario(doc.data())
      });
    } catch (err) {
        setError(true)
    }
  }

  const handleKey = (ev)=> {
    ev.code === "Enter" && handleBusqueda()
  }

  return (
    <div className='busqueda'>
      <div className="form-busqueda">
        <input type="text" placeholder='Buscar usuario' onKeyDown={handleKey} onChange={(ev)=> setNombreUsuario(ev.target.value)} />
      </div>
      {error && <span>No se encontro ese usuario!</span>}
      {usuario && <div className="chat-usuario">
        <img src={usuario.photoURL} alt="" />
        <div className="chat-info">
          <span>{usuario.displayName}</span>
        </div>
      </div>}
    </div>
  )
}

export default Busqueda