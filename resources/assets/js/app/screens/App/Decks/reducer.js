import * as actions from './action-types'
import { combineReducers } from 'redux'
import view from './View/reducer'

const formInitialState = {
  data: {
    name: '',
    description: '',
    folder: '',
    deck_config_id: 0,
    is_public: false
  },
  isLoading: false,
  errors: []
}

const decksListInitialState = []

const uiInitialState = {
  modalOpen: false,
  isFetching: false
}

function form (state = formInitialState, action) {
  switch (action.type) {
    case actions.SET_NAME_FORM:
      return {
        ...state,
        data: { ...state.data, name: action.payload }
      }

    case actions.SET_DESC_FORM:
      return {
        ...state,
        data: { ...state.data, description: action.payload }
      }

    case actions.SET_FOLDER_FORM:
      return {
        ...state,
        data: { ...state.data, folder: action.payload }
      }

    case actions.SET_CONFIG_FORM:
      return {
        ...state,
        data: { ...state.data, deck_config_id: (action.payload) ? action.payload : 0 }
      }
    
    case actions.TOGGLE_IS_PUBLIC:

      return {
        ...state,
        data: {
          ...state.data, is_public: ! state.data.is_public 
        }
      }

    case actions.SET_IS_PUBLIC:
      const newValue = action.payload ? true : false
      return {
        ...state,
        data: {
          ...state.data, is_public: newValue
        }
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
    case actions.SET_MODAL_CREATE:
      return { ...state, modalOpen: action.payload }

    case actions.SET_FETCHING:
      return { ...state, isFetching: action.payload }

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

export default combineReducers({ form, ui, decksList, view })
