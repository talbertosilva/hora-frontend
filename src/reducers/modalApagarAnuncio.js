import { createSlice } from "@reduxjs/toolkit";

export const modalApagarAnuncioSlice = createSlice({
    name: 'apagarModal',
    initialState: {
        apagarModal: false
    },
    reducers: {
        turnModalOn: (state) => {
            state.apagarModal = true
        },
        turnModalOff: (state) => {
            state.apagarModal = false
        }
    },
})

// Action creators are generated for each case reducer function
export const { turnModalOn, turnModalOff } = modalApagarAnuncioSlice.actions

export default modalApagarAnuncioSlice.reducer