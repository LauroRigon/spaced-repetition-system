import * as actions from './action-types'

const initialState = {
  deck: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_DECK:
      return { ...state, deck: action.payload }

    default:
      return state
  }
}
