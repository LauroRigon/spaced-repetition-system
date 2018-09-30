import * as actions from './action-types'

const initialState = {
  publicDecksList: [],
  paginator: {},
  isFetching: false
}

function decksList (state = initialState, action) {
  switch (action.type) {
    case actions.SET_LIST:
      return { ...state, publicDecksList: action.payload }

    case actions.SET_PAGINATOR:
      return {...state, paginator: action.payload}
    
      case actions.SET_IS_FETCHING:
      return {...state, isFetching: action.payload}

    default:
      return state
  }
}

export default decksList
