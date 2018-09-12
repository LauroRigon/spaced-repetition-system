import * as actions from '../../actions/user/action-types'

const initialState = {
  account: {
    id: null,
    name: '',
    email: ''
  },
  authToken: ' '
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.USER_LOGGED_IN:
      return {
        ...state,
        account: action.payload.account,
        authToken: action.payload.authToken
      }

    case actions.USER_LOGGED_OUT:
      return initialState

    case actions.SET_TOKEN:
      return { ...state, authToken: action.payload }

    default:
      return state
      break
  }
}
