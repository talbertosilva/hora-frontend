import React from 'react'

import './comoFunciona.css'

export const ComoFunciona = () => {
    return (
        <div className='como-funciona-container'>
            <h1>Como funciona?</h1>
            <div className='como-funciona-cards'>
                <div className='como-funciona-card'>
                    <div className='img img-1'></div>
                    <p className='title'>Crie uma conta e receba ho:ra's</p>
                    <p className='description'>Ao criar uma conta e verificá-la, recebe imediatamente ho:ra's para começar a trocar serviços!</p>
                </div>
                <div className='como-funciona-card'>
                    <div className='img img-2'></div>
                    <p className='title'>Pague serviços com essas ho:ra's</p>
                    <p className='description'>Com as ho:ra’s coletadas pode pagar serviços e começar a trocar na plataforma.</p>
                </div>
                <div className='como-funciona-card'>
                    <div className='img img-3'></div>
                    <p className='title'>Ajude as pessoas e receba mais ho:ra's</p>
                    <p className='description'>Contribua para a comunidade e forneça serviços em troca do seu tempo.!</p>
                </div>
            </div>
        </div>
    )
}
