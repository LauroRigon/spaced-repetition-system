import * as actions from './action-types'
import { toastr } from 'react-redux-toastr'
import api from 'app/services/api'

import { SubmissionError } from 'redux-form'

/* ##########FORMULARIO############ */
export function setErrors(errors) {
  return {
    type: '@@redux-form/STOP_SUBMIT',
    meta: {
      form: 'deck'
    },
    payload: {...errors},
    error: true
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
    dispatch(setIsSubmitting(true))
    const updatePath = id ? `/${id}` : '';
    api[method]('decks' + updatePath, data)
      .then(({ data }) => {
        if (dispatchOnSuccess != null) {
          try {
            dispatch(dispatchOnSuccess())
          } catch (err) {}
        }
        dispatch([setModalOpen(false), setIsSubmitting(false)])

        toastr.success('Tudo certo!', data.message)
      })
      .catch(({ response }) => {
        if (response && (response.status == 422)) {
          dispatch([setErrors(response.data.errors), setIsSubmitting(false)])
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
  return {
      type: actions.SET_MODAL,
      payload: value
    }  
}

/**
 * Define se esta submetendo um post (para o loading)
 * @param {boolean} value
 */
export function setIsSubmitting(value) {
  return {
    type: actions.SET_SUBMITTING,
    payload: value
  }
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
