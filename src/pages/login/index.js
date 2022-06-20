import React, { useState } from 'react'
import { NavbarSimple } from '../../components/navbar-simple'
import { Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios'

import './login.css'
import jwtDecode from 'jwt-decode';

export const Login = () => {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [erro, setErro] = useState('')

    async function handleLogin(e) {
        e.preventDefault()

        const userData = JSON.stringify({ email, password })

        if(email != '' && password != ''){
            axios
            .post('https://hora-site.herokuapp.com/api/login', userData, { headers: { 'Content-Type': 'application/json' } })
            .then(async res => {
                localStorage.setItem("token", res.data.token)
                navigate("/")
            }).catch((error) => setErro('Ocorreu um erro ao fazer login, verifique os campos preenchidos.'))
        } else {
            setErro('Por favor, preencha os devidos campos.')
        }
    }

    return (
        <>
            {localStorage.getItem("token") != null ?
                <Navigate to="/perfil" />
                :
                <>
                    <NavbarSimple />
                    <div className='container-login'>
                        <form className='form-login' onSubmit={handleLogin}>
                            <h1>Iniciar sessão</h1>
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
                            <button>Iniciar sessão</button>
                            <span className='grey'>Não têm conta? <Link to='/register'><span className='blue-text'>Registar</span></Link></span>
                        </form>
                    </div>
                </>
            }
        </>
    )
}