import { arrayRemove, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import { useContext, useEffect } from "react"
import { useState } from "react"
import { BsShieldLockFill } from "react-icons/bs"
import { ImUnlocked } from "react-icons/im"
import { AuthContext } from "../context/authContext"
import { db } from "../firebase/firebase"

const Bloqueado = ({ usuario, desbloquear })=> {

    const [hover, setHover] = useState(false)

    return(
      <div onMouseEnter={()=> setHover(true)} onMouseLeave={()=> setHover(false)} className="chat-usuario">
        <img src={usuario.photoURL} alt={usuario.displayName} />
        <div className="chat-info">
          <span>{usuario.displayName}</span>
        </div>
        {hover && <ImUnlocked onClick={()=> desbloquear(usuario.uid)} className='eliminar' />}
      </div>
    )
  }

export const Bloqueados = ()=> {

    const [abierto, setAbierto] = useState(false)
    const [bloqueados, setBloqueados] = useState([])
    const { usuario } = useContext(AuthContext)

    useEffect(()=> {
        usuario && traerBloqueados()
    }, [])

    const traerBloqueados = async ()=> {
        const unsub = onSnapshot(doc(db, "usuarios", usuario.uid), usuarioActual => {
            let listaUsuarios = []
            usuarioActual.data()?.bloqueados.forEach(async (usuarioBloqueado) => {
                const usuarioBloqueadoInfo = await getDoc(doc(db, "usuarios", usuarioBloqueado.uid))
                listaUsuarios.push(usuarioBloqueadoInfo.data())
            })
            setBloqueados(listaUsuarios)
        })
        return ()=> unsub()
    }

    const desbloquear = async (bloqueadoUid)=> {
        await updateDoc(doc(db, "usuarios", usuario.uid), {
            bloqueados: arrayRemove({uid: bloqueadoUid})
        })
        setBloqueados(bloqueados.filter(usuarioBloqueado => usuarioBloqueado.uid !== bloqueadoUid))
    }

    return(
        <>
        {abierto && <div className="lista-bloqueados">
            {bloqueados.map(usuarioBloqueado => {
                return(
                    <Bloqueado key={usuarioBloqueado.uid} usuario={usuarioBloqueado} desbloquear={desbloquear} />
                )
            })}
            {bloqueados.length === 0 && <span className="noBloqueos">Sin bloqueos</span>}
        </div>}
        <div onClick={()=> setAbierto(!abierto)} className="bloqueados">
            Usuarios bloqueados
            <BsShieldLockFill className="lock" />
        </div>
        </>
    )
}