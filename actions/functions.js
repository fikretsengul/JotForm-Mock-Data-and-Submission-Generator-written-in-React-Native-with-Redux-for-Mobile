import { UPDATE_USERNAME, UPDATE_PASSWORD, UPDATE_JOTAPI, UPDATE_PHOTO, UPDATE_FORMS } from './types'

export const updateUsername = (username) => {
    return {
        type: UPDATE_USERNAME,
        payload: username
    }
}

export const updatePassword = (password) => {
    return {
        type: UPDATE_PASSWORD,
        payload: password
    }
}

export const updateJotApi = (jotapi) => {
    return {
        type: UPDATE_JOTAPI,
        payload: jotapi
    }
}

export const updatePhoto = (photo) => {
    return {
        type: UPDATE_PHOTO,
        payload: photo
    }
}

export const updateForms = (forms) => {
    return {
        type: UPDATE_FORMS,
        payload: forms
    }
}