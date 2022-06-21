import axios from 'axios'
import jwtDecode from 'jwt-decode'
import React, { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { NavbarLogged } from '../../../components/navbar-logged'
import moment from 'moment'
import 'moment/locale/pt'

import './info-servico.css'
import { useDispatch, useSelector } from 'react-redux'
import { modalTopMensagem, turnModalTopOff, turnModalTopOn } from '../../../reducers/modalTop'
import { ModalTop } from '../../../components/modal-top'

export const InfoServico = () => {
    const [anuncioInfo, setAnuncioInfo] = useState()
    const [anuncioPrazo, setAnuncioPrazo] = useState()
    const [anuncioBudget, setAnuncioBudget] = useState()
    const [anuncioUserId, setAnuncioUserId] = useState()
    const [anuncioUserFoto, setAnuncioUserFoto] = useState()
    const [anuncioUserNome, setAnuncioUserNome] = useState()
    const [anuncioEstado, setAnuncioEstado] = useState()
    const [anuncioUserMoedas, setAnuncioUserMoedas] = useState()
    const [anuncioUserTrabalho, setAnuncioUserTrabalho] = useState()
    const [anuncioCandidatoFinal, setAnuncioCandidatoFinal] = useState()
    const [anuncioCandidatoFinalFoto, setAnuncioCandidatoFinalFoto] = useState()
    const [terminarExiste, setTerminarExiste] = useState()

    const [mensagemInput, setMensagemInput] = useState("")

    const [candidatoNome, setCandidatoNome] = useState()
    const [candidatoProfissao, setCandidatoProfissao] = useState()
    const [candidatoMoedas, setCandidatoMoedas] = useState()

    const [mensagens, setMensagens] = useState()
    const modalTop = useSelector((state) => state.modalTop.modalTop)
    const modalMensagem = useSelector((state) => state.modalTop.mensagem)

    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    moment.locale('pt')

    useEffect(() => {
        console.log(params.anuncioID)
        axios.get("https://hora-site.herokuapp.com/api/getanuncio/" + params.anuncioID)
            .then(res => {
                console.log(res.data)
                setAnuncioInfo(res.data.pedido)
                setAnuncioPrazo(res.data.duracao)
                setAnuncioBudget(res.data.budget)
                setAnuncioEstado(res.data.estado)
                setAnuncioUserId(res.data.criadorID)
                setAnuncioCandidatoFinal(res.data.candidatoFinalID)
                setAnuncioUserFoto(res.data.criadorFoto)
                res.data.terminar.some(function (candidato) {
                    setTerminarExiste(candidato.utilizadorID == jwtDecode(localStorage.getItem("token")).id)
                })
                axios.get("https://hora-site.herokuapp.com/api/getmensagensanuncio/" + params.anuncioID + "/" + res.data.criadorID + "/" + res.data.candidatoFinalID)
                    .then(res => {
                        setMensagens(res.data.mensagens)
                    })
                axios.get("https://hora-site.herokuapp.com/api/finduser/" + res.data.criadorID)
                    .then(response => {
                        setAnuncioUserNome(response.data.nome + " " + response.data.apelido)
                        setAnuncioUserTrabalho(response.data.profissao)
                        setAnuncioUserMoedas(response.data.moedas)
                    })
                axios.get("https://hora-site.herokuapp.com/api/finduser/" + res.data.candidatoFinalID)
                    .then(response => {
                        setCandidatoNome(response.data.nome + " " + response.data.apelido)
                        setCandidatoProfissao(response.data.profissao)
                        setAnuncioCandidatoFinalFoto(response.data.foto)
                        setCandidatoMoedas(response.data.moedas)
                    })
            })
    }, [])

    const handleTerminar = () => {
        axios.put('https://hora-site.herokuapp.com/api/terminaranuncio', { anuncioID: params.anuncioID, candidatoID: jwtDecode(localStorage.getItem("token")).id })
            .then(() => {
                axios.get("https://hora-site.herokuapp.com/api/getanuncio/" + params.anuncioID)
                    .then(res => {
                        if (res.data.terminar.length > 1) {
                            axios.put("https://hora-site.herokuapp.com/estadoanuncio", { anuncioID: params.anuncioID, estado: "Terminado" })
                            axios.put("https://hora-site.herokuapp.com/updatemoedas", { id: anuncioCandidatoFinal, moedas: (candidatoMoedas + anuncioBudget) })
                            axios.put("https://hora-site.herokuapp.com/updatemoedas", { id: anuncioUserId, moedas: (anuncioUserMoedas - anuncioBudget) })
                        }
                    })
                setTerminarExiste(!terminarExiste)
                dispatch(turnModalTopOn())
                dispatch(modalTopMensagem("Aguarde o outro utilizador terminar o serviço."))
                setTimeout(function () {
                    dispatch(turnModalTopOff())
                }, 2000)
                window.location.reload(false)
            })
    }

    const handleCancelarTerminar = () => {
        axios.put('https://hora-site.herokuapp.com/api/cancelarterminaranuncio', { anuncioID: params.anuncioID, candidatoID: jwtDecode(localStorage.getItem("token")).id })
            .then(() => {
                setTerminarExiste(!terminarExiste)
                dispatch(turnModalTopOn())
                dispatch(modalTopMensagem("Cancelou o termino do serviço."))
                setTimeout(function () {
                    dispatch(turnModalTopOff())
                }, 2000)
            })
    }

    const handleEnviar = () => {
        if (mensagemInput !== "") {
            if (anuncioUserId === jwtDecode(localStorage.getItem("token")).id) {
                axios.post("https://hora-site.herokuapp.com/api/enviarmensagem",
                    {
                        texto: mensagemInput,
                        enviadoPor: anuncioUserId,
                        recebidoPor: anuncioCandidatoFinal,
                        enviadoPorNome: anuncioUserNome,
                        recebidoPorNome: candidatoNome,
                        enviadoPorFoto: anuncioUserFoto,
                        recebidoPorFoto: anuncioCandidatoFinalFoto,
                        anuncioID: params.anuncioID
                    }).then(() => {
                        setMensagemInput("")
                        axios.get("https://hora-site.herokuapp.com/api/getmensagensanuncio/" + params.anuncioID + "/" + anuncioUserId + "/" + anuncioCandidatoFinal)
                            .then(res => {
                                setMensagens(res.data.mensagens)
                            })
                    })
            } else {
                axios.post("https://hora-site.herokuapp.com/api/enviarmensagem",
                    {
                        texto: mensagemInput,
                        enviadoPor: anuncioCandidatoFinal,
                        recebidoPor: anuncioUserId,
                        enviadoPorNome: candidatoNome,
                        recebidoPorNome: anuncioUserNome,
                        enviadoPorFoto: anuncioCandidatoFinalFoto,
                        recebidoPorFoto: anuncioUserFoto,
                        anuncioID: params.anuncioID,
                    }).then(res => {
                        setMensagemInput("")
                        axios.get("https://hora-site.herokuapp.com/api/getmensagensanuncio/" + params.anuncioID + "/" + anuncioUserId + "/" + anuncioCandidatoFinal)
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
                            <p><span onClick={() => navigate("/servicos")} id='path'>Serviços / </span>Informações do serviço</p>
                            <div className='botao-terminar-servico'>
                                {anuncioEstado === "Terminado" ?
                                    null
                                    :
                                    <>
                                        {terminarExiste ? <button onClick={handleCancelarTerminar}>Cancelar termino</button> : <button onClick={handleTerminar}>Terminar serviço</button>}
                                    </>
                                }
                            </div>
                        </div>
                        <div className='info-anuncio-body'>
                            <div className='anuncio-section'>
                                <div className='anuncio-section-header'>
                                    <p>Informações</p>
                                    <hr className='horizontal-line'></hr>
                                </div>
                                <div className='anuncio-section-user'>
                                    <p className='grey-title publicado'>Publicado por</p>
                                    <div className='user'>
                                        <img src={anuncioUserFoto} alt='user' />
                                        <div className='user-info'>
                                            <p className='user-name'>{anuncioUserNome}</p>
                                            <p className='user-trabalho'>{anuncioUserTrabalho}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='anuncio-section-user'>
                                    <p className='grey-title publicado'>Candidato</p>
                                    <div className='user'>
                                        <img src={anuncioCandidatoFinalFoto} alt='user' />
                                        <div className='user-info'>
                                            <p className='user-name'>{candidatoNome}</p>
                                            <p className='user-trabalho'>{candidatoProfissao}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='anuncio-section-pedido'>
                                    <p className='grey-title'>Anúncio</p>
                                    <p className='pedido'>{anuncioInfo}</p>
                                </div>
                                <div className='anuncio-section-prazo'>
                                    <p className='grey-title'>Prazo</p>
                                    <p className='prazo'>{anuncioPrazo} dias</p>
                                </div>
                                <div className='anuncio-section-budget'>
                                    <p className='grey-title'>Orçamento</p>
                                    <p className='budget'>{anuncioBudget} ho:ra's</p>
                                </div>
                                <div className='anuncio-section-estado'>
                                    <p className='grey-title'>Estado</p>
                                    <p className='estado'>{anuncioEstado}</p>
                                </div>
                            </div>
                            <div className='chat-section'>
                                <div className='chat-section-header'>
                                    <p className='title'>Atualizações</p>
                                    <hr className='horizontal-line'></hr>
                                </div>
                                {mensagens ?
                                    <div className='mensagens-scroll'>
                                        {mensagens.map(mensagem =>
                                            <div className={mensagem.enviadoPor === jwtDecode(localStorage.getItem("token")).id ? 'minha-mensagem-body' : 'mensagem-body'}>
                                                {mensagem.enviadoPor === anuncioUserId ? <img src={anuncioUserFoto}></img> : <img src={anuncioCandidatoFinalFoto}></img>}
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
