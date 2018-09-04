import * as actions from './action-types';

const initialState = {
  email: '',
  password: '',
  remember: false,
  errors: [],
  isLoading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_EMAIL:
      return { ...state, email: action.payload };

    case actions.SET_PASSWORD:
      return { ...state, password: action.payload };

    case actions.SET_REMEMBER:
      return { ...state, remember: !state.remember };

    case actions.CLEAR_INPUTS:
      return { ...state, ...initialState }

    case actions.SET_ERRORS:
      return { ...state, errors: action.payload }

    case actions.SET_LOADING:
      return { ...state, isLoading: action.payload}
    default:
      return state;
  }
}