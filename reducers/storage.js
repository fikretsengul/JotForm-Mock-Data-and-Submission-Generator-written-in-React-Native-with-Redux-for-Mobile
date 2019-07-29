import { combineReducers } from 'redux'
import { UPDATE_USERNAME, UPDATE_PASSWORD, UPDATE_JOTAPI, UPDATE_PHOTO, UPDATE_FORMS } from '../actions/types'

const initial_storage = {
    jotapi: '6582cf035c783b2d5cdfccd0b5ecc840',
    mocapi: '5c75c230',
    forms: [],
    error: ''
    // 6582cf035c783b2d5cdfccd0b5ecc840
}

// ee9cc381d99ff681e1038acd5140311c

const storage = (state = initial_storage, action) => {
    switch (action.type) {
        case UPDATE_USERNAME:
            return { ...state, username: action.payload }
        case UPDATE_PASSWORD:
            return { ...state, password: action.payload }
        case UPDATE_JOTAPI:
            return { ...state, jotapi: action.payload }
        case UPDATE_PHOTO:
            return { ...state, photo: action.payload }
        case UPDATE_FORMS:
            return { ...state, forms: action.payload }
        default:
            return state
    }
}

const storageReducer = combineReducers({
    storage,
})

export default storageReducer