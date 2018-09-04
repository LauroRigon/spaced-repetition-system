import * as actions from './action-types';
import { userLoggedIn } from '../../../actions/user';

import axios from 'axios';
import { toastr } from 'react-redux-toastr';

export function setEmail(value) {
  return {
    type: actions.SET_EMAIL,
    payload: value,
  };
}

export function setPassword(value) {
  return {
    type: actions.SET_PASSWORD,
    payload: value
  };
}

export function setRemember() {
  return {
    type: actions.SET_REMEMBER,
  };
}

export function clearInputs() {
  return {
    type: actions.CLEAR_INPUTS,
  };
}

export function setErrors(errors) {
  return {
    type: actions.SET_ERRORS,
    payload: errors
  };
}

export function setLoading(value) {
  return {
    type: actions.SET_LOADING,
    payload: value
  };
}

export function submitLogin(payload) {
  return dispatch => {
    dispatch(setLoading(true));

    axios.post('/api/login', payload)
      .then(response => {
        dispatch(setLoading(false));
        dispatch(userLoggedIn(response.data.data));
      })
      .catch(({ response }) => {
        dispatch(setLoading(false));
        toastr.error("Usuário ou senha inválido!", 'Falha ao efetuar login!');
      });

  };
}

