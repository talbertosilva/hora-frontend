import React from 'react'
import { Link } from 'react-router-dom';

import './navbar-simple.css'

export const NavbarSimple = () => {
  return (
    <div className='container-navbar-simple'>
        <Link to='/'><img src='logoHora.png' alt='Logo Hora'/></Link>
    </div>
  )
}