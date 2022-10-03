import React from 'react'

const Busqueda = () => {
  return (
    <div className='busqueda'>
      <div className="form-busqueda">
        <input type="text" placeholder='Buscar usuario' />
      </div>
      <div className="chat-usuario">
        <img src="https://ivoft.com/wp-content/uploads/2017/11/ulcera-infectada-post-cirugia-Nugget-2-300x300.png" alt="" />
        <div className="chat-info">
          <span>Otro usuario</span>
        </div>
      </div>
    </div>
  )
}

export default Busqueda