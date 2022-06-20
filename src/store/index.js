import { configureStore } from '@reduxjs/toolkit'
import editingProfile from '../reducers/editingProfile'
import loggedUser from '../reducers/loggedUser'
import modalApagarAnuncio from '../reducers/modalApagarAnuncio'
import modalReview from '../reducers/modalReview'
import modalTop from '../reducers/modalTop'

export default configureStore({
  reducer: {
    logUser: loggedUser,
    editProfile: editingProfile,
    apagarModal: modalApagarAnuncio,
    reviewModal: modalReview,
    modalTop: modalTop
  },
})