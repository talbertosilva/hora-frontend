import { createSlice } from "@reduxjs/toolkit";

export const loggedUserSlice = createSlice({
    name: 'logUser',
    initialState: {
        user: {
            nome: '',
            apelido: '',
            email: '',
            _id: '',
            created: '',
            localidade: '',
            profissao: '',
            sobre: '',
            foto: '',
            servicos: '',
            qualificacoes: ''
        }
    },
    reducers: {
        updateProfissao: (state, action) => {
            state.user.profissao = action.payload
        },
        updateLocalidade: (state, action) => {
            state.user.localidade = action.payload
        },
        updateSobre: (state, action) => {
            state.user.sobre = action.payload
        },
        updateQualificacoes: (state, action) => {
            state.user.qualificacoes = action.payload
        },
        updateServicos: (state, action) => {
            state.user.servicos = action.payload
        },
        updateUser: (state, action) => {
            state.user = action.payload
        },
        updateFoto: (state, action) => {
            state.user.foto = action.payload
        },
        logout: (state) => {
            state.user = null
        }
    },
})

// Action creators are generated for each case reducer function
export const { updateUser, logout, updateProfissao, updateLocalidade, updateSobre, updateQualificacoes, updateServicos, updateFoto } = loggedUserSlice.actions

export default loggedUserSlice.reducer