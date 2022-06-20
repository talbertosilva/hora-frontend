import React from 'react'

import './modal-top.css'

export const ModalTop = ({Mensagem}) => {
    return (
        <div className='modal-top'>
            <div className='modal-top-container'>
                <p>{Mensagem}</p>
            </div>
        </div>
    )
}
