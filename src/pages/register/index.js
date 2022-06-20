import React, { useState } from 'react'
import { NavbarSimple } from '../../components/navbar-simple'
import { Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios'

import './register.css'
import jwtDecode from 'jwt-decode';

export const Register = () => {
    const navigate = useNavigate()

    const [nome, setNome] = useState('')
    const [apelido, setApelido] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [erro, setErro] = useState('')

    async function registerUser(e) {
        e.preventDefault()

        const userData = JSON.stringify({ nome, apelido, email, password })
        if (nome != '' && apelido != '' && email != '' && password != '') {
            axios
                .post('https://hora-site.herokuapp.com/api/register', userData, { headers: { 'Content-Type': 'application/json' } })
                .then(
                    navigate("/login")
                )
        } else {
            setErro("Por favor, preencha todos os campos.")
        }
    }

    return (
        <>
            {localStorage.getItem("token") != null ?
                <Navigate to={"/perfil/" + jwtDecode(localStorage.getItem("token")).id} />
                :
                <>
                    <NavbarSimple />
                    <div className='container-register'>
                        <form className='form-register' onSubmit={registerUser}>
                            <h1>Registar</h1>
                            <input
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                type={"text"}
                                placeholder="Nome" />
                            <input
                                value={apelido}
                                onChange={(e) => setApelido(e.target.value)}
                                type={"text"}
                                placeholder="Apelido" />
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type={"text"}
                                placeholder="Email" />
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type={"password"}
                                placeholder="Palavra-passe" />
                            <p className='aviso-erro'>{erro}</p>
                            <button>Criar conta</button>
                            <span className='grey'>Já têm conta? <Link to='/login'><span className='blue-text'>Iniciar sessão</span></Link></span>
                        </form>
                    </div>
                </>
            }
        </>
    )
}