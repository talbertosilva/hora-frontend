import { createSlice } from "@reduxjs/toolkit";

export const modalReviewSlice = createSlice({
    name: 'apagarModal',
    initialState: {
        reviewModal: false,
        reviewAnuncioID: null
    },
    reducers: {
        reviewAnuncio: (state, action) => {
            state.reviewAnuncioID = action.payload
        }, 
        turnModalOn: (state) => {
            state.reviewModal = true
        },
        turnModalOff: (state) => {
            state.reviewModal = false
        }
    },
})

// Action creators are generated for each case reducer function
export const { turnModalOn, turnModalOff, reviewAnuncio } = modalReviewSlice.actions

export default modalReviewSlice.reducer