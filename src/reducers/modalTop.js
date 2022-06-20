import { createSlice } from "@reduxjs/toolkit";

export const modalTopSlice = createSlice({
    name: 'modalTop',
    initialState: {
        modalTop: false,
        mensagem: ''
    },
    reducers: {
        turnModalTopOn: (state) => {
            state.modalTop = true
        },
        turnModalTopOff: (state) => {
            state.modalTop = false
        },
        modalTopMensagem: (state, action) => {
            state.mensagem = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { turnModalTopOn, turnModalTopOff, modalTopMensagem } = modalTopSlice.actions

export default modalTopSlice.reducer