import * as actions from './action-types'
import { toastr } from 'react-redux-toastr'
import api from 'app/services/api'

function setFetchingDeck(value) {
  return {
    type: actions.SET_FETCHING_DECK,
    payload: value
  }
}

function setReviewingDeck (deck) {
  return {
    type: actions.SET_REVIEWING_DECK,
    payload: deck
  }
}

function setCardsToReview (cards_ids) {
  return {
    type: actions.SET_CARDS_TO_REVIEW,
    payload: cards_ids
  }
}

export function getDeckToReview (id, onSuccess) {
  return dispatch => {
    dispatch(setFetchingDeck(true))

    api.get('decks/review/' + id)
      .then(({ data: { data } }) => {
        dispatch([setFetchingDeck(false), setReviewingDeck(data.deck), setCardsToReview(data.cards_to_review)])

        if(onSuccess) {
          onSuccess(data)
        }
      })
      .catch(({ response }) => {
        switch (response.status) {
          case 404:
            toastr.error('Ocorreu um erro!', 'Deck inexistente!')
            break;
        
          default:
            toastr.error('Ocorreu um erro desconhecido.', 'Por favor, tente novamente!')
            break;
        }
      })
  }
}

function setFetchingCard(value) {
  return {
    type: actions.SET_FETCHING_CARD,
    payload: value
  }
}

function setReviewingCard (card) {
  return {
    type: actions.SET_REVIEWING_CARD,
    payload: card
  }
}

export function getCardToReview (id, onSuccess = null) {
  return dispatch => {
    dispatch(setFetchingCard(true))

    api.get('decks/review/card/' + id)
      .then(({ data: { data } }) => {
        dispatch([setFetchingCard(false), setReviewingCard(data)])

        if(onSuccess) {
          onSuccess(data)
        }
      })
      .catch(({ response }) => {
        toastr.error('Ocorreu um erro!', 'Card inexistente!')
      })
  }
}

function setSubmitingAnswer(value) {
  return {
    type: actions.SET_SUBMITING_ANSWER,
    payload: value
  }
}

export function sendAnswer (card_id, answer, onSuccess = null) {
  return dispatch => {
    dispatch(setSubmitingAnswer(true))

    api.put('decks/review/answer/' + card_id, {value: answer})
      .then(({ data: { data } }) => {
        dispatch([setSubmitingAnswer(false), setReviewingCard({})])

        if(onSuccess) {
          onSuccess(data)
        }
      })
      .catch(({ response }) => {
        console.log(response)
        toastr.error('Ocorreu um erro!', 'Card inexistente!')
      })
  }
}

export function shiftCardsToReview () {
  return {
    type: actions.SHIFT_CARDS_TO_REVIEW
  }
}

export function setRevealAnswer (value) {
  return {
    type: actions.SET_REVEAL_ANSWER,
    payload: value
  }
}

export function setReviewDone (value) {
  return {
    type: actions.SET_REVIEW_DONE,
    payload: value
  }
}

export function resetState () {
  return {
    type: actions.RESET_STATE
  }
}