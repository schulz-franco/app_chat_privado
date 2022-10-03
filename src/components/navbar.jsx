import React from 'react'

const Navbar = () => {
  return (
    <div className='navbar'>
      <span className="titulo">Chats</span>
      <div className="usuario">
        <img src="https://www.elgatofeliz.es/wp-content/uploads/2020/09/maine-coon-atigrado.jpg" alt="Avatar" />
        <span>Nombre</span>
        <button>Salir</button>
      </div>
    </div>
  )
}

export default Navbar