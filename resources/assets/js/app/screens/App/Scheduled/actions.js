import * as actions from './action-types'
import { toastr } from 'react-redux-toastr'
import api from 'app/services/api'

function setFetching(value) {
  return {
    type: actions.SET_FETCHING,
    payload: value
  }
}


export function getReviewsAmountByDate () {
  return dispatch => {
    dispatch(setFetching(true))

    api.get('/calendar/scheduledReviews')
      .then(({ data: { data } }) => {
        console.log(data)
        dispatch([setFetching(false), setReviewAmountByDate(data)])

      })
      .catch(({ response }) => {
        dispatch(setFetching(false))
        switch (response.status) {
        
          default:
            toastr.error('Ocorreu um erro desconhecido.', 'Por favor, tente novamente!')
            break;
        }
      })
  }
}

function setReviewAmountByDate(value) {
  return {
    type: actions.SET_REVIEW_AMOUNT,
    payload: value
  }
}