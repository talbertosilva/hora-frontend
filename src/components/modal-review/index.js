import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { turnModalOff } from '../../reducers/modalReview'

import { AiFillStar } from 'react-icons/ai'

import './modal-review.css'
import jwtDecode from 'jwt-decode'
import { modalTopMensagem, turnModalTopOff, turnModalTopOn } from '../../reducers/modalTop'
import { ModalTop } from '../modal-top'

export const ModalReview = () => {
    const dispatch = useDispatch()
    const reviewID = useSelector((state) => state.reviewModal.reviewAnuncioID)

    const [numEstrelas, setNumEstrelas] = useState(0)
    const [textoReview, setTextoReview] = useState()

    const [anuncioData, setAnuncioData] = useState("")
    const [nomeUtilizador, setNomeUtilizador] = useState("")
    const [foto, setFoto] = useState("")
    const [utilizadorID, setUtilizadorID] = useState("")

    const utilizadorAtualID = jwtDecode(localStorage.getItem("token")).id

    const [reviewExiste, setReviewExiste] = useState(false)

    useEffect(() => {
        axios.get("https://hora-site.herokuapp.com/api/getanuncio/" + reviewID)
            .then(res => {
                setAnuncioData(res.data)
                res.data.reviews.some(function (review) {
                    setReviewExiste(review.utilizadorID == jwtDecode(localStorage.getItem("token")).id)
                })
                if (res.data.criadorID !== jwtDecode(localStorage.getItem("token")).id) {
                    setUtilizadorID(res.data.criadorID)
                    setFoto(res.data.candidatoFinalFoto)
                    axios.get("https://hora-site.herokuapp.com/api/finduser/" + res.data.candidatoFinalID)
                        .then(response => {
                            setNomeUtilizador(response.data.nome + " " + response.data.apelido)
                        })
                } else {
                    setUtilizadorID(res.data.candidatoFinalID)
                    setFoto(res.data.criadorFoto)
                    axios.get("https://hora-site.herokuapp.com/api/finduser/" + res.data.criadorID)
                        .then(response => {
                            setNomeUtilizador(response.data.nome + " " + response.data.apelido)
                        })
                }
            })
    }, [])


    const handleEnviarReview = () => {
        reviewExiste ?
            dispatch(turnModalOff())
            &&
            dispatch(modalTopMensagem("Já deixou uma review nesse anúncio"))
            &&
            dispatch(turnModalTopOn())
            &&
            setTimeout(function () {
                dispatch(turnModalTopOff())
            }, 2000)
            :
            axios.post('https://hora-site.herokuapp.com/api/postreview', {
                texto: textoReview,
                estrelas: numEstrelas,
                foto: foto,
                nome: nomeUtilizador,
                troca: anuncioData.categoria,
                UtilizadorID: utilizadorID,
                anuncioID: anuncioData._id
            })
        axios.put('https://hora-site.herokuapp.com/api/enviarreview', {
            anuncioID: anuncioData._id,
            utilizadorID: utilizadorAtualID
        }).then(() => {
            dispatch(turnModalOff())
            dispatch(modalTopMensagem("Review enviada com sucesso!"))
            dispatch(turnModalTopOn())
            setTimeout(function () {
                dispatch(turnModalTopOff())
            }, 2000)
        })
    }

    return (
        <div className='modal-fullscreen'>
            <div className='modal-container'>
                <p>Avaliação</p>
                <div className='input-estrelas'>
                    <textarea value={textoReview} onChange={(e) => setTextoReview(e.target.value)} placeholder='Escreva uma mensagem a avaliar o outro utilizador e a troca em si...'></textarea>
                    <div>
                        <AiFillStar onClick={() => setNumEstrelas(1)} size={24} className={numEstrelas >= 1 ? "icon-selected" : "icon-unselected"} />
                        <AiFillStar onClick={() => setNumEstrelas(2)} size={24} className={numEstrelas >= 2 ? "icon-selected" : "icon-unselected"} />
                        <AiFillStar onClick={() => setNumEstrelas(3)} size={24} className={numEstrelas >= 3 ? "icon-selected" : "icon-unselected"} />
                        <AiFillStar onClick={() => setNumEstrelas(4)} size={24} className={numEstrelas >= 4 ? "icon-selected" : "icon-unselected"} />
                        <AiFillStar onClick={() => setNumEstrelas(5)} size={24} className={numEstrelas >= 5 ? "icon-selected" : "icon-unselected"} />
                    </div>
                </div>
                <div>
                    <button onClick={() => dispatch(turnModalOff())} className='cancelar-btn'>Cancelar</button>
                    <button onClick={handleEnviarReview} className='apagar-btn'>Enviar avaliação</button>
                </div>
            </div>
        </div>
    )
}
