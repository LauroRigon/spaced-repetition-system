import * as actions from './action-types'
import { toastr } from 'react-redux-toastr'
import api from 'app/services/api'
import Axios from 'axios'

/* ##########FORMULARIO############ */

/**
 * Modifica o valor do campo name do formulario no state
 * @param {string} value
 */
export function setName (value) {
  return [
    {
      type: actions.SET_NAME_FORM,
      payload: value
    },
    clearError('name')
  ]
}

/**
 * Modifica o valor do campo description do formulario no state
 * @param {string} value
 */
export function setDesc (value) {
  return [
    {
      type: actions.SET_DESC_FORM,
      payload: value || ''
    },
    clearError('description')
  ]
}

/**
 * Modifica o valor do campo name do folder no state
 * @param {string} value
 */
export function setFolder (value) {
  return [
    {
      type: actions.SET_FOLDER_FORM,
      payload: value || ''
    },
    clearError('folder')
  ]
}

export function setConfig (value) {
  return [
    {
      type: actions.SET_CONFIG_FORM,
      payload: value
    }
  ]
}

export function setIsPublic (value) {
  return [
    {
      type: actions.SET_IS_PUBLIC,
      payload: value
    }
  ]
}

export function toggleIsPublic (value) {
  return [
    {
      type: actions.TOGGLE_IS_PUBLIC,
      payload: value
    }
  ]
}

export function clearForm () {
  return {
    type: actions.CLEAR_FORM
  }
}

export function setFormLoading (value) {
  return {
    type: actions.SET_FORM_LOADING,
    payload: value
  }
}

export function setErrors (value) {
  return {
    type: actions.SET_ERRORS,
    payload: value
  }
}

export function clearError (errorName) {
  return {
    type: actions.CLEAR_ERROR,
    payload: errorName
  }
}

/**
 * Envia dados do formulario para criar deck
 * @param {string('post', 'get'...)} method
 * @param {array} data = dados que serão enviados por ajax
 * @param {*} id = se for um update, passa o id do recurso sendo atualizado
 */
export function submitForm (method, data, dispatchOnSuccess = null, id = null) {
  return dispatch => {
    dispatch(setFormLoading(true))

    api[method]('decks/' + (id || ''), data)
      .then(({ data }) => {
        // dispatch fetch list
        
        if (dispatchOnSuccess != null) {
          try {
            dispatch(dispatchOnSuccess())
          } catch (err) {}
        }
        
        dispatch([setFormLoading(false), setModalOpen(false), clearForm()])

        toastr.success('Tudo certo!', data.message)
      })
      .catch(({ response }) => {
        if (response && (response.status == 422)) {
          dispatch([setFormLoading(false), setErrors(response.data.errors)])
        }
      })
  }
}

/* ##########UI############ */

/**
 * Define se esta aberto ou fechado o modal
 * @param {boolean} value
 */
export function setModalOpen (value) {
  return [
    {
      type: actions.SET_MODAL_CREATE,
      payload: value
    },
    !value ? clearForm() : undefined
  ]
}

/* ############DECK LIST ########### */

export function setFetching (value) {
  return {
    type: actions.SET_FETCHING,
    payload: value
  }
}

export function setList (decks) {
  return {
    type: actions.SET_LIST,
    payload: decks
  }
}

export function fetchDeckList () {
  return dispatch => {
    dispatch(setFetching(true))
    api
      .get('/decks')
      .then(response => {
        dispatch(setFetching(false))

        const dataFeched = response.data && response.data.data
        dispatch(setList(dataFeched))
        // organizeByFolder(dataFeched)
      })
      .catch(({ response }) => {
        toastr.error(
          'Ocorreu um erro.',
          'Não foi possivel recuperar seus decks.'
        )

        dispatch(setFetching(false))
      })
  }
}
