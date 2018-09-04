import * as actions from './action-types';

const initialState = {
  form: {
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  },
  isLoading: false,
  errors: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_USER_NAME:
      return { ...state, form: { ...state.form, username: action.payload } }

    case actions.SET_EMAIL:
      return { ...state, form: { ...state.form, email: action.payload } }

    case actions.SET_PASSWORD:
      return { ...state, form: { ...state.form, password: action.payload } }

    case actions.SET_PASSWORD_CONFIRMATION:
      return { ...state, form: { ...state.form, password_confirmation: action.payload } }

    case actions.SET_LOADING:
      return { ...state, isLoading: action.payload }

    case actions.SET_ERRORS:
      return { ...state, errors: action.payload }

    case actions.CLEAR_ERRORS:
      if(!action.payload) {
        return { ...state, errors: [] }
      }

      let newErrorsObj = state.errors;
      action.payload.forEach(field => delete newErrorsObj[field]);

      return {...state, errors: newErrorsObj}

    default:
      return state;
  }
}

