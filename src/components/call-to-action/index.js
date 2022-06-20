import React from 'react'
import { Link } from 'react-router-dom'

import './callToAction.css'

export const CallToAction = () => {
  return (
    <div className='container-cta'>
        <div className='container-cta-left'>
            <h1>Comece já a trocar as suas horas!</h1>
        </div>

        <div className='container-cta-right'>
            <p>Cria conta, coleta as tuas ho:ra’s e encontra alguém disposto a ajudar-te! Recomendamos-te anunciares um pedido e esperares que o resto da comunidade se ofereça a ajudar. Desta forma poderás entender a dinâmica da plataforma!</p>
            <Link to="/register"><button>Criar conta</button></Link>
        </div>
    </div>
  )
}
