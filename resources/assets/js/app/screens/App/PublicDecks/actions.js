import * as actions from './action-types'
import { toastr } from 'react-redux-toastr'
import api from 'app/services/api'

function setIsFetching(value) {
  return {
    type: actions.SET_IS_FETCHING,
    payload: value
  }
}

function setList(items) {
  return {
    type: actions.SET_LIST,
    payload: items
  }
}

function setPaginator(paginator) {
  return {
    type: actions.SET_PAGINATOR,
    payload: paginator
  }
}

export function fetchList(url) {
  return dispatch => {
    dispatch(setIsFetching(true))

    api.get(url)
    .then((response) => {
      const { data, ...paginator} = response.data

      dispatch(setList(data))
      dispatch(setPaginator(paginator))
      dispatch(setIsFetching(false))
    })
    .catch(({response}) => {
      toastr.error('Ocorreu um erro!', 'Ocorreu um erro ao tentar recuperar decks públicos. Tente novamente!')
      dispatch(setIsFetching(false))
    })
  }
}