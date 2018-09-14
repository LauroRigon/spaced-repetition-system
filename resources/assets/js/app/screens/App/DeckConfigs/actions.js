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
 * Modifica o valor do campo new_cards_day do formulario no state
 * @param {string} value
 */
export function setNewCardsDay (value) {
  return [
    {
      type: actions.SET_NEW_CARDS_DAY,
      payload: value
    },
    clearError('new_cards_day')
  ]
}

/**
 * Modifica o valor do campo auto_play_media no state
 * @param {string} value
 */
export function toogleAutoPlayMedia (value) {
  return [
    {
      type: actions.TOGGLE_AUTO_PLAY_MEDIA,
      payload: value
    }
  ]
}

/**
 * Modifica o valor do campo auto_play_media no state
 * @param {string} value
 */
export function setAutoPlayMedia (value) {
  return [
    {
      type: actions.SET_AUTO_PLAY_MEDIA,
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
 * Envia dados do formulario para criar deck config
 * @param {string('post', 'get'...)} method
 * @param {array} data = dados que serão enviados por ajax
 * @param {*} id = se for um update, passa o id do recurso sendo atualizado
 */
export function submitForm (method, data, dispatchOnSuccess = null, id = null) {
  return dispatch => {
    dispatch(setFormLoading(true))

    api[method]('decks/configs/' + (id || ''), data)
      .then(({ data }) => {
        // dispatch fetch list
        
        if (dispatchOnSuccess != null) {
          try {
            dispatch(dispatchOnSuccess())
          } catch (err) {}
        }
        
        dispatch([setFormLoading(false), setModalOpen(false), setModalUpdateOpen(false), clearForm()])

        toastr.success('Tudo certo!', data.message)
      })
      .catch(({ response }) => {
        if (response && (response.status == 422)) {
          dispatch([setFormLoading(false), setErrors(response.data.errors)])
        }
      })
  }
}

export function submitDeleteRequest(id, dispatchOnSuccess = null) {
  return dispatch => {
    const updataPath = id ? `/${id}` : ''
    api.delete('decks/configs' + updataPath)
    .then(({data}) => {
      toastr.success('Tudo certo!', (data.message))
      if (dispatchOnSuccess != null) {
        try {
          dispatch(dispatchOnSuccess())
        } catch (err) {}
      }
    })
    .catch(({response}) => {
      toastr.error('Ocorreu um erro!', (response.data && response.data.message))
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
      type: actions.SET_MODAL,
      payload: value
    },
    !value ? clearForm() : undefined
  ]
}

/**
 * Define se esta aberto ou fechado o modal de update
 * @param {boolean} value
 */
export function setModalUpdateOpen (value) {
  return [
    {
      type: actions.SET_UPDATE_MODAL,
      payload: value
    },
    !value ? clearForm() : undefined
  ]
}

/* ############CONFIG LIST ########### */

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

export function fetchDeckConfigList () {
  return dispatch => {
    dispatch(setFetching(true))
    api.get('/decks/configs/myConfigs')
      .then(response => {
        dispatch(setFetching(false))

        const dataFeched = response.data && response.data.data
        dispatch(setList(dataFeched))
      })
      .catch(({ response }) => {
        toastr.error(
          'Ocorreu um erro.',
          'Não foi possivel recuperar suas configurações.'
        )

        dispatch(setFetching(false))
      })
  }
}
