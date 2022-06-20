import React from 'react'
import { About } from './about'
import { Reviews } from './reviews'

import './perfil-body.css'

export const PerfilBody = ({userID}) => {
  return (
    <div className='perfil-body-container'>
        <About />
        <Reviews userID={userID} />
    </div>
  )
}
