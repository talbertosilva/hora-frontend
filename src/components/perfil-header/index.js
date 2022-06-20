import { useSelector, useDispatch } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { MdLocationOn } from 'react-icons/md'
import { updateProfissao, updateLocalidade, updateFoto } from '../../reducers/loggedUser';

import FileBase64 from 'react-file-base64';

import './perfil-header.css'
import { turnEditOff, turnEditOn } from '../../reducers/editingProfile'
import jwtDecode from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export const PerfilHeader = ({ nome, apelido, profissao, localidade, estrelas }) => {
    const edit = useSelector((state) => state.editProfile.editing)
    const utilizador = useSelector((state) => state.logUser.user)

    const [utilizadorAtual, setUtilizadorAtual] = useState()
    const [utilizadorPerfil, setUtilizadorPerfil] = useState()

    const [image, setImage] = useState()

    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleProfissao = (e) => {
        dispatch(updateProfissao(e))
    }

    const handleLocalidade = (e) => {
        dispatch(updateLocalidade(e))
    }

    const handleFoto = (e) => {
        dispatch(updateFoto(e))
    }

    useEffect(() => {
        axios.get('https://hora-site.herokuapp.com/api/finduser/' + params.UtilizadorID)
            .then(res => {
                setUtilizadorPerfil(res.data)
                console.log(res.data)
            })
        axios.get('https://hora-site.herokuapp.com/api/finduser/' + jwtDecode(localStorage.getItem("token")).id)
            .then(res => {
                setUtilizadorAtual(res.data)
                console.log(res.data)
            })
    }, [])


    const handleEnviarMensagem = () => {
        axios.post('https://hora-site.herokuapp.com/api/criarconversa',
            {
                enviadoPor: utilizadorAtual._id,
                recebidoPor: utilizadorPerfil._id,
                enviadoPorNome: utilizadorAtual.nome + " " + utilizadorAtual.apelido,
                recebidoPorNome: utilizadorPerfil.nome + " " + utilizadorPerfil.apelido,
                enviadoPorFoto: utilizadorAtual.foto,
                recebidoPorFoto: utilizadorPerfil.foto,
                anuncioID: "chat"
            }).then(() => {
                navigate("/mensagens")
            }).catch(
                navigate("/mensagens")
            )
    }

    const handleEdit = async () => {
        if (edit === true) {
            dispatch(turnEditOff());
        } else {
            dispatch(turnEditOn());
        }
    }

    return (
        <div className='container-full-header'>
            <div className='container-inside-header'>
                <div className='container-user-data'>
                    <div className='header-profile-image'>
                        {utilizador.foto != null ? <img src={utilizador.foto} alt=''></img> : <img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn150.picsart.com%2Fupscale-245339439045212.png&f=1&nofb=1' alt=''></img>}
                    </div>
                    <div className='header-user-info'>
                        <div className='nome-estrelas'>
                            <p className='nome'>{nome} {apelido}</p>
                        </div>
                        <input disabled={!edit} value={utilizador.profissao} className={edit ? 'profissao-editing' : 'profissao'} onChange={(e) => handleProfissao(e.target.value)}></input>
                        <div className='localidade-container'>
                            <MdLocationOn size={18} />
                            <input disabled={!edit} value={utilizador.localidade} className={edit ? 'localidade-editing' : 'localidade'} onChange={(e) => handleLocalidade(e.target.value)}></input>
                        </div>
                        {edit ?
                            <div className='filebase'>
                                <FileBase64
                                    multiple={false}
                                    onDone={({ base64 }) => {
                                        setImage(base64)
                                        handleFoto(base64)
                                    }} />
                            </div>
                            : null
                        }
                    </div>
                </div>
                <div className='header-buttons'>
                    {utilizador._id === jwtDecode(localStorage.getItem("token")).id ? <button className='simple-button' onClick={() => handleEdit()}>{edit ? "Concluir edição" : "Editar perfil"}</button> : null}
                    {utilizador._id !== jwtDecode(localStorage.getItem("token")).id ? <button className='green-button' onClick={() => handleEnviarMensagem()}>Enviar mensagem</button> : null}
                </div>
            </div>
        </div>
    )
}
