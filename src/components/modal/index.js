import axios from 'axios'
import React from 'react'
import { useDispatch } from 'react-redux'
import { turnModalOff } from '../../reducers/modalApagarAnuncio'

import './modal.css'

export const Modal = ({anuncioID}) => {
    const dispatch = useDispatch()

    const handleApagar = () => {
        axios.delete('https://hora-site.herokuapp.com/api/apagaranuncio/' + anuncioID)
        dispatch(turnModalOff())
        window.location.reload(false)
    }

    return (
        <div className='modal-fullscreen'>
            <div className='modal-container'>
                <p>Têm a certeza que pretende apagar este anúncio?</p>
                <div>
                    <button onClick={() => dispatch(turnModalOff())} className='cancelar-btn'>Cancelar</button>
                    <button onClick={handleApagar} id='apagar-btn'>Apagar anúncio</button>
                </div>
            </div>
        </div>
    )
}
