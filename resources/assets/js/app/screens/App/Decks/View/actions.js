import * as actions from './action-types'
import api from 'app/services/api'
import { toastr } from 'react-redux-toastr'

export function setDeck (deck) {
  return {
    type: actions.SET_DECK,
    payload: deck
  }
}

export function fetchDeck (id, history = null) {
  return dispatch => {
    api
      .get(`/decks/${id}`)
      .then(({ data }) => {
        const deckFetched = data.data
        dispatch(setDeck(deckFetched))
      })
      .catch(({ response }) => {
        switch (response.status) {
          case 403:
            toastr.warning('Sem permissão', 'Você não pode ver esse deck!')
            pushTo('/decks', history)
            break

          case 404:
            toastr.warning('Não encontrado', 'O deck que você procura não foi encontrado!')
            pushTo('/decks', history)
            break

          default:
            toastr.error('Erro desconhecido', 'Ocorreu um erro desconhecido. Tente novamente!')
            break
        }
      })
  }
}

function pushTo(to, history) {
  try {
    history.push(to)
  } catch (err) {}
}

export function sendDeleteDeck (id, history) {
  return dispatch => {
     api.delete(`/decks/${id}`)
      .then(({ data }) => {
        toastr.success('Tudo certo!', data.message)
        pushTo('/decks', history)
      })
      .catch(({ response }) => {
        try {
        toastr.error('Ocorreu um erro', response.data.message)
        } catch(err){}
      })
  }
}
