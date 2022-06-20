import React, { useEffect, useState } from 'react'
import { NavbarLogged } from '../../components/navbar-logged'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import moment from 'moment'

import { MdHelp } from 'react-icons/md'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'

import './anuncios.css'
import jwtDecode from 'jwt-decode'
import { NavbarHome } from '../../components/navbar-home'
import { Modal } from '../../components/modal'
import { useDispatch, useSelector } from 'react-redux'
import { turnModalOn } from '../../reducers/modalApagarAnuncio'
import { ModalTop } from '../../components/modal-top'

export const Anuncios = () => {
    const [anuncios, setAnuncios] = useState([])
    const [decoded, setDecoded] = useState("")
    const params = useParams()

    const apagarModal = useSelector((state) => state.apagarModal.apagarModal)
    const modalTop = useSelector((state) => state.modalTop.modalTop)
    const modalMensagem = useSelector((state) => state.modalTop.mensagem)
    const dispatch = useDispatch()

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [dropdownSelecaoOpen, setDropdownSelecaoOpen] = useState(false)
    const [categoria, setCategoria] = useState("Todas as categorias")
    const [selecao, setSelecao] = useState("Todos os anúncios")

    const [helpVisible, setHelpVisible] = useState(false)

    const handleDropdown = () => {
        setDropdownOpen(!dropdownOpen)
    }

    const handleDropdownSelecao = () => {
        setDropdownSelecaoOpen(!dropdownSelecaoOpen)
    }

    const handleCategoria = (e) => {
        setCategoria(e)
        setDropdownOpen(false)
    }

    const handleSelecao = (e) => {
        setSelecao(e)
        setDropdownSelecaoOpen(false)
    }

    moment.locale('pt')

    useEffect(() => {
        if (selecao !== "Todos os anúncios" && categoria === "Todas as categorias") {
            axios.get('https://hora-site.herokuapp.com/api/getanuncioutilizador/' + jwtDecode(localStorage.getItem("token")).id)
                .then(res => {
                    setAnuncios(res.data.reverse())
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        setAnuncios([])
                    }
                })
        } else if (selecao === "Todos os anúncios" && categoria !== "Todas as categorias") {
            axios.get('https://hora-site.herokuapp.com/api/getcategoriaanuncio/' + categoria)
                .then(res => {
                    if (categoria !== "Todas as categorias") {
                        setAnuncios(res.data.reverse())
                    } else {
                        setAnuncios([])
                    }
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        setAnuncios([])
                    }
                })
        } else if (selecao !== "Todos os anúncios" && categoria !== "Todas as categorias") {
            const UtilizadorID = jwtDecode(localStorage.getItem("token")).id

            axios.get('https://hora-site.herokuapp.com/api/getcategoriaselecaoanuncio/' + categoria + "/" + UtilizadorID)
                .then(res => {
                    setAnuncios(res.data.reverse())
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        setAnuncios([])
                    }
                })
        } else {
            axios.get('https://hora-site.herokuapp.com/api/getanuncios').then(res => {
                setAnuncios(res.data.reverse())
            })
        }
    }, [selecao, categoria])

    useEffect(() => {
        if (localStorage.getItem("token") !== null) {
            setDecoded(jwtDecode(localStorage.getItem("token")))
        }
        if (params.categoria !== undefined) {
            setCategoria(params.categoria)
            axios.get('https://hora-site.herokuapp.com/api/getcategoriaanuncio/' + params.categoria)
                .then(res => {
                    if (categoria !== "Todas as categorias") {
                        setAnuncios(res.data.reverse())
                    } else {
                        setAnuncios([])
                    }
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        setAnuncios([])
                    }
                })
        } else {
            setCategoria("Todas as categorias")
            axios.get('https://hora-site.herokuapp.com/api/getanuncios').then(res => {
                setAnuncios(res.data.reverse())
            })
        }
    }, [])

    const handlePerfil = (id) => {
        window.location.reload(false);
        window.location.href = "/perfil/" + id
    }

    const handleCandidatar = (id) => {
        window.location.reload(false);
        window.location.href = "/candidatar-anuncio/" + id
    }

    const handleCandidatos = (id) => {
        window.location.reload(false);
        window.location.href = "/info-anuncio/" + id
    }

    return (
        <>
            {modalTop ? <ModalTop Mensagem={modalMensagem}/> : null}
            <div className='anuncios-container'>
                {localStorage.getItem("token") != null ? <NavbarLogged /> : <NavbarHome />}
                <div className='anuncios-header'>
                <div className='title-icon'>
                    <p className='titulo-pagina'>Anúncios</p>
                    <div className='icon'>
                        <MdHelp onMouseEnter={() => setHelpVisible(true)} onMouseLeave={() => setHelpVisible(false)} size={24} fill="#8B8B8B" />
                        {helpVisible ? <p>Aqui estão listados os anúncios em aberto. Estes podem ser filtrados por diversas categorias.</p> : null}
                    </div>
                </div>
                    <div className='categoria-botão'>
                        <div className='dropdown'>
                            <p onClick={handleDropdownSelecao} className='categoria-click'>{selecao} {dropdownSelecaoOpen ? <FaAngleUp size={16}/> : <FaAngleDown size={16}/>}</p>
                            <div className={dropdownSelecaoOpen ? 'dropdown-selecao-open' : 'dropdown-selecao-close'}>
                                <ul>
                                    <li onClick={() => handleSelecao("Os meus anúncios")}>Os meus anúncios</li>
                                    <li onClick={() => handleSelecao("Todos os anúncios")}>Todos os anúncios</li>
                                </ul>
                            </div>
                        </div>
                        <div className='dropdown'>
                            <p onClick={handleDropdown} className='categoria-click'>{categoria} {dropdownOpen ? <FaAngleUp size={16}/> : <FaAngleDown size={16}/>}</p>
                            <div className={dropdownOpen ? 'dropdown-menu-open' : 'dropdown-menu-close'}>
                                <ul>
                                    <li onClick={() => handleCategoria("Todas as categorias")}>Todas as categorias</li>
                                    <li onClick={() => handleCategoria("Design")}>Design</li>
                                    <li onClick={() => handleCategoria("Marketing")}>Marketing</li>
                                    <li onClick={() => handleCategoria("Video")}>Video</li>
                                    <li onClick={() => handleCategoria("Negócios e economia")}>Negócios e economia</li>
                                    <li onClick={() => handleCategoria("Limpeza")}>Limpeza</li>
                                    <li onClick={() => handleCategoria("Atividades domésticas")}>Atividades domésticas</li>
                                    <li onClick={() => handleCategoria("Jardinagem")}>Jardinagem</li>
                                    <li onClick={() => handleCategoria("Carpintaria")}>Carpintaria</li>
                                    <li onClick={() => handleCategoria("Explicações")}>Explicações</li>
                                    <li onClick={() => handleCategoria("Arquitetura")}>Arquitetura</li>
                                    <li onClick={() => handleCategoria("Cuidados infantis")}>Cuidados infantis</li>
                                    <li onClick={() => handleCategoria("Eletricidade")}>Eletricidade</li>
                                    <li onClick={() => handleCategoria("Outros")}>Outros</li>
                                </ul>
                            </div>
                        </div>
                        <Link to="/criar-anuncio"><button>Adicionar um anúncio</button></Link>
                    </div>
                </div>
                <div className='table-header'>
                    <ul>
                        <li className='data'>Data</li>
                        <li className='criador'>Criador</li>
                        <li className='pedido'>Pedido</li>
                        <li className='duracao'>Duração</li>
                        <li className='budget'>Orçamento</li>
                    </ul>
                </div>
                <div className='anuncios-inside-container'>
                    {anuncios.map(anuncio =>
                        <div className='table-body' key={anuncio._id}>
                            <p className='data'>{moment(anuncio.data).utc().format('DD/MM/YYYY')}</p>
                            <div className='imagem'>
                                <img onClick={() => handlePerfil(anuncio.criadorID)} alt='table-img' src={anuncio.criadorFoto}></img>
                            </div>
                            <p className='texto'>{anuncio.pedido}</p>
                            <p className='duracao'>{anuncio.duracao} dias</p>
                            <p className='budget'>{anuncio.budget} ho:ra</p>
                            <div className='btn'>
                                <button onClick={decoded.id != anuncio.criadorID ? () => handleCandidatar(anuncio._id) : () => handleCandidatos(anuncio._id)} className='enviar-btn'>{decoded.id != anuncio.criadorID ? 'Enviar proposta' : 'Ver candidatos'}</button>
                                {decoded.id == anuncio.criadorID ? <button onClick={() => dispatch(turnModalOn())} className='apagar-anuncio-btn'>Apagar anúncio</button> : null}
                                {apagarModal ? <Modal anuncioID={anuncio._id}/>: null}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>

    )
}
