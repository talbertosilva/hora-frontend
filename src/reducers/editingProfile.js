import { createSlice } from "@reduxjs/toolkit";

export const editingProfileSlice = createSlice({
    name: 'editProfile',
    initialState: {
        editing: false
    },
    reducers: {
        turnEditOn: (state) => {
            state.editing = true
        },
        turnEditOff: (state) => {
            state.editing = false
        }
    },
})

// Action creators are generated for each case reducer function
export const { turnEditOn, turnEditOff } = editingProfileSlice.actions

export default editingProfileSlice.reducer