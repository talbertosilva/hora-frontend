import React from 'react'
import { Link } from 'react-router-dom'

import './footer.css'

export const Footer = () => {
    return (
        <div className='footer-container'>
            <div className='logo'>
                <img src='logoHora.png' alt='logo-footer'/>
            </div>
            <div className='sobre'>
                <p>Sobre</p>
                <ul>
                    <li>Como funciona?</li>
                    <li>O que é timebanking?</li>
                    <li>Sobre nós</li>
                </ul>
            </div>
            <div className='paginas'>
                <p>Páginas</p>
                <ul>
                    <li>Home</li>
                    <li>Sobre</li>
                    <Link className='Link' to={"/register"}><li>Registar</li></Link>
                    <Link className='Link' to={"/login"}><li>Login</li></Link>
                    <li>Contacto</li>
                </ul>
            </div>
            <div className='socials'>
                <p>Redes sociais</p>
                <ul>
                    <li>Instagram</li>
                    <li>Facebook</li>
                    <li>LinkedIn</li>
                </ul>
            </div>
        </div>
    )
}
