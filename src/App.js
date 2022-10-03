import Home from "./pages/home";
import Inicio from "./pages/inicio";
import Registro from "./pages/registro";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthContext } from "./context/authContext";
import { useContext } from "react";

function App() {

  const {usuario} = useContext(AuthContext)

  const RutaProtegida = ({children})=> {
    if (!usuario) return <Navigate to="/inicio" />
    return children
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={
          <RutaProtegida>
            <Home/>
          </RutaProtegida>
        } />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
