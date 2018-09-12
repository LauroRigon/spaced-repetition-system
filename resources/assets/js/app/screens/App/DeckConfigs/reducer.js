import * as actions from './action-types'
import { combineReducers } from 'redux'

const formInitialState = {
  data: {
    name: '',
    new_cards_day: '',
    auto_play_media: true
  },
  isLoading: false,
  errors: []
}

const configListInitialState = []

const uiInitialState = {
  modalOpen: false,
  modalUpdateOpen: false,
  isFetching: false
}

function form (state = formInitialState, action) {
  switch (action.type) {
    case actions.SET_NAME_FORM:
      return {
        ...state,
        data: { ...state.data, name: action.payload }
      }

    case actions.SET_NEW_CARDS_DAY:
      return {
        ...state,
        data: { ...state.data, new_cards_day: action.payload }
      }

    case actions.TOGGLE_AUTO_PLAY_MEDIA:
      return {
        ...state,
        data: { ...state.data, auto_play_media: !state.data.auto_play_media}
      }

    case actions.SET_AUTO_PLAY_MEDIA:
      const newValue = action.payload ? true : false
      return {
        ...state,
        data: { ...state.data, auto_play_media: newValue}
      }

    case actions.CLEAR_FORM:
      return { ...formInitialState }

    case actions.SET_FORM_LOADING:
      return { ...state, isLoading: action.payload }

    case actions.SET_ERRORS:
      return {
        ...state,
        errors: action.payload
      }

    case actions.CLEAR_ERROR:
      var newErrors = state.errors
      delete newErrors[action.payload]

      return {
        ...state,
        errors: {
          ...newErrors
        }
      }

    default:
      return state
  }
}

function ui (state = uiInitialState, action) {
  switch (action.type) {
    case actions.SET_MODAL:
      return { ...state, modalOpen: action.payload }

    case actions.SET_UPDATE_MODAL:
      return { ...state, modalUpdateOpen: action.payload }

    case actions.SET_FETCHING:
      return { ...state, isFetching: action.payload }

    default:
      return state
  }
}

function configList (state = configListInitialState, action) {
  switch (action.type) {
    case actions.SET_LIST:
      return action.payload

    default:
      return state
  }
}

export default combineReducers({ form, ui, configList })
