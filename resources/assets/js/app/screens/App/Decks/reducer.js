import * as actions from './action-types'
import { combineReducers } from 'redux'
import view from './View/reducer'

const decksListInitialState = []

const uiInitialState = {
  modalOpen: false,
  isFetching: false,
  isSubmitting: false
}

function ui (state = uiInitialState, action) {
  switch (action.type) {
    case actions.SET_MODAL:
      return { ...state, modalOpen: action.payload }

    case actions.SET_FETCHING:
      return { ...state, isFetching: action.payload }

    case actions.SET_SUBMITTING:
      return { ...state, isSubmitting: action.payload }

    default:
      return state
  }
}

function decksList (state = decksListInitialState, action) {
  switch (action.type) {
    case actions.SET_LIST:
      return action.payload

    default:
      return state
  }
}

export default combineReducers({ ui, decksList, view })
