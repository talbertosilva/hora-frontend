import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { logout, updateUser } from '../../reducers/loggedUser';
import { NavbarLogged } from '../../components/navbar-logged'
import { PerfilHeader } from '../../components/perfil-header';
import axios from 'axios'
import jwt_decode from 'jwt-decode'

import './perfil.css'
import { PerfilBody } from '../../components/perfil-body';

export const Perfil = () => {
    const utilizador = useSelector((state) => state.logUser.user)
    const edit = useSelector((state) => state.editProfile.editing)
    const dispatch = useDispatch()
    const params = useParams()

    const [user, setUser] = useState()

    useEffect(() => {
        axios.get('https://hora-site.herokuapp.com/api/finduser/' + params.UtilizadorID)
            .then(res => {
                setUser(res.data)
                dispatch(updateUser({
                    _id: res.data._id,
                    profissao: res.data.profissao,
                    nome: res.data.nome,
                    apelido: res.data.apelido,
                    email: res.data.email,
                    localidade: res.data.localidade,
                    sobre: res.data.sobre,
                    servicos: res.data.servicos,
                    qualificacoes: res.data.qualificacoes,
                    foto: res.data.foto
                })) 
            })
    }, [])

    useEffect(() => {
        const decoded = jwt_decode(localStorage.getItem("token"));
        if(decoded.id === utilizador._id){
            async function putData() {
                await axios.put("https://hora-site.herokuapp.com/api/updateuser", {
                    id: utilizador._id,
                    profissao: utilizador.profissao,
                    localidade: utilizador.localidade,
                    sobre: utilizador.sobre,
                    servicos: utilizador.servicos,
                    qualificacoes: utilizador.qualificacoes,
                    foto: utilizador.foto
                }).then(
                    res => dispatch(updateUser(res.data))
                )
            }
            putData()
        } 
    }, [edit])

    return (
        <>
            {localStorage.getItem("token") != null ?
                <>
                    {user != null ?
                        <div className='perfil-container'>
                            <NavbarLogged />
                            <PerfilHeader
                                nome={user.nome}
                                apelido={user.apelido}
                                profissao={user.profissao}
                                localidade={user.localidade}/>
                            <PerfilBody
                                userID={params.UtilizadorID}
                                sobre={user.sobre != null ? user.sobre : null}
                                descricao={user.descricao != null ? user.descricao : null} />
                        </div>
                        : null}
                </>
                : <Navigate to="/login" />}
        </>
    )
}