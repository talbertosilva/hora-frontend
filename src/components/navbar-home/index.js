import React from 'react'
import { Link } from 'react-router-dom';

import './navbar-home.css'

export const NavbarHome = () => {
  return (
    <div className='container-navbar-home'>
        <Link to='/'><img src='https://i.postimg.cc/VvtFYYR4/Logo-Hora.png' alt='Logo Hora'/></Link>
        <div className='navbar-home-buttons'>
            <Link to='/login' className='iniciar-sessão-btn'><div>Iniciar sessão</div></Link>
            <Link to='/register'><button>Criar conta</button></Link>
        </div>
    </div>
  )
}
