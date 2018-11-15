import * as actions from './action-types'

const initialState = {
  reviewAmountByDate: {},
  ui: {
    fetchingData: false
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case actions.SET_REVIEW_AMOUNT:
      return {...state, reviewAmountByDate: action.payload}

    case actions.SET_FETCHING:
      return {...state, ui: {...state.ui, fetchingData: action.payload} }    

    default:
      return state
  }

}