import * as actions from './action-types'
import api from 'app/services/api'
import { toastr } from 'react-redux-toastr'

export function setCards(cards) {
  return {
    type: actions.SET_CARDS,
    payload: cards
  }
}

export function setPaginator(paginator) {
  return {
    type: actions.SET_PAGINATOR,
    payload: paginator
  }
}

function setIsFetching(value) {
  return {
    type: actions.SET_IS_FETCHING,
    payload: value
  }
}

export function fetchCards(page = 1, onSuccess = null) {
  return (dispatch, getState) => {
    const filter = getState().form['cards-filter'] && getState().form['cards-filter'].values
    dispatch(setIsFetching(true))
    api.get(`/cards/search/?page=${page}`, { params: filter})
      .then((response) => {
        const { data, ...paginator } = response.data
        
        dispatch(setCards(data))
        dispatch(setPaginator(paginator))
        dispatch(setIsFetching(false))
        if(onSuccess) {
          onSuccess(response.data)
        }
      })
      .catch(({ response }) => {
        console.log(response)
        toastr.warning('Atenção', response.data.message)
        dispatch(setIsFetching(false))
      })
  }
}

export function suspendCard(card_id, onEnd) {
  return dispatch => {
    api.put('/cards/suspend/' + card_id)
      .then((response) => {
        toastr.success('Card suspenso com sucesso!')
        onEnd()
      })
      .catch((error) => {
        onEnd()
        toastr.error('Ocorreu um erro', 'Um erro impediu a suspensão do card. Tente novamente!')
      })
  }
}

export function unsuspendCard(card_id, onEnd) {
  return dispatch => {
    api.put('/cards/unsuspend/' + card_id)
      .then((response) => {
        toastr.success('Card continuado com sucesso!')
        onEnd()
      })
      .catch((error) => {
        onEnd()
        toastr.error('Ocorreu um erro', 'Um erro impediu a continuação do card. Tente novamente!')
      })
  }
}

export function deleteCard(card_id, onEnd) {
  return dispatch => {
    api.delete('/cards/' + card_id)
      .then((response) => {
        toastr.success('Tudo certo!', 'Card deletado com sucesso!')
        onEnd()
      })
      .catch((error) => {
        onEnd()
        toastr.error('Ocorreu um erro', 'Um erro impediu a exclusão do card. Tente novamente!')
      })
  }
}