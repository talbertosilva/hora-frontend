import axios from 'axios'
import jwtDecode from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { NavbarLogged } from '../../../components/navbar-logged'
import { modalTopMensagem, turnModalTopOff, turnModalTopOn } from '../../../reducers/modalTop'

import './criar-anuncio.css'

export const CriarAnuncio = () => {
    const [pedidoInput, setPedidoInput] = useState()
    const [prazoInput, setPrazoInput] = useState()
    const [budgetInput, setBudgetInput] = useState()
    const [userIMG, setUserIMG] = useState()

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [categoria, setCategoria] = useState("Escolha uma categoria")

    const [erro, setErro] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleDropdown = () => {
        setDropdownOpen(!dropdownOpen)
    }

    const handleCategoria = (e) => {
        setCategoria(e)
        setDropdownOpen(false)
    }

    useEffect(() => {
        const decoded = jwtDecode(localStorage.getItem("token"))
        axios.get("https://hora-site.herokuapp.com/api/finduser/" + decoded.id).then(res => setUserIMG(res.data.foto))
    }, [])


    const handlePublicar = () => {
        if (pedidoInput !== undefined && pedidoInput !== "" && prazoInput !== undefined && prazoInput !== "" && budgetInput !== undefined && budgetInput !== "" && categoria !== "Escolha uma categoria") {
            const decoded = jwtDecode(localStorage.getItem("token"))
            axios.post('https://hora-site.herokuapp.com/api/publicar-anuncio', {
                pedido: pedidoInput,
                duracao: prazoInput,
                budget: budgetInput,
                categoria: categoria,
                estado: "Em aberto",
                criadorID: decoded.id,
                criadorFoto: userIMG
            }).then(res => {
                dispatch(turnModalTopOn())
                dispatch(modalTopMensagem("An??ncio adicionado com sucesso!"))
                setTimeout(function () {
                    dispatch(turnModalTopOff())
                }, 2000)
                navigate("/anuncios")
            })
        } else {
            setErro(true)
            setTimeout(function () {
                setErro(false)
            }, 3000)
        }
    }

    return (<>
        {
            localStorage.getItem("token") != null ?
                <div className='criar-anuncio-container'>
                    <NavbarLogged />
                    <div className='criar-anuncio-header'>
                        <p>Criar um an??ncio</p>
                    </div>
                    <div className='criar-anuncio-inside-container'>
                        <div className='criar-header'>
                            <p>Informa????es do an??ncio</p>
                            <hr className='horizontal-line'></hr>
                        </div>
                        <div className='criar-body'>
                            <div className='criar-body-pedido'>
                                <p className='p'>Informa????es do an??ncio</p>
                                <textarea value={pedidoInput} onChange={(e) => setPedidoInput(e.target.value)} placeholder="Descreva o seu pedido..."></textarea>
                            </div>
                            <div className='criar-body-prazo-budget'>
                                <div className='prazo'>
                                    <p className='p'>Prazo (at?? quando precisa deste servi??o feito)</p>
                                    <input value={prazoInput} onChange={(e) => setPrazoInput(e.target.value)} placeholder='Ex: 9' type={"number"}></input>
                                </div>
                                <div className='budget'>
                                    <p className='p'>Or??amento (n??mero de ho:ra's dispon??veis para dar em troca)</p>
                                    <input value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)} placeholder='Ex: 4' type={"number"}></input>
                                </div>
                                <div>
                                    <p className='p'>Categoria</p>
                                    <p onClick={handleDropdown} className='categoria-click'>{categoria}</p>
                                    <div className={dropdownOpen ? 'dropdown-menu-open' : 'dropdown-menu-close'}>
                                        <ul>
                                            <li onClick={() => handleCategoria("Design")}>Design</li>
                                            <li onClick={() => handleCategoria("Marketing")}>Marketing</li>
                                            <li onClick={() => handleCategoria("Video")}>Video</li>
                                            <li onClick={() => handleCategoria("Neg??cios e economia")}>Neg??cios e economia</li>
                                            <li onClick={() => handleCategoria("Limpeza")}>Limpeza</li>
                                            <li onClick={() => handleCategoria("Atividades dom??sticas")}>Atividades dom??sticas</li>
                                            <li onClick={() => handleCategoria("Jardinagem")}>Jardinagem</li>
                                            <li onClick={() => handleCategoria("Carpintaria")}>Carpintaria</li>
                                            <li onClick={() => handleCategoria("Explica????es")}>Explica????es</li>
                                            <li onClick={() => handleCategoria("Arquitetura")}>Arquitetura</li>
                                            <li onClick={() => handleCategoria("Cuidados infantis")}>Cuidados infantis</li>
                                            <li onClick={() => handleCategoria("Eletricidade")}>Eletricidade</li>
                                            <li onClick={() => handleCategoria("Outros")}>Outros</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className='horizontal-line horizontal-line-bottom'></hr>
                        <div className='criar-alerta-button'>
                            {erro ? <p className='red'>Por favor, preencha todos os campos corretamente!</p> : null}
                            <button onClick={handlePublicar}>Publicar an??ncio</button>
                        </div>
                    </div>
                </div>
                :
                <Navigate to="/login" />
        }
    </>
    )
}
