import "../styles/formulario.scss"
import agregarAvatar from "../assets/agregarAvatar.png"

import { useState } from "react";
import { auth, storage, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const validarRegistro = (displayName, email, password, file, ev)=> {
	if (displayName.length === 0 || displayName.length > 12 || displayName.length < 4) {
		ev.target[0].style.borderColor = "red"
		return false
	} else if (email.length === 0 || email.length > 40 || email.length < 10) {
		ev.target[1].style.borderColor = "red"
		return false
	} else if (password.length === 0 || password.length > 20 || password.length < 6) {
		ev.target[2].style.borderColor = "red"
		return false
	} else if (file && file.type.slice(0, 5) !== "image") {
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

const cargarImagen = async (displayName, email, password, file, setError)=> {
	const storageRef = ref(storage, displayName);
	const uploadTask = uploadBytesResumable(storageRef, file);
	uploadTask.on(err => setError(true),
		() => {
			getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
				await crearUsuario(displayName, email, password, downloadURL)
			});
		}
	);
}

const Registro = () => {

	const [error, setError] = useState(false)

	const handleSubmit = async (ev)=> {
		ev.preventDefault()
		const displayName = ev.target[0].value.trim()
		const email = ev.target[1].value.trim()
		const password = ev.target[2].value.trim()
		const file = ev.target[3].files[0]

		if (!validarRegistro(displayName, email, password, file, ev)) {
			return setError(true)
		}

		try {
			if (file) {
				await cargarImagen(displayName, email, password, file, setError)
			} else {
				await crearUsuario(displayName, email, password, "https://us.123rf.com/450wm/pikepicture/pikepicture1612/pikepicture161200518/68824648-hombre-defecto-marcador-de-posici%C3%B3n-de-avatar-perfil-gris-de-imagen-aislado-en-el-fondo-blanco-para-.jpg")
			}
			error && setError(false)
		} catch (err) {
			setError(true)
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
					<input type="file" accept="image/*" id="avatar" />
					<label htmlFor="avatar">
						<img src={agregarAvatar} alt="Agregar un avatar" />  
						Elegir avatar
					</label>
					<button>Registrarse</button>
				</form>
				<p>¿Ya tenes cuenta? Inicia sesión</p>
			</div>
		</div>
	)
}

export default Registro