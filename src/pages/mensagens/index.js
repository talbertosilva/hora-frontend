import axios from 'axios'
import jwtDecode from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { NavbarLogged } from '../../components/navbar-logged'
import moment from 'moment'
import 'moment/locale/pt'

import './mensagens.css'
import { useSelector } from 'react-redux'
import { ModalTop } from '../../components/modal-top'

export const Mensagens = () => {

    const [mensagemInput, setMensagemInput] = useState("")
    const [conversaSelecionada, setConversaSelecionada] = useState(0)

    const [conversaInfo, setConversaInfo] = useState()
    const [conversas, setConversas] = useState()
    const [mensagens, setMensagens] = useState()
    const modalTop = useSelector((state) => state.modalTop.modalTop)
    const modalMensagem = useSelector((state) => state.modalTop.mensagem)

    const anuncioID = "chat"

    moment.locale('pt')

    useEffect(() => {
        axios.get("https://hora-site.herokuapp.com/api/getmensagenspessoa/" + jwtDecode(localStorage.getItem("token")).id).then(res => {
            setConversas(res.data)
            setConversaSelecionada(res.data[0]._id)
            setConversaInfo(res.data[0])
            setMensagens(res.data[0].mensagens)
        })
    }, [])

    useEffect(() => {
        axios.get("https://hora-site.herokuapp.com/api/getmensagenspessoa/" + jwtDecode(localStorage.getItem("token")).id).then(res => {
            setConversas(res.data)
        })
    }, [conversas])

    const handleSelecionarConversa = (id, conversaID) => {
        setConversaSelecionada(conversaID)
        axios.get("https://hora-site.herokuapp.com/api/getMensagensID/" + conversaID).then(conversa => {
            setConversaInfo(conversa.data)
            setMensagens(conversa.data.mensagens)
        })
    }

    const handleEnviar = () => {
        if (mensagemInput !== "") {
            console.log(conversaInfo)
            if (conversaInfo.utilizadorUm === jwtDecode(localStorage.getItem("token")).id) {
                axios.post("https://hora-site.herokuapp.com/api/enviarmensagem",
                    {
                        texto: mensagemInput,
                        enviadoPor: conversaInfo.utilizadorUm,
                        recebidoPor: conversaInfo.utilizadorDois,
                        enviadoPorNome: conversaInfo.utilizadorUmNome,
                        recebidoPorNome: conversaInfo.utilizadorDoisNome,
                        enviadoPorFoto: conversaInfo.utilizadorUmFoto,
                        recebidoPorFoto: conversaInfo.utilizadorDoisFoto,
                        anuncioID: "chat"
                    }).then(() => {
                        setMensagemInput("")
                        axios.get("https://hora-site.herokuapp.com/api/getmensagensanuncio/" + anuncioID + "/" + conversaInfo.utilizadorUm + "/" + conversaInfo.utilizadorDois)
                            .then(res => {
                                setMensagens(res.data.mensagens)
                            })
                    })
            } else {
                axios.post("https://hora-site.herokuapp.com/api/enviarmensagem",
                    {
                        texto: mensagemInput,
                        enviadoPor: conversaInfo.utilizadorDois,
                        recebidoPor: conversaInfo.utilizadorUm,
                        enviadoPorNome: conversaInfo.utilizadorDoisNome,
                        recebidoPorNome: conversaInfo.utilizadorUmNome,
                        enviadoPorFoto: conversaInfo.utilizadorDoisFoto,
                        recebidoPorFoto: conversaInfo.utilizadorUmFoto,
                        anuncioID: "chat"
                    }).then(res => {
                        setMensagemInput("")
                        axios.get("https://hora-site.herokuapp.com/api/getmensagensanuncio/" + anuncioID + "/" + conversaInfo.utilizadorDois + "/" + conversaInfo.utilizadorUm)
                            .then(res => {
                                setMensagens(res.data.mensagens)
                            })
                    })
            }
        }
    }


    return (
        <>
            {
                localStorage.getItem("token") != null ?
                    <div className='info-anuncio-container'>
                        {modalTop ? <ModalTop Mensagem={modalMensagem} /> : null}
                        <NavbarLogged />
                        <div className='info-anuncio-header'>
                            <p>Mensagens</p>
                        </div>
                        <div className='info-anuncio-body'>
                            <div className='anuncio-section'>
                                <div className='anuncio-section-header'>
                                    <p>Conversas</p>
                                    <hr className='horizontal-line'></hr>
                                </div>
                                <div className='anuncio-section-user'>
                                    {conversas ?
                                        <>
                                            {conversas.map(conversa =>
                                                <div className={conversaSelecionada === conversa._id ? 'user selecionado' : 'user'} onClick={() => handleSelecionarConversa(conversa.utilizadorDois, conversa._id)}>
                                                    <img src={conversa.utilizadorUm === jwtDecode(localStorage.getItem("token")).id ? conversa.utilizadorDoisFoto : conversa.utilizadorUmFoto} alt='user' />
                                                    <div className='user-info'>
                                                        <p className='user-name'>{conversa.utilizadorUm === jwtDecode(localStorage.getItem("token")).id ? conversa.utilizadorDoisNome : conversa.utilizadorUmNome}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                        : null
                                    }
                                </div>
                            </div>
                            <div className='chat-section'>
                                <div className='chat-section-header'>
                                    <p className='title'>Mensagens</p>
                                    <hr className='horizontal-line'></hr>
                                </div>
                                {mensagens ?
                                    <div className='mensagens-scroll'>
                                        {mensagens.map(mensagem =>
                                            <div className={mensagem.enviadoPor === jwtDecode(localStorage.getItem("token")).id ? 'minha-mensagem-body' : 'mensagem-body'}>
                                                {mensagem.enviadoPor === jwtDecode(localStorage.getItem("token")).id ? <img src={mensagem.enviadoPorFoto}></img> : <img src={mensagem.enviadoPorFoto}></img>}
                                                <div className='mensagem-texto-data'>
                                                    <p className='texto'>{mensagem.texto}</p>
                                                    <p className='data'>{moment(mensagem.data).fromNow()}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div> : null}
                                <div className='enviar-mensagem-box'>
                                    <textarea value={mensagemInput} onChange={(e) => setMensagemInput(e.target.value)} placeholder='Escreva uma mensagem...' type={"text"}></textarea>
                                    <button onClick={handleEnviar}>Enviar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <Navigate to="/login" />
            }
        </>
    )
}
