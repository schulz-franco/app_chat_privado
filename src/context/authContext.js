import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";

export const AuthContext = createContext()

export const AuthContextProvider = ({ children })=> {
    const [usuario, setUsuario] = useState({})

    useEffect(()=> {
        const unsub = onAuthStateChanged(auth, user=> {
            setUsuario(user)
            console.log(user)
        })

        return ()=> unsub()
    }, [])

    return (
        <AuthContext.Provider value={{usuario}}>
            {children}
        </AuthContext.Provider>
    )

}