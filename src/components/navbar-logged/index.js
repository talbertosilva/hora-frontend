import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode'

import './navbar-logged.css'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout } from '../../reducers/loggedUser';

export const NavbarLogged = () => {
    const [novaNotificacao, setNovaNotificacao] = useState(false)

    const [decoded, setDecoded] = useState("")

    const [notificacoes, setNotificacoes] = useState([])
    const [notificacaoEmpty, setNotificacoesEmpty] = useState(false)

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [dropdownPerfil, setDropdownPerfil] = useState(false)

    const [utilizadorFoto, setUtilizadorFoto] = useState()
    const [utilizadorMoedas, setUtilizadorMoedas] = useState()

    const [numeroNotificacoes, setNumeroNotificacoes] = useState(3)


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleDropdown = () => {
        setDropdownOpen(!dropdownOpen)
    }

    useEffect(() => {
        axios.get("https://hora-site.herokuapp.com/api/getnotificacao/" + decoded.id).then(res => {
            setNotificacoes(res.data)
            if (res.data.length === 0) {
                setNotificacoesEmpty(!notificacaoEmpty)
            }
            res.data.some(function (notificacao) {
                setNovaNotificacao(notificacao.visualizada === false)
                console.log(notificacao.visualizada === false)
            })
        })
    }, [dropdownOpen, numeroNotificacoes])

    useEffect(() => {
        setDecoded(jwt_decode(localStorage.getItem("token")))
        axios.get('https://hora-site.herokuapp.com/api/finduser/' + jwt_decode(localStorage.getItem("token")).id)
            .then(res => {
                setUtilizadorFoto(res.data.foto)
                setUtilizadorMoedas(res.data.moedas)
            })
    }, [])

    const handlePerfil = (id) => {
        window.location.reload(false)
        window.location.href = "/perfil/" + id
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        dispatch(logout())
        navigate("/")
        window.location.reload(false)
    }

    const handleLinkNotificação = (categoria, anuncioID) => {
        switch (categoria) {
            case "resposta-candidatura":
                navigate("/info-servico/" + anuncioID)
                break;
            case "candidatura":
                navigate("/info-anuncio/" + anuncioID)
                break;
            default:
                break;
        }
    }

    const handleServicos = () => {
        window.location.href = "/servicos"
    }

    const handleMensagens = () => {
        window.location.href = "/mensagens"
    }

    return (
        <div className='container-navbar-logged'>
            <Link to='/'><img src='https://i.postimg.cc/VvtFYYR4/Logo-Hora.png' alt='Logo Hora' /></Link>
            <div className='navbar-logged-buttons'>
                <div className='simple-btn'><Link className='link' to="/anuncios">Anúncios</Link></div>
                <div className='notificacoes'>
                    <p onClick={() => handleDropdown()} className='simple-btn'>Notificações</p>
                    <div className={dropdownOpen ? 'dropdown-menu-open' : 'dropdown-menu-close'}>
                        {notificacaoEmpty ?
                            <>
                                {notificacoes.slice(0, numeroNotificacoes).reverse().map((notificacao) =>
                                    <div className='blueprint-notificacao' onClick={() => handleLinkNotificação(notificacao.categoria, notificacao.anuncioID)} key={notificacao._id}>
                                        <p className='titulo-notificacao'>
                                            {notificacao.categoria === "candidatura" ? "Nova proposta!" : null}
                                            {notificacao.categoria === "resposta-candidatura" ? "Foi aceite!" : null}
                                        </p>
                                        <p className='body-notificacao'>
                                            {notificacao.categoria === "candidatura" ? "Alguém candidatou-se ao seu anúncio." : null}
                                            {notificacao.categoria === "resposta-candidatura" ? "A sua proposta foi aceite." : null}
                                        </p>
                                    </div>
                                )}
                                <div onClick={() => setNumeroNotificacoes(numeroNotificacoes + 3)} className='ver-mais'>
                                    <p>Ver mais</p>
                                </div>
                            </> :
                            <div className='blueprint-notificacao'>
                                <p className='titulo-notificacao'>Sem notificações</p>
                            </div>
                        }
                    </div>
                </div>
                <div className='icon-perfil'>
                    <img src={utilizadorFoto} className='simple-profile-image' onClick={() => setDropdownPerfil(!dropdownPerfil)}></img>
                    {dropdownPerfil ?
                        <div className='dropdown-perfil'>
                            <ul>
                                <li>
                                    <p className='moedas'>Saldo</p>
                                    <p className='moedas'>{utilizadorMoedas} ho:ra's</p>
                                </li>
                                <Link className='link' to={"/perfil/" + decoded.id}>Perfil</Link>
                                <Link className='link' to="/servicos">Serviços</Link>
                                <Link className='link' to="/mensagens">Mensagens</Link>
                                <li className='sair-conta' onClick={() => handleLogout()}>Sair da conta</li>
                            </ul>
                        </div>
                        : null}
                </div>
            </div>
        </div>
    )
}
