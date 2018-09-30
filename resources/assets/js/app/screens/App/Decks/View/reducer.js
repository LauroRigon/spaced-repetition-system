import * as actions from './action-types'

const initialState = {
  deck: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_DECK:
      var newDeck = action.payload
      if(newDeck.pivot){
        newDeck.pivot.deck_config_id = newDeck.pivot.deck_config_id == null ? 0 : newDeck.pivot.deck_config_id
      }
      return { ...state, deck: newDeck }

    default:
      return state
  }
}
