import { useState } from "react"
import "../styles/formulario.scss"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase/firebase"
import { Link, useNavigate } from "react-router-dom"

const Inicio = () => {

  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

	const handleSubmit = async (ev)=> {
		ev.preventDefault()
    setLoading(true)
    setError(false)
		const email = ev.target[0].value.trim()
		const password = ev.target[1].value.trim()

		try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/")
		} catch (err) {
      setLoading(false)
			setError(true)
		}
	}

  return (
    <div className="form-container">
        <div className="form">
            <span className="titulo">Chatea ahora</span>
            <span className="subtitulo">Iniciar sesión</span>
            {error && <span className="error">Ocurrio un error, intente nuevamente.</span>}
            <form onSubmit={(ev)=> handleSubmit(ev)}>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Contraseña" />
                <button>Iniciar sesión</button>
            </form>
            {loading && <div className="loading">
              <div></div>
              <div></div>
              <div></div>
            </div>}
            <p>¿No tenes cuenta? <Link to="/registro">Registrate</Link></p>
        </div>
    </div>
  )
}

export default Inicio