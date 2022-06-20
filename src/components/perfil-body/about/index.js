import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateQualificacoes, updateServicos, updateSobre } from '../../../reducers/loggedUser'
import moment from 'moment'

import './about.css'

export const About = () => {
    const edit = useSelector((state) => state.editProfile.editing)
    const dispatch = useDispatch()
    const utilizador = useSelector((state) => state.logUser.user)

    const formattedDate = moment(utilizador.created).utc().format('DD/MM/YYYY')

    const handleSobre = (e) => {
        dispatch(updateSobre(e))
    }

    const handleQualificacoes = (e) => {
        dispatch(updateQualificacoes(e))
    }

    const handleServicos = (e) => {
        dispatch(updateServicos(e))
    }

    return (
        <div className='sobre-container'>
            <div>
                <p className='sobre-title'>Sobre</p>
                <textarea disabled={!edit} value={utilizador.sobre} onChange={(e) => handleSobre(e.target.value)} className={edit ? 'sobre-body-editing' : 'sobre-body'}></textarea>
            </div>
            <div>
                <p className='sobre-title'>Serviços</p>
                <textarea disabled={!edit} value={utilizador.servicos} onChange={(e) => handleServicos(e.target.value)} className={edit ? 'sobre-body-editing' : 'sobre-body'}></textarea>
            </div>
            <div>
                <p className='sobre-title'>Qualificações</p>
                <textarea disabled={!edit} value={utilizador.qualificacoes} onChange={(e) => handleQualificacoes(e.target.value)} className={edit ? 'sobre-body-editing' : 'sobre-body'}></textarea>
            </div>
            <div>
                <p className='sobre-title'>Membro desde</p>
                <p className='sobre-body-data'>{formattedDate}</p>
            </div>
        </div>
    )
}
