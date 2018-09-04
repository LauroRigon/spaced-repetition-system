import axios from 'axios';
import * as actions from './action-types';
import { userLoggedIn } from '../../../actions/user';


export function setUserName(value) {
  return [
    {
      type: actions.SET_USER_NAME,
      payload: value
    },
    clearErrors(['username'])
  ]
}

export function setEmail(value) {
  return [
    {
      type: actions.SET_EMAIL,
      payload: value
    },
    clearErrors(['email'])
  ]
}

export function setPassword(value) {
  return [
    {
      type: actions.SET_PASSWORD,
      payload: value
    },
    clearErrors(['password'])
  ]
}
export function setPasswordConfirmation(value) {
  return [
    {
      type: actions.SET_PASSWORD_CONFIRMATION,
      payload: value
    },
    clearErrors(['password', 'password_confirmation'])
  ]
}

/*
value = boolean
*/
export function setLoading(value) {
  return {
    type: actions.SET_LOADING,
    payload: value
  }
}

export function setErrors(errors) {
  return {
    type: actions.SET_ERRORS,
    payload: errors
  }
}

/*
error null = todos os erros são limpos
error array de campos = limpa apenas os erros dos campos do array
*/
export function clearErrors(error = null) {
  return {
    type: actions.CLEAR_ERRORS,
    payload: error
  }
}

export function submitRegistration(userData) {
  return dispatch => {
    //console.log(userData)
    dispatch(setLoading(true));

    axios.post('/api/register', userData)
      .then(response => {
        dispatch(userLoggedIn(response.data.data))

        dispatch(setLoading(false));
      })
      .catch(({ response }) => {

        if (response.status == 422) {
          dispatch(setErrors(response.data.errors));
        }

        dispatch(setLoading(false));
      });
  }
}
