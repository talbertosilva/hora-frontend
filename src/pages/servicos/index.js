import React, { useEffect, useState } from 'react'
import { NavbarLogged } from '../../components/navbar-logged'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'

import './servicos.css'
import jwtDecode from 'jwt-decode'
import { NavbarHome } from '../../components/navbar-home'

import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { MdHelp } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { reviewAnuncio, turnModalOn } from '../../reducers/modalReview'
import { ModalReview } from '../../components/modal-review'
import { ModalTop } from '../../components/modal-top'

export const Servicos = () => {
    const [anuncios, setAnuncios] = useState([])
    const [decoded, setDecoded] = useState("")

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const reviewModal = useSelector((state) => state.reviewModal.reviewModal)
    const reviewFeedback = useSelector((state) => state.modalTop.modalTop)
    const modalMensagem = useSelector((state) => state.modalTop.mensagem)

    const [dropdownEstadoOpen, setDropdownEstadoOpen] = useState(false)
    const [estado, setEstado] = useState("Todos os serviços")

    const [helpVisible, setHelpVisible] = useState(false)
    const [estadoHover, setEstadoHover] = useState(0)

    const handleDropdownEstado = () => {
        setDropdownEstadoOpen(!dropdownEstadoOpen)
    }

    const handleEstado = (e) => {
        setEstado(e)
        setDropdownEstadoOpen(false)
    }

    const [windowDimenion, detectHW] = useState({
        winWidth: window.innerWidth,
        winHeight: window.innerHeight,
    })

    const detectSize = () => {
        detectHW({
            winWidth: window.innerWidth,
            winHeight: window.innerHeight,
        })
    }

    useEffect(() => {
        window.addEventListener('resize', detectSize)

        return () => {
            window.removeEventListener('resize', detectSize)
        }
    }, [windowDimenion])

    useEffect(() => {
        if (estado === "Todos os serviços") {
            axios.get('https://hora-site.herokuapp.com/api/gettodosservicos/' + jwtDecode(localStorage.getItem("token")).id)
                .then(res => {
                    setAnuncios(res.data.reverse())
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        setAnuncios([])
                    }
                })
        }
        if (estado === "Serviços terminados") {
            axios.get('https://hora-site.herokuapp.com/api/getanunciosterminados/' + jwtDecode(localStorage.getItem("token")).id)
                .then(res => {
                    setAnuncios(res.data.reverse())
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        setAnuncios([])
                    }
                })
        }
        if (estado === "Serviços pendentes") {
            axios.get('https://hora-site.herokuapp.com/api/getanunciospendentes/' + jwtDecode(localStorage.getItem("token")).id)
                .then(res => {
                    setAnuncios(res.data.reverse())
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        setAnuncios([])
                    }
                })
        }
        if (estado === "Serviços a decorrer") {
            axios.get('https://hora-site.herokuapp.com/api/getanunciosdecorrer/' + jwtDecode(localStorage.getItem("token")).id)
                .then(res => {
                    setAnuncios(res.data.reverse())
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        setAnuncios([])
                    }
                })
        }
    }, [estado])

    useEffect(() => {
        if (localStorage.getItem("token") !== null) {
            setDecoded(jwtDecode(localStorage.getItem("token")))
        }
        axios.get('https://hora-site.herokuapp.com/api/getanunciosestado/A decorrer/' + jwtDecode(localStorage.getItem("token")).id).then(res => setAnuncios(res.data.reverse()))
    }, [])

    const handlePerfil = (id) => {
        window.location.reload(false);
        window.location.href = "/perfil/" + id
    }

    const handleReview = (anuncioID) => {
        dispatch(reviewAnuncio(anuncioID))
        dispatch(turnModalOn())
    }

    return (
        <>
            {windowDimenion.winWidth > 1200 ?
                <div className='servicos-container'>
                    {localStorage.getItem("token") != null ? <NavbarLogged /> : <NavbarHome />}
                    {reviewModal ? <ModalReview /> : null}
                    {reviewFeedback ? <ModalTop Mensagem={modalMensagem}/> : null}
                    <div className='servicos-header'>
                        <div className='title-icon'>
                            <p className='titulo-pagina'>Serviços</p>
                            <div className='icon'>
                                <MdHelp onMouseEnter={() => setHelpVisible(true)} onMouseLeave={() => setHelpVisible(false)} size={24} fill="#8B8B8B" />
                                {helpVisible ? <p>Nesta página estão listados todos os serviços no qual já foi escolhido um candidato final, e por sua vez, se trata de uma troca a decorrer ou já terminado.</p> : null}
                            </div>
                        </div>
                        <div className='categoria-botão'>
                            <div className='dropdown'>
                                <p onClick={handleDropdownEstado} className='categoria-click'>{estado} {dropdownEstadoOpen ? <FaAngleUp size={16} /> : <FaAngleDown size={16} />}</p>
                                <div className={dropdownEstadoOpen ? 'dropdown-selecao-open' : 'dropdown-selecao-close'}>
                                    <ul>
                                        <li onClick={() => handleEstado("Todos os serviços")}>Todos os serviços</li>
                                        <li onClick={() => handleEstado("Serviços a decorrer")}>Serviços a decorrer</li>
                                        <li onClick={() => handleEstado("Serviços pendentes")}>Serviços pendentes</li>
                                        <li onClick={() => handleEstado("Serviços terminados")}>Serviços terminados</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='table-header'>
                        <ul>
                            <li className='data'>Data</li>
                            <li className='criador'>Criador</li>
                            <li className='candidato'>Candidato</li>
                            <li className='duracao'>Duração</li>
                            <li className='budget'>Orçamento</li>
                            <li className='estado'>Estado</li>
                            <li className='categoria'>Categoria</li>
                        </ul>
                    </div>

                    <div className='servicos-inside-container'>
                        {anuncios.map(anuncio =>
                            <div className='table-body' key={anuncio._id}>
                                <p className='data'>{moment(anuncio.data).utc().format('DD/MM/YYYY')}</p>
                                <div className='imagem'>
                                    <img
                                        onClick={() => handlePerfil(anuncio.criadorID)}
                                        alt='table-img'
                                        src={anuncio.criadorFoto}>
                                    </img>
                                </div>
                                <div className='imagem'>
                                    <img onClick={() => handlePerfil(anuncio.candidatoFinalID)} alt='table-img' src={anuncio.candidatoFinalFoto}></img>
                                </div>
                                <p className='duracao'>{anuncio.duracao} dias</p>
                                <p className='budget'>{anuncio.budget} ho:ra</p>
                                <div className='estado'>
                                    {anuncio.estado === "A decorrer" && anuncio.terminar.length !== 1 ?
                                        <>
                                            <div onMouseEnter={() => setEstadoHover(1)} onMouseLeave={() => setEstadoHover(0)} id="circulo-verde"></div>
                                            {estadoHover === 1 ? <p id='texto-decorrer'>A decorrer</p> : null}
                                        </>
                                        :
                                        null
                                    }
                                    {anuncio.estado === "Terminado" ?
                                        <>
                                            <div onMouseEnter={() => setEstadoHover(2)} onMouseLeave={() => setEstadoHover(0)} id="circulo-vermelho"></div>
                                            {estadoHover === 2 ? <p id='texto-terminado'>Terminado</p> : null}
                                        </>
                                        :
                                        null
                                    }
                                    {anuncio.terminar.length === 1 ?
                                        <>
                                            <div onMouseEnter={() => setEstadoHover(3)} onMouseLeave={() => setEstadoHover(0)} id="circulo-amarelo"></div>
                                            {estadoHover === 3 ? <p id='texto-pendente'>Pendente</p> : null}
                                        </>
                                        :
                                        null
                                    }
                                </div>
                                <p className='categoria'>{anuncio.categoria}</p>
                                <div className='btn'>
                                    <Link to={"/info-servico/" + anuncio._id}><button className='enviar-btn'>Detalhes</button></Link>
                                    {anuncio.estado === "Terminado" ? <button onClick={() => handleReview(anuncio._id)} className='review-btn'>Deixar uma review</button> : null}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                : null
            }
        </>

    )
}
