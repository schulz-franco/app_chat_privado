import "../styles/formulario.scss"

import { useState } from "react";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const validarRegistro = async (displayName, email, password, ev)=> {
	// Traigo a los usuarios que existan con el nombre usado para registrarse
	const q = query(collection(db, "usuarios"), where("displayName", "==", displayName))
	const querySnapshot = await getDocs(q);
	let contador = 0
	// Si existen usuarios, lo indico a la variable contador
	querySnapshot.forEach((doc) => {
		contador++
	});
	// Si existen usuarios, muestro error
	if (contador !== 0) {
		ev.target[0].style.borderColor = "red"
		return false
	} else if (displayName.length === 0 || displayName.length > 12 || displayName.length < 4) {
		ev.target[0].style.borderColor = "red"
		return false
	} else if (email.length === 0 || email.length > 40 || email.length < 10) {
		ev.target[1].style.borderColor = "red"
		return false
	} else if (password.length === 0 || password.length > 20 || password.length < 6) {
		ev.target[2].style.borderColor = "red"
		return false 
	} else {
		ev.target[0].style.borderColor = "#a7bcff"
		ev.target[1].style.borderColor = "#a7bcff"
		ev.target[2].style.borderColor = "#a7bcff"
		return true
	}
}

const crearUsuario = async (displayName, email, password, imagenURL) => {
	const response = await createUserWithEmailAndPassword(auth, email, password)
	await updateProfile(response.user, {
		displayName,
		photoURL: imagenURL
	})
	await setDoc(doc(db, "usuarios", response.user.uid), {
		uid: response.user.uid,
		displayName,
		email,
		photoURL: imagenURL
	})
	await setDoc(doc(db, "usuariosChats", response.user.uid), {})
}

const Registro = () => {

	const [error, setError] = useState(false)
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const handleSubmit = async (ev)=> {
		ev.preventDefault()
		setLoading(true)
		const displayName = ev.target[0].value.trim()
		const email = ev.target[1].value.trim()
		const password = ev.target[2].value.trim()

		const validacion = await validarRegistro(displayName, email, password, ev)

		if (!validacion) {
			setLoading(false)
			return setError(true)
		}

		try {
			await crearUsuario(displayName, email, password, "https://us.123rf.com/450wm/pikepicture/pikepicture1612/pikepicture161200518/68824648-hombre-defecto-marcador-de-posici%C3%B3n-de-avatar-perfil-gris-de-imagen-aislado-en-el-fondo-blanco-para-.jpg")
			navigate("/")
			}
		catch (err) {
			setError(true)
			setLoading(false)
		}
	}

	return (
		<div className="form-container">
			<div className="form">
				<span className="titulo">Chatea ahora</span>
				<span className="subtitulo">Registro</span>
				{error && <span className="error">Ocurrio un error, intente nuevamente.</span>}
				<form onSubmit={(ev)=> handleSubmit(ev)}>
					<input required minLength={4} maxLength={12} type="text" placeholder="Nombre de usuario" />
					<input required minLength={10} maxLength={40} type="email" placeholder="Email" />
					<input required minLength={6} maxLength={20} type="password" placeholder="Contraseña" />
					<button>Registrarse</button>
				</form>
				{loading && <div className="loading">
					<div></div>
					<div></div>
					<div></div>
				</div>}
				<p>¿Ya tenes cuenta? <Link to="/inicio">Inicia sesión</Link></p>
			</div>
		</div>
	)
}

export default Registro