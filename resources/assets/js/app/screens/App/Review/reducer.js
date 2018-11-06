import * as actions from './action-types'

const initialState = {
  reviewingDeck: {},
  reviewingCard: {},
  cardsToReview: [],
  ui: {
    submitingAnswer: false,
    fetchingDeck: false,
    fetchingCard: false,
    revealAnswer: false,
    reviewDone: false
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case actions.SET_REVIEWING_DECK:
      return {...state, reviewingDeck: action.payload}
    
    case actions.SET_REVIEWING_CARD:
      return {...state, reviewingCard: action.payload}

    case actions.SET_CARDS_TO_REVIEW:
      return {...state, cardsToReview: action.payload}
    
    case actions.SHIFT_CARDS_TO_REVIEW:
      var cardsToReviewUpdated = state.cardsToReview;
      cardsToReviewUpdated.shift()

      return {...state, cardsToReview: cardsToReviewUpdated}

    case actions.SET_FETCHING_DECK:
      return {...state, ui: {...state.ui, fetchingDeck: action.payload}}

    case actions.SET_SUBMITING_ANSWER:
      return {...state, ui: {...state.ui, submitingAnswer: action.payload}}

    case actions.SET_REVEAL_ANSWER:
      return {...state, ui: {...state.ui, revealAnswer: action.payload}}

    case actions.SET_REVIEW_DONE:
      return {...state, ui: {...state.ui, reviewDone: action.payload}}

    case actions.RESET_STATE:
      return initialState

    default:
      return state
  }

}