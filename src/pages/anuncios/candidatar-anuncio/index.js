import axios from 'axios'
import jwtDecode from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { NavbarLogged } from '../../../components/navbar-logged'
import { updateUser } from '../../../reducers/loggedUser'
import { modalTopMensagem, turnModalTopOff, turnModalTopOn } from '../../../reducers/modalTop'

import './candidatar.css'

export const CandidatarAnuncio = () => {
    const [anuncioInfo, setAnuncioInfo] = useState()
    const [anuncioPrazo, setAnuncioPrazo] = useState()
    const [anuncioBudget, setAnuncioBudget] = useState()
    const [anuncioUserId, setAnuncioUserId] = useState()
    const [anuncioUserNome, setAnuncioUserNome] = useState()
    const [anuncioEstado, setAnuncioEstado] = useState()
    const [anuncioUserTrabalho, setAnuncioUserTrabalho] = useState()
    const [anuncioUserFoto, setAnuncioUserFoto] = useState()

    const [candidaturaMensagem, setCandidaturaMensagem] = useState()
    const [candidaturaOferta, setCandidaturaOferta] = useState()

    const [erro, setErro] = useState(false)
    const [candidatoExiste, setCandidatoExiste] = useState(false)
    const [erroCandidato, setErroCandidato] = useState(false)

    const dispatch = useDispatch()
    const params = useParams()
    const navigate = useNavigate()

    const utilizador = useSelector((state) => state.logUser.user)

    useEffect(() => {
        axios.get("https://hora-site.herokuapp.com/api/getanuncio/" + params.anuncioID)
            .then(res => {
                setAnuncioInfo(res.data.pedido)
                setAnuncioPrazo(res.data.duracao)
                setAnuncioBudget(res.data.budget)
                setAnuncioEstado(res.data.estado)
                setAnuncioUserId(res.data.criadorID)
                res.data.candidatos.some(function (candidato) {
                    setCandidatoExiste(candidato.candidatoID == jwtDecode(localStorage.getItem("token")).id)
                })
                axios.get("https://hora-site.herokuapp.com/api/finduser/" + res.data.criadorID)
                    .then(response => {
                        setAnuncioUserNome(response.data.nome + " " + response.data.apelido)
                        setAnuncioUserTrabalho(response.data.profissao)
                        setAnuncioUserFoto(response.data.foto)

                    })
                axios.get('https://hora-site.herokuapp.com/api/finduser/' + jwtDecode(localStorage.getItem("token")).id)
                    .then(res => {
                        dispatch(updateUser({
                            _id: res.data._id,
                            profissao: res.data.profissao,
                            nome: res.data.nome,
                            apelido: res.data.apelido,
                            email: res.data.email,
                            localidade: res.data.localidade,
                            sobre: res.data.sobre,
                            foto: res.data.foto,
                            servicos: res.data.servicos,
                            qualificacoes: res.data.qualificacoes
                        }))
                    })
            })
    }, [])

    const handleCandidatura = () => {
        if (candidaturaMensagem !== undefined && candidaturaMensagem !== "" && candidaturaOferta !== undefined && candidaturaOferta !== "" && candidatoExiste == false) {
            axios.put("https://hora-site.herokuapp.com/api/candidatar-anuncio", {
                anuncioID: params.anuncioID,
                candidatoID: utilizador._id,
                nome: utilizador.nome,
                apelido: utilizador.apelido,
                profissao: utilizador.profissao,
                foto: utilizador.foto,
                mensagem: candidaturaMensagem,
                oferta: candidaturaOferta
            }).then(res => {

                const decoded = jwtDecode(localStorage.getItem("token"))

                axios.put("https://hora-site.herokuapp.com/api/putnotificacao", { criadorID: anuncioUserId, CandidatoID: decoded.id, anuncioID: params.anuncioID, categoria: "candidatura" })

                dispatch(modalTopMensagem("Candidatura efetuada com sucesso!"))
                dispatch(turnModalTopOn())
                setTimeout(function () {
                    dispatch(turnModalTopOff())
                }, 2000)
                navigate("/anuncios")
            })
        } else {
            if(candidatoExiste){
                setErroCandidato(true)
                setTimeout(function () {
                    setErroCandidato(false)
                }, 3000)
            } else {
                setErro(true)
                setTimeout(function () {
                    setErro(false)
                }, 3000)
            }
            

        }
    }

    return (
        <>
            {
                localStorage.getItem("token") != null ?
                    <div className='candidatar-container'>
                        <NavbarLogged />
                        <div className='candidatar-header'>
                            <p>Candidatura</p>
                        </div>
                        <div className='candidatar-body'>
                            <div className='anuncio-section'>
                                <div className='anuncio-section-header'>
                                    <p>Informações do anúncio</p>
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
                                    <p>Candidatura</p>
                                    <hr className='horizontal-line'></hr>
                                </div>
                                <div className='candidatura-mensagem'>
                                    <p>Mensagem</p>
                                    <textarea value={candidaturaMensagem} onChange={(e) => setCandidaturaMensagem(e.target.value)} placeholder="Descreva o seu pedido..."></textarea>
                                </div>
                                <div className='candidatura-oferta'>
                                    <p>Em troca de... (número de ho:ra's)</p>
                                    <input value={candidaturaOferta} onChange={(e) => setCandidaturaOferta(e.target.value)} placeholder='Ex: 4' type={"number"}></input>
                                </div>
                                <div className='button-alert'>
                                    {erro ? <p className='red'>Por favor, preencha todos os campos corretamente!</p> : null}
                                    {erroCandidato ? <p className='red'>Já se candidatou a este anúncio!</p> : null}
                                    <button className='enviar-btn' onClick={handleCandidatura}>Enviar candidatura</button>
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
