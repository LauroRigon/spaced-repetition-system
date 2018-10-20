import * as actions from './action-types'

const initialState = {
  cardList: [],
  paginator: {},
  isFetching: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_CARDS:
      return {...state, cardList: action.payload}

    case actions.SET_PAGINATOR:
      return {...state, paginator: action.payload}
    
    case actions.SET_IS_FETCHING:
      return {...state, isFetching: action.payload}
    

    default:
      return state      
  }
}