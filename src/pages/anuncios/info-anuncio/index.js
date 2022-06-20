import axios from 'axios'
import jwtDecode from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { NavbarLogged } from '../../../components/navbar-logged'

import './info-anuncio.css'

export const InfoAnuncio = () => {
    const [anuncioInfo, setAnuncioInfo] = useState()
    const [anuncioPrazo, setAnuncioPrazo] = useState()
    const [anuncioBudget, setAnuncioBudget] = useState()
    const [anuncioUserId, setAnuncioUserId] = useState()
    const [anuncioUserNome, setAnuncioUserNome] = useState()
    const [anuncioEstado, setAnuncioEstado] = useState()
    const [anuncioUserTrabalho, setAnuncioUserTrabalho] = useState()
    const [anuncioUserFoto, setAnuncioUserFoto] = useState()
    const [anuncioCandidatos, setAnuncioCandidatos] = useState()
    const [anuncioCandidatoFinal, setAnuncioCandidatoFinal] = useState()

    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        axios.get("https://hora-site.herokuapp.com/api/getanuncio/" + params.anuncioID)
            .then(res => {
                setAnuncioInfo(res.data.pedido)
                setAnuncioPrazo(res.data.duracao)
                setAnuncioBudget(res.data.budget)
                setAnuncioEstado(res.data.estado)
                setAnuncioUserId(res.data.criadorID)
                setAnuncioCandidatos(res.data.candidatos)
                setAnuncioCandidatoFinal(res.data.candidatoFinalID)
                res.data.candidatos.some(function (candidato) {
                    console.log(candidato.candidatoID == jwtDecode(localStorage.getItem("token")))
                })
                axios.get("https://hora-site.herokuapp.com/api/finduser/" + res.data.criadorID)
                    .then(response => {
                        setAnuncioUserNome(response.data.nome + " " + response.data.apelido)
                        setAnuncioUserTrabalho(response.data.profissao)
                        setAnuncioUserFoto(response.data.foto)
                    })
            })
    }, [])

    const handleCandidatoFinal = (candidatoID, candidatoFoto) => {
        axios.put("https://hora-site.herokuapp.com/api/candidatofinal", { anuncioID: params.anuncioID, candidatoFoto: candidatoFoto, candidatoID: candidatoID, estado: "A decorrer" })
            .then(() => {
                window.location.reload(false)
                axios.put("https://hora-site.herokuapp.com/api/putnotificacao", { criadorID: candidatoID, CandidatoID: jwtDecode(localStorage.getItem("token")).id, anuncioID: params.anuncioID, categoria: "resposta-candidatura" })
            })
    }

    const handleEnviarMensagem = (id, foto, nome) => {
        anuncioUserId === jwtDecode(localStorage.getItem("token")).id ?
            axios.post('https://hora-site.herokuapp.com/api/criarconversa',
                {
                    enviadoPor: anuncioUserId,
                    recebidoPor: id,
                    enviadoPorNome: anuncioUserNome,
                    recebidoPorNome: nome,
                    enviadoPorFoto: anuncioUserFoto,
                    recebidoPorFoto: foto,
                    anuncioID: "chat"
                }).then(() => {
                    navigate("/mensagens")
                }).catch(
                    navigate("/mensagens")
                )
            :
            axios.post('https://hora-site.herokuapp.com/api/criarconversa',
                {
                    enviadoPor: id,
                    recebidoPor: anuncioUserId,
                    enviadoPorNome: nome,
                    recebidoPorNome: anuncioUserNome,
                    enviadoPorFoto: foto,
                    recebidoPorFoto: anuncioUserFoto,
                    anuncioID: "chat"
                }).then(() => {
                    navigate("/mensagens")
                }).catch(
                    navigate("/mensagens")
                )
    }

    return (
        <>
            {
                localStorage.getItem("token") != null ?
                    <div className='info-anuncio-container'>
                        <NavbarLogged />
                        <div className='info-anuncio-header'>
                            <p>Informações de anúncio</p>
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
                            <div className='candidatura-section'>
                                <div className='candidatura-section-header'>
                                    <p>Candidatos</p>
                                    <hr className='horizontal-line'></hr>
                                </div>
                                {anuncioCandidatos !== undefined ?
                                    <>
                                        {anuncioCandidatos.length !== 0 ?
                                            <div className='candidatos'>
                                                {anuncioCandidatos.map((candidato) =>
                                                    <>
                                                        <div className='candidato-body'>
                                                            <div className='candidato-info-button'>
                                                                <div className='info'>
                                                                    <Link to={"/perfil/" + candidato.candidatoID}>
                                                                        <img src={candidato.foto}></img>
                                                                    </Link>
                                                                    <div>
                                                                        <p className='nome'>{candidato.nome} {candidato.apelido}</p>
                                                                        <p className='profissao'>{candidato.profissao}</p>
                                                                    </div>
                                                                </div>
                                                                {anuncioEstado === "Em aberto" ?
                                                                    <div className='botões-candidatos'>
                                                                        <button onClick={() => handleCandidatoFinal(candidato.candidatoID, candidato.foto)} className='aceitar-btn'>Aceitar proposta</button>
                                                                        <button onClick={() => handleEnviarMensagem(candidato.candidatoID, candidato.foto, candidato.nome + " " + candidato.apelido)} className='aceitar-btn'>Enviar mensagem</button>
                                                                    </div>
                                                                    :
                                                                    <>
                                                                        {anuncioCandidatoFinal === candidato.candidatoID ? <button disabled className='candidato-aceite'>Candidato final</button> : null}
                                                                    </>
                                                                }

                                                            </div>
                                                            <div className='candidato-budget-mensagem'>
                                                                <div className='budget'>
                                                                    <p className='title'>Budget</p>
                                                                    <p className='body'>{candidato.oferta} ho:ra</p>
                                                                </div>
                                                                <div className='mensagem'>
                                                                    <p className='title'>Mensagem</p>
                                                                    <p className='body'>{candidato.mensagem}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            :
                                            <>
                                                <div className='candidato-body'>
                                                    <p className='nao-existem-candidatos'>Não existem candidatos</p>
                                                </div>
                                            </>}
                                    </>
                                    :
                                    <>
                                        <div className='candidato-body'>
                                            <p className='nao-existem-candidatos'>Não existem candidatos</p>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <Navigate to="/login" />
            }
        </>
    )
}
